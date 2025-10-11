/**
 * Stripe Webhook Handler - Dynamic Products
 * Handles all Stripe events for dynamic product purchases
 * 
 * Events handled:
 * - checkout.session.completed - Creates orders and generates licenses
 * - customer.subscription.created/updated/deleted
 * - invoice.payment_succeeded/failed
 * - charge.refunded
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { verifyWebhookSignature } from '@/lib/stripe-dynamic';
import { 
  createOrder, 
  createOrderItem, 
  createLicense, 
  updateOrderStatus,
  logWebhookEvent,
  markWebhookProcessed,
  getOrderByStripeSession,
  updateLicenseStatus,
} from '@/lib/db-orders';
import { getProductBySlug } from '@/lib/db-products';
import { sendPurchaseConfirmationEmail } from '@/lib/email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Log webhook event to database
    await logWebhookEvent({
      event_id: event.id,
      event_type: event.type,
      stripe_account: event.account,
      api_version: event.api_version || undefined,
      payload: event,
    });

    console.log('📨 Webhook received:', {
      event_id: event.id,
      event_type: event.type,
      api_version: event.api_version,
    });

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionChange(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'charge.refunded':
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }

      console.log('✅ Webhook processed successfully:', event.id);
      await markWebhookProcessed(event.id, true);
      return NextResponse.json({ received: true });

    } catch (processingError) {
      console.error('❌ Error processing webhook:', processingError);
      const errorMessage = processingError instanceof Error ? processingError.message : 'Unknown error';
      await markWebhookProcessed(event.id, false, errorMessage);
      
      // Return 200 to prevent Stripe retries for non-retryable errors
      return NextResponse.json({ 
        received: true, 
        error: 'Processing error logged' 
      });
    }

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ===========================================
// EVENT HANDLERS
// ===========================================

/**
 * Handle checkout.session.completed
 * Creates order and generates licenses
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('💳 Checkout completed:', session.id);
  
  const metadata = session.metadata || {};
  const userId = metadata.user_id;

  if (!userId) {
    console.error('❌ No user_id in session metadata');
    throw new Error('Missing user_id in session metadata');
  }

  // Check if order already exists (prevent duplicate processing)
  const existingOrder = await getOrderByStripeSession(session.id);
  if (existingOrder) {
    console.log('⚠️ Order already exists:', existingOrder.order_number);
    return;
  }

  console.log('Order details:', {
    session_id: session.id,
    user_id: userId,
    customer_email: session.customer_details?.email,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
  });

  // Retrieve line items
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  // Create order
  const order = await createOrder({
    user_id: userId,
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
    stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : undefined,
    stripe_customer_id: typeof session.customer === 'string' ? session.customer : undefined,
    status: session.payment_status === 'paid' ? 'completed' : 'pending',
    subtotal: session.amount_subtotal || session.amount_total || 0,
    total_amount: session.amount_total || 0,
    currency: session.currency || 'usd',
    customer_email: session.customer_details?.email || undefined,
    customer_name: session.customer_details?.name || undefined,
    billing_address: session.customer_details?.address,
    items: lineItems.data.map(item => ({
      description: item.description,
      quantity: item.quantity,
      amount: item.amount_total,
    })),
    metadata: metadata,
  });

  console.log('✅ Order created:', order.order_number);

  // Arrays to store order details for email
  const emailProducts: Array<{ name: string; price: string }> = [];
  const emailLicenses: Array<{ product: string; key: string }> = [];

  // Create order items and licenses
  const isStripeProduct = (p: Stripe.Product | Stripe.DeletedProduct | null): p is Stripe.Product => {
    return !!p && (p as Stripe.DeletedProduct).deleted !== true;
  };

  for (const item of lineItems.data) {
    const priceData = item.price;
    const productData = typeof priceData?.product === 'object' ? priceData.product : null;
    
    if (!isStripeProduct(productData)) continue;
    if (!productData.metadata) continue;

    const productSlug = (productData.metadata as any).product_slug as string | undefined;
    const tierName = (productData.metadata as any).tier_name as string | undefined;

    if (!productSlug) continue;

    // Get product from database
    const product = await getProductBySlug(productSlug);
    if (!product) {
      console.error('❌ Product not found:', productSlug);
      continue;
    }

    // Create order item
    const orderItem = await createOrderItem({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      tier_name: tierName,
      quantity: item.quantity || 1,
      unit_price: item.price?.unit_amount || 0,
      total_price: item.amount_total || 0,
      currency: session.currency || 'usd',
      metadata: productData.metadata,
    });

    console.log('✅ Order item created:', orderItem.product_name);

    // Add to email products list
    const productDisplayName = tierName ? `${product.name} (${tierName})` : product.name;
    emailProducts.push({
      name: productDisplayName,
      price: formatCurrency(item.amount_total || 0, session.currency || 'usd'),
    });

    // Generate license (if product requires one)
    if (product.type !== 'service') {
      // Calculate expiration based on billing interval
      let expiresAt: Date | undefined;
      if (priceData?.recurring) {
        const interval = priceData.recurring.interval;
        const intervalCount = priceData.recurring.interval_count || 1;
        expiresAt = new Date();
        
        if (interval === 'month') {
          expiresAt.setMonth(expiresAt.getMonth() + intervalCount);
        } else if (interval === 'year') {
          expiresAt.setFullYear(expiresAt.getFullYear() + intervalCount);
        }
      }

      const license = await createLicense({
        order_id: order.id,
        order_item_id: orderItem.id,
        user_id: userId,
        product_id: product.id,
        tier_name: tierName,
        expires_at: expiresAt,
        metadata: {
          stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : undefined,
          stripe_price_id: priceData?.id,
        },
      });

      console.log('✅ License generated:', license.license_key);

      // Add to email licenses list
      emailLicenses.push({
        product: productDisplayName,
        key: license.license_key,
      });
    }
  }

  // Mark order as fulfilled
  if (session.payment_status === 'paid') {
    await updateOrderStatus(order.id, 'completed');
    console.log('✅ Order fulfilled:', order.order_number);
  }

  // Send confirmation email with order details and license keys
  try {
    const customerEmail = session.customer_details?.email || (session as any).customer_email || undefined;
    const customerName = session.customer_details?.name || 'Customer';

    if (customerEmail) {
      await sendPurchaseConfirmationEmail({
        to: customerEmail,
        customerName: customerName,
        orderNumber: order.order_number,
        products: emailProducts,
        licenses: emailLicenses,
        totalAmount: formatCurrency(session.amount_total || 0, session.currency || 'usd'),
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });

      console.log('✅ Purchase confirmation email sent to:', customerEmail);
    } else {
      console.warn('⚠️ No customer email available, skipping email');
    }
  } catch (emailError) {
    console.error('❌ Failed to send purchase confirmation email:', emailError);
    // Don't throw - we don't want email failures to prevent order processing
  }

  console.log('✅ Checkout fully processed:', order.order_number);
}

/**
 * Format currency amount for display
 */
function formatCurrency(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100;
  const currencySymbols: { [key: string]: string } = {
    usd: '$',
    eur: '€',
    gbp: '£',
  };
  
  const symbol = currencySymbols[currency.toLowerCase()] || currency.toUpperCase();
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Handle subscription created/updated
 * Update subscription status in database
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('📋 Subscription change:', subscription.id);
  console.log('Status:', subscription.status);
  
  // TODO: Find order by subscription ID and update status
  // This will be implemented when we need to handle subscription lifecycle
}

/**
 * Handle subscription deleted/canceled
 * Revoke access and notify user
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id);
  
  // TODO: Find licenses associated with this subscription and mark as expired
  // Send cancellation notification to user
}

/**
 * Handle successful invoice payment
 * Extend license for subscription renewals
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice paid:', invoice.id);

  if ((invoice as any).subscription) {
    console.log('Subscription renewed:', (invoice as any).subscription);
    
    // TODO: Find licenses for this subscription and extend expiration dates
    // Send renewal confirmation email
  }
}

/**
 * Handle failed invoice payment
 * Notify user of payment failure
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('⚠️ Invoice payment failed:', invoice.id);

  if ((invoice as any).subscription) {
    console.log('Subscription payment failed:', (invoice as any).subscription);
    
    // TODO: Send payment retry notification
    // Grace period before suspending access
  }
}

/**
 * Handle charge refunded
 * Revoke licenses and update order status
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('💸 Charge refunded:', charge.id);
  console.log('Amount:', charge.amount_refunded);

  const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
  
  if (paymentIntentId) {
    console.log('Payment Intent:', paymentIntentId);
    
    // TODO: Find order by payment intent, revoke licenses, update order status to refunded
  }
}
