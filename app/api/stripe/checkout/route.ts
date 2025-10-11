/**
 * API Route: Create Stripe Checkout Session
 * Supports all product types: WP Scan, Hosting, Plugin Bundles
 * 
 * Accepts TWO field formats:
 * 1. Legacy format: { plan: "pro", billing: "monthly" }
 * 2. New format: { productId: "hosting-startup", billingCycle: "yearly" }
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, getProductByIdentifier, type StripeProduct } from '@/lib/stripe';
import { getUserByEmail } from '@/lib/db-wpscan';

export async function POST(request: Request) {
  // THIS API IS DEPRECATED - Use /api/checkout/dynamic instead
  return NextResponse.json(
    { 
      error: 'This API endpoint is deprecated. Please use /api/checkout/dynamic instead.',
      redirect: '/api/checkout/dynamic'
    },
    { status: 410 } // 410 Gone
  );
  
  /* OLD CODE - DISABLED
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Support both field formats
    let productId: string;
    let billingCycle: 'monthly' | 'yearly';
    
    // NEW FORMAT: { productId: "...", billingCycle: "..." }
    if (body.productId && body.billingCycle) {
      productId = body.productId;
      billingCycle = body.billingCycle;
    }
    // LEGACY FORMAT: { plan: "...", billing: "..." }
    else if (body.plan && body.billing) {
      productId = body.plan;
      billingCycle = body.billing === 'monthly' ? 'monthly' : 'yearly';
    }
    else {
      return NextResponse.json(
        { 
          error: 'Missing required fields. Provide either: (productId, billingCycle) OR (plan, billing)',
          received: Object.keys(body)
        },
        { status: 400 }
      );
    }

    // Normalize billing cycle
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle. Must be: monthly or yearly' },
        { status: 400 }
      );
    }

    // Get product configuration
    const productConfig: StripeProduct | null = getProductByIdentifier(productId, billingCycle);

    if (!productConfig) {
      return NextResponse.json(
        { 
          error: 'Product not found',
          details: `No product found for: ${productId} with ${billingCycle} billing`,
          supportedProducts: [
            'WP Scan: pro, agency, enterprise',
            'Hosting: hosting-startup, hosting-professional, hosting-growth, hosting-scale',
            'Plugins: plugins-pro, plugins-agency, plugins-enterprise'
          ]
        },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      
      // Note: Should update user record with customerId in production
      // await updateUserStripeCustomer(user.id, customer.id);
    }

    // Determine success URL based on product type
    const baseUrl = process.env.NEXTAUTH_URL || 'https://wp.instant.tw';
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${productConfig.productType}`;
    const cancelUrl = `${baseUrl}/checkout/cancel?product=${productConfig.productType}`;

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: productConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        plan: productConfig.plan,
        billing: productConfig.interval,
        productType: productConfig.productType,
        productId: productId,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: productConfig.plan,
          productType: productConfig.productType,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      product: {
        id: productId,
        name: productConfig.displayName,
        type: productConfig.productType,
        amount: productConfig.amount,
        interval: productConfig.interval,
      }
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
  */
}
