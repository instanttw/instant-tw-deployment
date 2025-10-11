# Quick Fix Guide - Get Checkout Working in 15 Minutes

## Problem Identified

The screenshots show **Stripe checkout failures** because **Stripe API keys are not configured**.

## Solution: Add Stripe Keys

### Step 1: Get Stripe Test Keys (5 minutes)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/register
   - Sign up if you don't have an account (it's free)
   
2. **Get API Keys**: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Click "Reveal test key" and copy **Secret key** (starts with `sk_test_`)

3. **Create Webhook**: https://dashboard.stripe.com/test/webhooks
   - Click "+ Add endpoint"
   - Endpoint URL: `http://localhost:3000/api/webhooks/stripe-dynamic` (for local testing)
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `customer.subscription.created`
     - `customer.subscription.deleted`
   - Click "Add endpoint"
   - Copy the **Signing secret** (starts with `whsec_`)

### Step 2: Update .env.local (2 minutes)

Open `.env.local` in your project and **uncomment and update** the Stripe section:

```bash
# Stripe Configuration - REQUIRED FOR CHECKOUT
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_KEY_HERE"
```

**Replace** `YOUR_KEY_HERE` with actual keys from Step 1.

### Step 3: Seed Database (2 minutes)

Ensure products are in the database:

```bash
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npx tsx scripts/seed-products-postgres.ts
```

Expected output:
```
🌱 Starting product seeding (PostgreSQL)...
✅ Database connected
📦 Seeding: WordPress Theme Design Services...
🎉 Seeding complete!
```

### Step 4: Test Locally (5 minutes)

```bash
# Start development server
npm run dev
```

Visit: http://localhost:3000/wp-scan/plans

**Test the checkout:**
1. Click "Upgrade to Pro" button
2. Sign in (or create a test account)
3. Should redirect to Stripe Checkout page
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
5. Click "Pay"
6. Should redirect to success page

**Success indicators:**
- ✅ Stripe Checkout loads (no error page)
- ✅ Can complete payment
- ✅ Redirects to `/checkout/success`
- ✅ Payment shows in Stripe Dashboard

## For Production (Vercel)

Once it works locally, add the same keys to Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Your publishable key
   - `STRIPE_SECRET_KEY` = Your secret key
   - `STRIPE_WEBHOOK_SECRET` = Your webhook secret
5. Update webhook endpoint URL to: `https://your-domain.com/api/webhooks/stripe-dynamic`
6. Redeploy

## Common Issues & Solutions

### Issue 1: "Unauthorized - Please sign in to checkout"
**Solution**: Create a test user account or sign in first.

```bash
# Create test user via signup page
http://localhost:3000/signup
```

### Issue 2: "Product not found"
**Solution**: Database not seeded. Run:
```bash
npx tsx scripts/seed-products-postgres.ts
```

### Issue 3: "Failed to create checkout session"
**Solution**: Check Stripe keys are correct and not expired.

### Issue 4: Webhook events not received
**Solution**: 
- For local testing, use Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe-dynamic
  ```
- For production, update webhook URL in Stripe Dashboard

## Test Card Numbers

Use these test cards for different scenarios:

- **Successful payment**: 4242 4242 4242 4242
- **Payment declined**: 4000 0000 0000 0002
- **3D Secure required**: 4000 0027 6000 3184

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Verification Checklist

- [ ] Stripe keys added to .env.local
- [ ] Database seeded with products
- [ ] Dev server running without errors
- [ ] Can access http://localhost:3000
- [ ] Can create/sign in to account
- [ ] Buy button redirects to Stripe (not error)
- [ ] Can complete test purchase
- [ ] Success page displays after payment
- [ ] Payment visible in Stripe Dashboard

## Next Steps

After checkout works:
1. Test on all pages (Themes, Hosting, WP Scan, etc.)
2. Deploy to production (Vercel)
3. Set up production Stripe keys
4. Test live mode
5. Implement order management (Phase 2)

## Support

- **Stripe Docs**: https://stripe.com/docs/testing
- **Test Cards**: https://stripe.com/docs/testing#cards
- **Webhook Testing**: https://stripe.com/docs/webhooks/test

---

**Estimated Time**: 15 minutes
**Difficulty**: Easy (just configuration)
**Status**: Ready to test immediately after adding keys
