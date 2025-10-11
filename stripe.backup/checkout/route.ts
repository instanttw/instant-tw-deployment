import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// Product/Price mapping
const PRODUCT_PRICES = {
  // Pricing Plans
  "pro-monthly": process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  "pro-yearly": process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  "agency-monthly": process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID,
  "agency-yearly": process.env.STRIPE_AGENCY_YEARLY_PRICE_ID,
  "enterprise-monthly": process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
  "enterprise-yearly": process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,

  // WP Scan Plans
  "wpscan-pro-monthly": process.env.STRIPE_WPSCAN_PRO_MONTHLY_PRICE_ID,
  "wpscan-pro-yearly": process.env.STRIPE_WPSCAN_PRO_YEARLY_PRICE_ID,
  "wpscan-agency-monthly": process.env.STRIPE_WPSCAN_AGENCY_MONTHLY_PRICE_ID,
  "wpscan-agency-yearly": process.env.STRIPE_WPSCAN_AGENCY_YEARLY_PRICE_ID,
  "wpscan-enterprise-monthly": process.env.STRIPE_WPSCAN_ENTERPRISE_MONTHLY_PRICE_ID,
  "wpscan-enterprise-yearly": process.env.STRIPE_WPSCAN_ENTERPRISE_YEARLY_PRICE_ID,

  // Hosting Plans
  "hosting-startup-monthly": process.env.STRIPE_HOSTING_STARTUP_MONTHLY_PRICE_ID,
  "hosting-startup-yearly": process.env.STRIPE_HOSTING_STARTUP_YEARLY_PRICE_ID,
  "hosting-professional-monthly": process.env.STRIPE_HOSTING_PROFESSIONAL_MONTHLY_PRICE_ID,
  "hosting-professional-yearly": process.env.STRIPE_HOSTING_PROFESSIONAL_YEARLY_PRICE_ID,
  "hosting-growth-monthly": process.env.STRIPE_HOSTING_GROWTH_MONTHLY_PRICE_ID,
  "hosting-growth-yearly": process.env.STRIPE_HOSTING_GROWTH_YEARLY_PRICE_ID,
  "hosting-scale-monthly": process.env.STRIPE_HOSTING_SCALE_MONTHLY_PRICE_ID,
  "hosting-scale-yearly": process.env.STRIPE_HOSTING_SCALE_YEARLY_PRICE_ID,

  // Maintenance Plans
  "maintenance-pro-monthly": process.env.STRIPE_MAINTENANCE_PRO_MONTHLY_PRICE_ID,
  "maintenance-pro-yearly": process.env.STRIPE_MAINTENANCE_PRO_YEARLY_PRICE_ID,
  "maintenance-agency-monthly": process.env.STRIPE_MAINTENANCE_AGENCY_MONTHLY_PRICE_ID,
  "maintenance-agency-yearly": process.env.STRIPE_MAINTENANCE_AGENCY_YEARLY_PRICE_ID,
  "maintenance-enterprise-monthly": process.env.STRIPE_MAINTENANCE_ENTERPRISE_MONTHLY_PRICE_ID,
  "maintenance-enterprise-yearly": process.env.STRIPE_MAINTENANCE_ENTERPRISE_YEARLY_PRICE_ID,

  // Speed Optimization
  "speed-pro-monthly": process.env.STRIPE_SPEED_PRO_MONTHLY_PRICE_ID,
  "speed-pro-yearly": process.env.STRIPE_SPEED_PRO_YEARLY_PRICE_ID,
  "speed-agency-monthly": process.env.STRIPE_SPEED_AGENCY_MONTHLY_PRICE_ID,
  "speed-agency-yearly": process.env.STRIPE_SPEED_AGENCY_YEARLY_PRICE_ID,
  "speed-enterprise-monthly": process.env.STRIPE_SPEED_ENTERPRISE_MONTHLY_PRICE_ID,
  "speed-enterprise-yearly": process.env.STRIPE_SPEED_ENTERPRISE_YEARLY_PRICE_ID,

  // Security Services
  "security-pro-monthly": process.env.STRIPE_SECURITY_PRO_MONTHLY_PRICE_ID,
  "security-pro-yearly": process.env.STRIPE_SECURITY_PRO_YEARLY_PRICE_ID,
  "security-agency-monthly": process.env.STRIPE_SECURITY_AGENCY_MONTHLY_PRICE_ID,
  "security-agency-yearly": process.env.STRIPE_SECURITY_AGENCY_YEARLY_PRICE_ID,
  "security-enterprise-monthly": process.env.STRIPE_SECURITY_ENTERPRISE_MONTHLY_PRICE_ID,
  "security-enterprise-yearly": process.env.STRIPE_SECURITY_ENTERPRISE_YEARLY_PRICE_ID,

  // SEO Services
  "seo-pro-monthly": process.env.STRIPE_SEO_PRO_MONTHLY_PRICE_ID,
  "seo-pro-yearly": process.env.STRIPE_SEO_PRO_YEARLY_PRICE_ID,
  "seo-agency-monthly": process.env.STRIPE_SEO_AGENCY_MONTHLY_PRICE_ID,
  "seo-agency-yearly": process.env.STRIPE_SEO_AGENCY_YEARLY_PRICE_ID,
  "seo-enterprise-monthly": process.env.STRIPE_SEO_ENTERPRISE_MONTHLY_PRICE_ID,
  "seo-enterprise-yearly": process.env.STRIPE_SEO_ENTERPRISE_YEARLY_PRICE_ID,

  // Themes/Design
  "themes-pro-monthly": process.env.STRIPE_THEMES_PRO_MONTHLY_PRICE_ID,
  "themes-pro-yearly": process.env.STRIPE_THEMES_PRO_YEARLY_PRICE_ID,
  "themes-agency-monthly": process.env.STRIPE_THEMES_AGENCY_MONTHLY_PRICE_ID,
  "themes-agency-yearly": process.env.STRIPE_THEMES_AGENCY_YEARLY_PRICE_ID,
  "themes-enterprise-monthly": process.env.STRIPE_THEMES_ENTERPRISE_MONTHLY_PRICE_ID,
  "themes-enterprise-yearly": process.env.STRIPE_THEMES_ENTERPRISE_YEARLY_PRICE_ID,
} as const;

export async function POST(req: NextRequest) {
  try {
    const { productId, billingCycle = "monthly", metadata = {} } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const priceKey = `${productId}-${billingCycle}` as keyof typeof PRODUCT_PRICES;
    const priceId = PRODUCT_PRICES[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Invalid product/billing combination: ${priceKey}` },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        productId,
        billingCycle,
        ...metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_email: metadata.email || undefined,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
