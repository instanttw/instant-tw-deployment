/**
 * Dynamic Checkout API
 * Handles checkout for ALL product types:
 * - Individual plugins
 * - Services
 * - Subscriptions (WP Scan, Hosting, Plugin Bundles)
 * - Bundles
 * 
 * Uses Stripe price_data for unlimited scalability
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createDynamicCheckout,
  createSingleProductCheckout,
  createServiceCheckout,
  validateCheckoutItems,
  type CheckoutItem,
} from '@/lib/stripe-dynamic';
import {
  getProductBySlug,
  getPricingTier,
  getProductById,
} from '@/lib/db-products';

export async function POST(request: Request) {
  try {
    // Check authentication (optional - supports guest checkout)
    const session = await getServerSession(authOptions);
    
    // Guest checkout is allowed - user will enter email on Stripe
    const userEmail = session?.user?.email || 'guest@checkout.com';
    const userId = session?.user?.id || 'guest';

    const body = await request.json();
    const {
      items, // Array of {productSlug, tierName, quantity}
      productSlug, // For single product checkout
      tierName, // For single product checkout
      quantity = 1,
      serviceHours, // For service checkout
      hourlyRate, // For service checkout
      successUrl,
      cancelUrl,
      metadata = {},
    } = body;

    // ===========================================
    // SINGLE PRODUCT CHECKOUT
    // ===========================================
    if (productSlug && tierName && !items) {
      const product = await getProductBySlug(productSlug);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      const pricingTier = await getPricingTier(product.id, tierName);
      
      if (!pricingTier) {
        return NextResponse.json(
          { error: 'Pricing tier not found' },
          { status: 404 }
        );
      }

      // Convert to dynamic format
      const dynamicProduct = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.short_description || product.description,
        type: product.type as any,
        images: Array.isArray(product.images)
          ? product.images
          : (product.images ? [product.images] : undefined),
        metadata: {
          product_type: product.type,
          version: product.version || '',
        },
      };

      const dynamicTier = {
        tier_name: pricingTier.tier_name,
        display_name: pricingTier.display_name,
        price: pricingTier.price,
        currency: pricingTier.currency,
        pricing_model: pricingTier.pricing_model as any,
        billing_interval: pricingTier.billing_interval as any,
        site_limit: pricingTier.site_limit || undefined,
        features: Array.isArray(pricingTier.features)
          ? pricingTier.features
          : (pricingTier.features ? [pricingTier.features] : undefined),
      };

      // Create checkout session
      const stripeSession = await createSingleProductCheckout(
        dynamicProduct,
        dynamicTier,
        userId,
        userEmail,
        {
          quantity,
          successUrl,
          cancelUrl,
          metadata: {
            ...metadata,
            checkout_type: 'single_product',
          },
        }
      );

      return NextResponse.json({
        success: true,
        sessionId: stripeSession.id,
        url: stripeSession.url,
        product: {
          name: product.name,
          tier: pricingTier.display_name,
        },
      });
    }

    // ===========================================
    // SERVICE CHECKOUT (hourly/package)
    // ===========================================
    if (productSlug && serviceHours && hourlyRate && !tierName) {
      const product = await getProductBySlug(productSlug);
      
      if (!product || product.type !== 'service') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      const dynamicProduct = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.short_description || product.description,
        type: 'service' as const,
        images: Array.isArray(product.images)
          ? product.images
          : (product.images ? [product.images] : undefined),
      };

      const stripeSession = await createServiceCheckout(
        dynamicProduct,
        serviceHours,
        hourlyRate,
        userId,
        userEmail,
        {
          successUrl,
          cancelUrl,
          metadata: {
            ...metadata,
            checkout_type: 'service',
          },
        }
      );

      return NextResponse.json({
        success: true,
        sessionId: stripeSession.id,
        url: stripeSession.url,
        service: {
          name: product.name,
          hours: serviceHours,
          rate: hourlyRate,
          total: serviceHours * hourlyRate,
        },
      });
    }

    // ===========================================
    // MULTI-ITEM / BUNDLE CHECKOUT
    // ===========================================
    if (items && Array.isArray(items) && items.length > 0) {
      const checkoutItems: CheckoutItem[] = [];

      // Process each item
      for (const item of items) {
        const product = await (item.productId 
          ? getProductById(item.productId)
          : getProductBySlug(item.productSlug)
        );
        
        if (!product) {
          return NextResponse.json(
            { error: `Product not found: ${item.productSlug || item.productId}` },
            { status: 404 }
          );
        }

        const pricingTier = await getPricingTier(product.id, item.tierName);
        
        if (!pricingTier) {
          return NextResponse.json(
            { error: `Pricing tier not found: ${item.tierName} for ${product.name}` },
            { status: 404 }
          );
        }

        checkoutItems.push({
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.short_description || product.description,
            type: product.type as any,
            images: Array.isArray(product.images)
              ? product.images
              : (product.images ? [product.images] : undefined),
          },
          pricingTier: {
            tier_name: pricingTier.tier_name,
            display_name: pricingTier.display_name,
            price: pricingTier.price,
            currency: pricingTier.currency,
            pricing_model: pricingTier.pricing_model as any,
            billing_interval: pricingTier.billing_interval as any,
            site_limit: pricingTier.site_limit || undefined,
          },
          quantity: item.quantity || 1,
        });
      }

      // Validate items
      const validation = validateCheckoutItems(checkoutItems);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Create checkout session
      const stripeSession = await createDynamicCheckout({
        items: checkoutItems,
        userId: userId,
        userEmail: userEmail,
        successUrl,
        cancelUrl,
        metadata: {
          ...metadata,
          checkout_type: 'multi_item',
          item_count: items.length.toString(),
        },
      });

      return NextResponse.json({
        success: true,
        sessionId: stripeSession.id,
        url: stripeSession.url,
        items: checkoutItems.map(item => ({
          name: item.product.name,
          tier: item.pricingTier.display_name,
          quantity: item.quantity,
        })),
      });
    }

    // ===========================================
    // INVALID REQUEST
    // ===========================================
    return NextResponse.json(
      { 
        error: 'Invalid checkout request',
        hint: 'Provide either: (productSlug + tierName) for single product, (productSlug + serviceHours + hourlyRate) for service, or (items[]) for multi-item checkout'
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Dynamic checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ===========================================
// GET - Retrieve checkout session details
// ===========================================
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // GET endpoint doesn't require auth - just for session retrieval
    // if (!session || !session.user?.email) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Import stripe here to avoid circular dependency
    const { stripe } = await import('@/lib/stripe-dynamic');
    
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      session: {
        id: stripeSession.id,
        status: stripeSession.status,
        payment_status: stripeSession.payment_status,
        customer_email: stripeSession.customer_details?.email,
        amount_total: stripeSession.amount_total,
        currency: stripeSession.currency,
        metadata: stripeSession.metadata,
      },
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
