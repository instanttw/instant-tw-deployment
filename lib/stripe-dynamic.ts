/**
 * Dynamic Stripe Integration
 * Supports unlimited products without pre-creating Stripe products
 * Uses price_data for on-the-fly checkout sessions
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// ===========================================
// TYPES
// ===========================================

export type ProductType = 'plugin' | 'service' | 'subscription' | 'bundle';
export type PricingModel = 'one_time' | 'subscription' | 'hourly' | 'package';
export type BillingInterval = 'month' | 'year' | 'lifetime';

export interface DynamicProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  type: ProductType;
  images?: string[];
  metadata?: Record<string, string>;
}

export interface DynamicPricingTier {
  tier_name: string;
  display_name: string;
  price: number; // Amount in cents
  currency: string;
  pricing_model: PricingModel;
  billing_interval?: BillingInterval;
  site_limit?: number;
  features?: string[];
}

export interface CheckoutItem {
  product: DynamicProduct;
  pricingTier: DynamicPricingTier;
  quantity?: number;
}

export interface CheckoutOptions {
  items: CheckoutItem[];
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  couponCode?: string;
  allowPromotionCodes?: boolean;
  quantity?: number;
}

// ===========================================
// DYNAMIC CHECKOUT SESSION CREATION
// ===========================================

/**
 * Create a dynamic Stripe checkout session
 * Supports one-time payments and subscriptions
 */
export async function createDynamicCheckout(options: CheckoutOptions): Promise<Stripe.Checkout.Session> {
  const {
    items,
    userId,
    userEmail,
    successUrl,
    cancelUrl,
    metadata = {},
    couponCode,
    allowPromotionCodes = true,
  } = options;

  // Determine checkout mode
  const hasSubscription = items.some(item => item.pricingTier.pricing_model === 'subscription');
  const hasOneTime = items.some(item => item.pricingTier.pricing_model === 'one_time');
  
  // Stripe doesn't allow mixing subscription and one-time in same checkout
  // If both exist, we'll need to handle separately or use subscription mode with setup_future_usage
  const mode: Stripe.Checkout.SessionCreateParams.Mode = hasSubscription ? 'subscription' : 'payment';

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => {
    const { product, pricingTier, quantity = 1 } = item;
    
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity,
      price_data: {
        currency: pricingTier.currency.toLowerCase(),
        unit_amount: pricingTier.price,
        product_data: {
          name: `${product.name} - ${pricingTier.display_name}`,
          description: product.description || undefined,
          images: product.images || undefined,
          metadata: {
            product_id: product.id,
            product_slug: product.slug,
            product_type: product.type,
            tier_name: pricingTier.tier_name,
            site_limit: pricingTier.site_limit?.toString() || 'unlimited',
            ...(product.metadata || {}),
          },
        },
      },
    };

    // Add recurring data for subscriptions
    if (pricingTier.pricing_model === 'subscription' && pricingTier.billing_interval) {
      lineItem.price_data!.recurring = {
        interval: pricingTier.billing_interval === 'lifetime' ? 'year' : pricingTier.billing_interval,
        interval_count: 1,
      };
    }

    return lineItem;
  });

  // Prepare session metadata
  const sessionMetadata: Record<string, string> = {
    user_id: userId,
    product_count: items.length.toString(),
    checkout_type: mode,
    ...metadata,
  };

  // Add product IDs and types to metadata
  items.forEach((item, index) => {
    sessionMetadata[`product_${index}_id`] = item.product.id;
    sessionMetadata[`product_${index}_slug`] = item.product.slug;
    sessionMetadata[`product_${index}_type`] = item.product.type;
    sessionMetadata[`product_${index}_tier`] = item.pricingTier.tier_name;
  });

  // Build session parameters
  const baseUrl = process.env.NEXTAUTH_URL || 'https://wp.instant.tw';
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    customer_email: userEmail,
    line_items: lineItems,
    success_url: successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${baseUrl}/checkout/cancel`,
    metadata: sessionMetadata,
    allow_promotion_codes: allowPromotionCodes,
    billing_address_collection: 'required',
    payment_method_types: ['card'],
    invoice_creation: mode === 'payment' ? { enabled: true } : undefined,
  };

  // Add coupon if provided
  if (couponCode && mode === 'payment') {
    sessionParams.discounts = [{ coupon: couponCode }];
  }

  // Add subscription data for subscription mode
  if (mode === 'subscription') {
    sessionParams.subscription_data = {
      metadata: sessionMetadata,
    };
  }

  // Create the session
  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
}

// ===========================================
// SIMPLIFIED CHECKOUT HELPERS
// ===========================================

/**
 * Create checkout for a single product
 */
export async function createSingleProductCheckout(
  product: DynamicProduct,
  pricingTier: DynamicPricingTier,
  userId: string,
  userEmail: string,
  options?: Partial<CheckoutOptions>
): Promise<Stripe.Checkout.Session> {
  return createDynamicCheckout({
    items: [{ product, pricingTier, quantity: options?.quantity || 1 }],
    userId,
    userEmail,
    ...options,
  });
}

/**
 * Create checkout for a service with custom hours
 */
export async function createServiceCheckout(
  serviceProduct: DynamicProduct,
  hours: number,
  hourlyRate: number,
  userId: string,
  userEmail: string,
  options?: Partial<CheckoutOptions>
): Promise<Stripe.Checkout.Session> {
  const totalPrice = hours * hourlyRate * 100; // Convert to cents

  const customTier: DynamicPricingTier = {
    tier_name: 'custom',
    display_name: `${hours} hours at $${hourlyRate}/hour`,
    price: totalPrice,
    currency: 'usd',
    pricing_model: 'hourly',
  };

  return createDynamicCheckout({
    items: [{ product: serviceProduct, pricingTier: customTier }],
    userId,
    userEmail,
    metadata: {
      service_hours: hours.toString(),
      hourly_rate: hourlyRate.toString(),
    },
    ...options,
  });
}

/**
 * Create bundle checkout with discount
 */
export async function createBundleCheckout(
  items: CheckoutItem[],
  userId: string,
  userEmail: string,
  discountPercentage: number = 0,
  options?: Partial<CheckoutOptions>
): Promise<Stripe.Checkout.Session> {
  // Apply discount to items if needed
  const discountedItems = items.map(item => ({
    ...item,
    pricingTier: {
      ...item.pricingTier,
      price: Math.round(item.pricingTier.price * (1 - discountPercentage / 100)),
    },
  }));

  return createDynamicCheckout({
    items: discountedItems,
    userId,
    userEmail,
    metadata: {
      is_bundle: 'true',
      discount_percentage: discountPercentage.toString(),
    },
    ...options,
  });
}

// ===========================================
// CUSTOMER MANAGEMENT
// ===========================================

/**
 * Create or retrieve Stripe customer
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string,
  existingCustomerId?: string
): Promise<Stripe.Customer> {
  // If customer ID exists, try to retrieve
  if (existingCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(existingCustomerId);
      if (!customer.deleted) {
        return customer as Stripe.Customer;
      }
    } catch (error) {
      console.error('Error retrieving customer:', error);
    }
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      user_id: userId,
    },
  });

  return customer;
}

/**
 * Create customer portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<Stripe.BillingPortal.Session> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://wp.instant.tw';
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${baseUrl}/dashboard/billing`,
  });

  return session;
}

// ===========================================
// REFUNDS & CANCELLATIONS
// ===========================================

/**
 * Refund a payment
 */
export async function refundPayment(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<Stripe.Refund> {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount || undefined, // Undefined = full refund
    reason: reason as Stripe.RefundCreateParams.Reason || undefined,
  });

  return refund;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = false
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    // Cancel at end of current period
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } else {
    // Cancel immediately
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

// ===========================================
// WEBHOOK SIGNATURE VERIFICATION
// ===========================================

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Format price for display
 */
export function formatPrice(amountInCents: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

/**
 * Calculate bundle discount
 */
export function calculateBundleDiscount(
  items: CheckoutItem[],
  discountPercentage: number
): number {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.pricingTier.price * (item.quantity || 1);
  }, 0);
  
  return Math.round(subtotal * (discountPercentage / 100));
}

/**
 * Validate checkout items
 */
export function validateCheckoutItems(items: CheckoutItem[]): { valid: boolean; error?: string } {
  if (!items || items.length === 0) {
    return { valid: false, error: 'No items provided' };
  }

  for (const item of items) {
    if (!item.product || !item.product.id) {
      return { valid: false, error: 'Invalid product' };
    }
    if (!item.pricingTier || item.pricingTier.price < 0) {
      return { valid: false, error: 'Invalid pricing tier' };
    }
    if (item.quantity && item.quantity < 1) {
      return { valid: false, error: 'Invalid quantity' };
    }
  }

  return { valid: true };
}

export default {
  stripe,
  createDynamicCheckout,
  createSingleProductCheckout,
  createServiceCheckout,
  createBundleCheckout,
  getOrCreateCustomer,
  createPortalSession,
  refundPayment,
  cancelSubscription,
  verifyWebhookSignature,
  formatPrice,
  calculateBundleDiscount,
  validateCheckoutItems,
};
