import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout session completed:", session.id);
  
  // TODO: Implement database logic
  // 1. Create or update user record
  // 2. Create subscription record
  // 3. Generate license key
  // 4. Send welcome email with license key
  // 5. Grant access to purchased products

  const metadata = session.metadata || {};
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log("Customer ID:", customerId);
  console.log("Subscription ID:", subscriptionId);
  console.log("Product:", metadata.productId);
  console.log("Billing Cycle:", metadata.billingCycle);

  // Example: Save to database
  /*
  await db.subscription.create({
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      productId: metadata.productId,
      billingCycle: metadata.billingCycle,
      status: 'active',
      email: session.customer_details?.email,
    }
  });
  */
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id);
  
  // TODO: Update database with subscription details
  // 1. Activate user license
  // 2. Send confirmation email
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);
  
  // TODO: Update database
  // 1. Update subscription status
  // 2. Handle plan changes
  // 3. Update billing cycle
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);
  
  // TODO: Update database
  // 1. Mark subscription as cancelled
  // 2. Disable license after grace period
  // 3. Send cancellation confirmation email
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("Invoice paid:", invoice.id);
  
  // TODO: Update database
  // 1. Record payment
  // 2. Extend subscription period
  // 3. Send receipt email
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id);
  
  // TODO: Handle failed payment
  // 1. Send payment failure notification
  // 2. Mark subscription as past_due
  // 3. Attempt to collect payment again
}
