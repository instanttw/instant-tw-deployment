/**
 * API Route: Stripe Webhook Handler
 * Handles Stripe events (payments, subscriptions, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, getPlanByPriceId } from '@/lib/stripe';
import { sql } from '@/lib/db-neon';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
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

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  // Update user with Stripe customer ID, subscription ID, and new plan
  await sql`
    UPDATE wp_scan_users
    SET 
      plan = ${plan}::plan_type,
      stripe_customer_id = ${customerId},
      stripe_subscription_id = ${subscriptionId},
      subscription_status = 'active',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;

  console.log(`✅ Checkout completed for user ${userId}, plan: ${plan}`);
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  if (!userId) {
    // Try to find user by customer ID
    const users = await sql`
      SELECT id FROM wp_scan_users
      WHERE stripe_customer_id = ${customerId}
      LIMIT 1
    `;

    if (users.length === 0) {
      console.error('User not found for subscription:', subscriptionId);
      return;
    }
  }

  // Get plan from subscription items
  const priceId = subscription.items.data[0]?.price.id;
  const planConfig = getPlanByPriceId(priceId);

  if (!planConfig) {
    console.error('Plan not found for price ID:', priceId);
    return;
  }

  // Map Stripe subscription status to our status
  const subscriptionStatus = ['active', 'trialing'].includes(status)
    ? 'active'
    : status === 'past_due'
    ? 'past_due'
    : status === 'canceled'
    ? 'canceled'
    : 'incomplete';

  // Update user subscription
  await sql`
    UPDATE wp_scan_users
    SET 
      plan = ${planConfig.plan}::plan_type,
      stripe_subscription_id = ${subscriptionId},
      subscription_status = ${subscriptionStatus},
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_customer_id = ${customerId}
  `;

  console.log(`✅ Subscription updated for customer ${customerId}, status: ${status}`);
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  // Downgrade user to FREE plan
  await sql`
    UPDATE wp_scan_users
    SET 
      plan = 'FREE'::plan_type,
      subscription_status = 'canceled',
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscriptionId}
  `;

  console.log(`✅ Subscription deleted for customer ${customerId}, downgraded to FREE`);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  // Ensure subscription is active
  await sql`
    UPDATE wp_scan_users
    SET 
      subscription_status = 'active',
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscriptionId}
  `;

  console.log(`✅ Payment succeeded for customer ${customerId}`);
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  // Mark subscription as past_due
  await sql`
    UPDATE wp_scan_users
    SET 
      subscription_status = 'past_due',
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscriptionId}
  `;

  console.log(`⚠️ Payment failed for customer ${customerId}`);
  
  // TODO: Send email notification about failed payment
}
