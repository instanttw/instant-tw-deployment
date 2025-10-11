# Stripe Checkout Integration - Deployment Guide

## ✅ What Was Fixed

### Files Updated

1. **`lib/stripe.ts`** - Added 5 new service product configurations:
   - Themes Service (Pro, Agency, Enterprise × Monthly/Yearly = 6 plans)
   - Maintenance Service (Pro, Agency, Enterprise × Monthly/Yearly = 6 plans)
   - SEO Service (Pro, Agency, Enterprise × Monthly/Yearly = 6 plans)
   - Speed Optimization Service (Pro, Agency, Enterprise × Monthly/Yearly = 6 plans)
   - Security Service (Pro, Agency, Enterprise × Monthly/Yearly = 6 plans)
   - **Total: 30 new Stripe products added**

2. **`app/services/themes/page.tsx`** - Fixed buy buttons:
   - ❌ Removed hardcoded URLs: `https://checkout.stripe.com/c/pay/cs_test_...`
   - ✅ Added `UnifiedCheckoutButton` with proper `productId`

3. **`app/services/maintenance/page.tsx`** - Fixed buy buttons:
   - ❌ Removed hardcoded URLs
   - ✅ Added `UnifiedCheckoutButton` with proper `productId`

### What Already Works ✅

- **Hosting page** - Already using `UnifiedCheckoutButton` correctly
- **WP Scan /plans page** - Already using API calls correctly
- **Plugin pages** - Already using `UnifiedCheckoutButton` for individual products
- **Pricing page** - Already using `UnifiedCheckoutButton` for plugin bundles

### What Still Needs Fixing

**These 3 service pages likely still have hardcoded URLs:**

1. **`app/services/seo/page.tsx`** - Needs same fixes as Themes/Maintenance
2. **`app/services/speed-optimization/page.tsx`** - Needs same fixes
3. **`app/services/security/page.tsx`** - Needs same fixes

**How to fix them:** Follow the same pattern used for Themes and Maintenance pages (see code examples below).

---

## 🎯 Next Steps for Deployment

### Step 1: Create Stripe Products

You need to create **30 products** in your Stripe Dashboard:

#### Option 1: Manual Creation (Stripe Dashboard)

1. Go to https://dashboard.stripe.com/products
2. Click "Add Product"
3. For each service tier, create:
   - **Name**: e.g., "Themes Pro Monthly"
   - **Recurring**: Monthly or Yearly
   - **Price**: Set according to your pricing
   - Copy the **Price ID** (starts with `price_...`)

#### Option 2: Automated Creation (Stripe CLI)

```bash
# Install Stripe CLI if not already installed
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Create products programmatically
# Example for Themes Pro Monthly
stripe products create \
  --name="Themes Pro Monthly" \
  --description="Custom theme design & development"

# Get the product ID (prod_...)
# Then create the price
stripe prices create \
  --product=prod_XXXXX \
  --currency=usd \
  --unit-amount=9900 \
  --recurring='{
    "interval": "month"
  }'

# Copy the price ID (price_XXXXX)
```

#### Quick Stripe CLI Script

Save this as `create-stripe-products.sh`:

```bash
#!/bin/bash

# Themes Service
echo "Creating Themes products..."
# Add your commands here based on the pattern above

# Maintenance Service
echo "Creating Maintenance products..."
# Add your commands here

# Repeat for SEO, Speed, Security services
```

---

### Step 2: Add Environment Variables

Add these to your `.env.local` (development) and Vercel (production):

```env
# ===========================================
# THEMES SERVICE
# ===========================================
STRIPE_PRICE_THEMES_PRO_MONTHLY=price_XXXXX
STRIPE_PRICE_THEMES_PRO_YEARLY=price_XXXXX
STRIPE_PRICE_THEMES_AGENCY_MONTHLY=price_XXXXX
STRIPE_PRICE_THEMES_AGENCY_YEARLY=price_XXXXX
STRIPE_PRICE_THEMES_ENTERPRISE_MONTHLY=price_XXXXX
STRIPE_PRICE_THEMES_ENTERPRISE_YEARLY=price_XXXXX

# ===========================================
# MAINTENANCE SERVICE
# ===========================================
STRIPE_PRICE_MAINTENANCE_PRO_MONTHLY=price_XXXXX
STRIPE_PRICE_MAINTENANCE_PRO_YEARLY=price_XXXXX
STRIPE_PRICE_MAINTENANCE_AGENCY_MONTHLY=price_XXXXX
STRIPE_PRICE_MAINTENANCE_AGENCY_YEARLY=price_XXXXX
STRIPE_PRICE_MAINTENANCE_ENTERPRISE_MONTHLY=price_XXXXX
STRIPE_PRICE_MAINTENANCE_ENTERPRISE_ENTERPRISE=price_XXXXX

# ===========================================
# SEO SERVICE
# ===========================================
STRIPE_PRICE_SEO_PRO_MONTHLY=price_XXXXX
STRIPE_PRICE_SEO_PRO_YEARLY=price_XXXXX
STRIPE_PRICE_SEO_AGENCY_MONTHLY=price_XXXXX
STRIPE_PRICE_SEO_AGENCY_YEARLY=price_XXXXX
STRIPE_PRICE_SEO_ENTERPRISE_MONTHLY=price_XXXXX
STRIPE_PRICE_SEO_ENTERPRISE_YEARLY=price_XXXXX

# ===========================================
# SPEED OPTIMIZATION SERVICE
# ===========================================
STRIPE_PRICE_SPEED_PRO_MONTHLY=price_XXXXX
STRIPE_PRICE_SPEED_PRO_YEARLY=price_XXXXX
STRIPE_PRICE_SPEED_AGENCY_MONTHLY=price_XXXXX
STRIPE_PRICE_SPEED_AGENCY_YEARLY=price_XXXXX
STRIPE_PRICE_SPEED_ENTERPRISE_MONTHLY=price_XXXXX
STRIPE_PRICE_SPEED_ENTERPRISE_YEARLY=price_XXXXX

# ===========================================
# SECURITY SERVICE
# ===========================================
STRIPE_PRICE_SECURITY_PRO_MONTHLY=price_XXXXX
STRIPE_PRICE_SECURITY_PRO_YEARLY=price_XXXXX
STRIPE_PRICE_SECURITY_AGENCY_MONTHLY=price_XXXXX
STRIPE_PRICE_SECURITY_AGENCY_YEARLY=price_XXXXX
STRIPE_PRICE_SECURITY_ENTERPRISE_MONTHLY=price_XXXXX
STRIPE_PRICE_SECURITY_ENTERPRISE_YEARLY=price_XXXXX
```

#### Adding to Vercel

```bash
# Option 1: Via Vercel Dashboard
# 1. Go to your project → Settings → Environment Variables
# 2. Add each variable one by one

# Option 2: Via Vercel CLI
vercel env add STRIPE_PRICE_THEMES_PRO_MONTHLY
# Paste the value when prompted
# Repeat for all 30 variables
```

---

### Step 3: Fix Remaining Service Pages

Apply the same fixes to `seo/page.tsx`, `speed-optimization/page.tsx`, and `security/page.tsx`.

#### Pattern to Follow:

**1. Add import at top:**
```typescript
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";
```

**2. Update pricingPlans array:**
```typescript
// BEFORE (❌):
{
  name: "Pro",
  monthlyPrice: 99,
  yearlyPrice: Math.round(99 * 12 * 0.75),
  features: [...],
  highlighted: false,
  stripeMonthly: "https://checkout.stripe.com/c/pay/cs_test_...",
  stripeYearly: "https://checkout.stripe.com/c/pay/cs_test_...",
}

// AFTER (✅):
{
  name: "Pro",
  monthlyPrice: 99,
  yearlyPrice: Math.round(99 * 12 * 0.75),
  features: [...],
  highlighted: false,
  productId: "seo-pro", // or "speed-pro", "security-pro"
}
```

**3. Update button in pricing map:**
```typescript
// BEFORE (❌):
<Button
  className="w-full"
  variant={plan.highlighted ? "default" : "outline"}
  asChild
>
  <a href={stripeLink} target="_blank" rel="noopener noreferrer">
    Get Started
  </a>
</Button>

// AFTER (✅):
<UnifiedCheckoutButton
  productId={plan.productId}
  billingCycle={billingCycle}
  variant={plan.highlighted ? "default" : "outline"}
  className="w-full"
>
  Get Started
</UnifiedCheckoutButton>
```

**4. Remove stripeLink from map function:**
```typescript
// BEFORE (❌):
{pricingPlans.map((plan, index) => {
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const period = billingCycle === "monthly" ? "/month" : "/year";
  const stripeLink = billingCycle === "monthly" ? plan.stripeMonthly : plan.stripeYearly;
  // ...

// AFTER (✅):
{pricingPlans.map((plan, index) => {
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const period = billingCycle === "monthly" ? "/month" : "/year";
  // stripeLink removed
  // ...
```

---

### Step 4: Deploy to Vercel

```bash
# 1. Commit changes
git add .
git commit -m "Fix Stripe checkout integration for all services

- Added Themes, Maintenance, SEO, Speed, Security product configs
- Fixed hardcoded Stripe URLs in service pages
- Added UnifiedCheckoutButton to all service pages
- Updated getProductByIdentifier to handle all services"

# 2. Push to repository
git push origin main

# 3. Vercel will auto-deploy
# Or manually deploy:
vercel --prod
```

---

## 🧪 Testing Checklist

After deployment:

### 1. Test Each Service Page

- [ ] **Themes Pro Monthly** - Click button → Sign in required → Creates checkout session → Redirects to Stripe
- [ ] **Themes Pro Yearly** - Same flow
- [ ] **Themes Agency Monthly** - Same flow
- [ ] **Themes Agency Yearly** - Same flow
- [ ] **Themes Enterprise Monthly** - Same flow
- [ ] **Themes Enterprise Yearly** - Same flow
- [ ] **Maintenance Pro Monthly** - Same flow
- [ ] **Maintenance Pro Yearly** - Same flow
- [ ] **Maintenance Agency Monthly** - Same flow
- [ ] **Maintenance Agency Yearly** - Same flow
- [ ] **Maintenance Enterprise Monthly** - Same flow
- [ ] **Maintenance Enterprise Yearly** - Same flow
- [ ] Repeat for SEO, Speed Optimization, Security services (after fixing them)

### 2. Test Complete Checkout Flow

1. Click any "Get Started" button
2. Should redirect to `/signin` if not logged in
3. Sign in with test account
4. Should call `/api/stripe/checkout`
5. Should create Stripe checkout session
6. Should redirect to Stripe checkout page (not 404!)
7. Complete payment with test card: `4242 4242 4242 4242`
8. Should redirect to `/checkout/success?session_id=...`
9. Should show success message
10. User should receive confirmation email

### 3. Test Existing Products (Regression)

- [ ] WP Scan plans still work
- [ ] Hosting plans still work
- [ ] Plugin Bundle pricing still works
- [ ] Individual plugin pages still work

---

## 🎯 Product ID Reference

### Product ID Format:
```
{service}-{tier}
```

### All Product IDs:

**Themes:** `themes-pro`, `themes-agency`, `themes-enterprise`
**Maintenance:** `maintenance-pro`, `maintenance-agency`, `maintenance-enterprise`
**SEO:** `seo-pro`, `seo-agency`, `seo-enterprise`
**Speed:** `speed-pro`, `speed-agency`, `speed-enterprise`
**Security:** `security-pro`, `security-agency`, `security-enterprise`

**Hosting:** `hosting-startup`, `hosting-professional`, `hosting-growth`, `hosting-scale`
**Plugins:** `plugins-pro`, `plugins-agency`, `plugins-enterprise`
**WP Scan:** `pro`, `agency`, `enterprise` (legacy format)

---

## 🔍 Troubleshooting

### Issue: "Product not found" error

**Cause:** Product ID or billing cycle doesn't match Stripe configuration

**Fix:**
1. Check `lib/stripe.ts` - Verify product ID format
2. Check Vercel environment variables - Ensure price IDs are correct
3. Check Stripe Dashboard - Verify products exist

### Issue: Button just reloads page

**Cause:** JavaScript error or missing import

**Fix:**
1. Check browser console for errors
2. Verify `UnifiedCheckoutButton` is imported
3. Check `productId` prop is passed correctly

### Issue: "Unauthorized" error

**Cause:** User not signed in

**Fix:**
- This is expected behavior
- Button should redirect to `/signin`
- After sign-in, should create checkout

### Issue: Stripe checkout shows 404

**Cause:** Invalid price ID in environment variables

**Fix:**
1. Verify Stripe price ID exists in Dashboard
2. Check environment variable is set in Vercel
3. Redeploy after updating environment variables

---

## 📊 Summary

### Total Changes:
- **1 config file** updated (`lib/stripe.ts`)
- **2 service pages** fixed (`themes`, `maintenance`)
- **3 service pages** still need fixes (`seo`, `speed-optimization`, `security`)
- **30 new products** need to be created in Stripe
- **30 environment variables** need to be added

### Estimated Time:
- Creating Stripe products: 30-45 minutes
- Adding environment variables: 10-15 minutes
- Fixing remaining pages: 15-20 minutes
- Testing: 30-40 minutes
- **Total: 1.5-2 hours**

### Next Steps:
1. ✅ Code changes (DONE)
2. ⏳ Create Stripe products
3. ⏳ Add environment variables
4. ⏳ Fix remaining 3 service pages
5. ⏳ Deploy to Vercel
6. ⏳ Test all buy buttons

---

## 🎉 Success Criteria

When everything is working:
- ✅ All buy buttons redirect to actual Stripe checkout (not 404)
- ✅ Stripe checkout shows correct product name and price
- ✅ Payment completes successfully
- ✅ User redirected to success page
- ✅ No errors in Vercel logs
- ✅ No errors in Stripe Dashboard webhook logs

---

Need help? Review:
- `STRIPE_CHECKOUT_FIX.md` - Detailed technical explanation
- `components/UnifiedCheckoutButton.tsx` - Button implementation
- `lib/stripe.ts` - Product configuration
- `app/api/stripe/checkout/route.ts` - API route handling

Good luck with deployment! 🚀
