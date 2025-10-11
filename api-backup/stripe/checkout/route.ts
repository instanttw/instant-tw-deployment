import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
  try {
    const { pluginId, tier, billingCycle } = await request.json();

    // TODO: Fetch plugin and pricing details from database
    // This is a placeholder implementation
    const priceData = {
      currency: "usd",
      unit_amount: 4900, // $49.00
      product_data: {
        name: "Plugin Pro License",
        description: "Pro tier access to the plugin",
      },
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/plugins/${pluginId}`,
      metadata: {
        pluginId,
        tier,
        billingCycle,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
