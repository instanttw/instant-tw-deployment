# Stripe Checkout Integration Fix - Complete Guide

## Problems Identified

1. **12 Plugins pages** - Using `UnifiedCheckoutButton` but may need individual product database entries
2. **Hosting page** - ✅ Already working correctly with `UnifiedCheckoutButton`
3. **WP Scan /plans page** - ✅ Already working correctly with API calls
4. **Themes page** - ❌ Using hardcoded invalid Stripe URLs like `https://checkout.stripe.com/c/pay/cs_test_themes_pro_monthly`
5. **Maintenance service** - ❌ Using hardcoded invalid Stripe URLs
6. **SEO service** - ❌ Likely using hardcoded invalid Stripe URLs
7. **Speed Optimization service** - ❌ Likely using hardcoded invalid Stripe URLs
8. **Security service** - ❌ Likely using hardcoded invalid Stripe URLs

## Solution Overview

### Architecture
- **API Route**: `/api/stripe/checkout` handles subscription products (WP Scan, Hosting, Plugin Bundles, Services, Themes)
- **API Route**: `/api/checkout/dynamic` handles individual plugins from database
- **Component**: `UnifiedCheckoutButton` unified button for all checkout flows
- **Config**: `lib/stripe.ts` contains all Stripe price IDs and product mappings

### What Needs to be Fixed

1. ✅ API routes already exist and work
2. ✅ `UnifiedCheckoutButton` already exists and works
3. ❌ Need to add Themes and Services to `lib/stripe.ts`
4. ❌ Need to replace hardcoded Stripe URLs with `UnifiedCheckoutButton`

---

## Fix Implementation

### Step 1: Update `lib/stripe.ts` to Include All Products

Add Themes and Services products to the configuration file.

### Step 2: Replace Hardcoded URLs

Replace all instances of:
```typescript
stripeMonthly: "https://checkout.stripe.com/c/pay/cs_test_..."
stripeYearly: "https://checkout.stripe.com/c/pay/cs_test_..."
```

With:
```typescript
<UnifiedCheckoutButton
  productId="service-maintenance-pro" 
  billingCycle={billingCycle}
  variant="default"
  className="w-full"
>
  Get Started
</UnifiedCheckoutButton>
```

---

## Product ID Mapping

### Current Products (Already Working)

**WP Scan Subscriptions:**
- `pro` / `monthly` → `STRIPE_PRICE_WPSCAN_PRO_MONTHLY`
- `pro` / `yearly` → `STRIPE_PRICE_WPSCAN_PRO_YEARLY`
- `agency` / `monthly` → `STRIPE_PRICE_WPSCAN_AGENCY_MONTHLY`
- `agency` / `yearly` → `STRIPE_PRICE_WPSCAN_AGENCY_YEARLY`
- `enterprise` / `monthly` → `STRIPE_PRICE_WPSCAN_ENTERPRISE_MONTHLY`
- `enterprise` / `yearly` → `STRIPE_PRICE_WPSCAN_ENTERPRISE_YEARLY`

**Hosting Subscriptions:**
- `hosting-startup` / `monthly` → `STRIPE_PRICE_HOSTING_STARTUP_MONTHLY`
- `hosting-startup` / `yearly` → `STRIPE_PRICE_HOSTING_STARTUP_YEARLY`
- `hosting-professional` / `monthly` → `STRIPE_PRICE_HOSTING_PROFESSIONAL_MONTHLY`
- `hosting-professional` / `yearly` → `STRIPE_PRICE_HOSTING_PROFESSIONAL_YEARLY`
- `hosting-growth` / `monthly` → `STRIPE_PRICE_HOSTING_GROWTH_MONTHLY`
- `hosting-growth` / `yearly` → `STRIPE_PRICE_HOSTING_GROWTH_YEARLY`
- `hosting-scale` / `monthly` → `STRIPE_PRICE_HOSTING_SCALE_MONTHLY`
- `hosting-scale` / `yearly` → `STRIPE_PRICE_HOSTING_SCALE_YEARLY`

**Plugin Bundles:**
- `plugins-pro` / `monthly` → `STRIPE_PRICE_PLUGINS_PRO_MONTHLY`
- `plugins-pro` / `yearly` → `STRIPE_PRICE_PLUGINS_PRO_YEARLY`
- `plugins-agency` / `monthly` → `STRIPE_PRICE_PLUGINS_AGENCY_MONTHLY`
- `plugins-agency` / `yearly` → `STRIPE_PRICE_PLUGINS_AGENCY_YEARLY`
- `plugins-enterprise` / `monthly` → `STRIPE_PRICE_PLUGINS_ENTERPRISE_MONTHLY`
- `plugins-enterprise` / `yearly` → `STRIPE_PRICE_PLUGINS_ENTERPRISE_YEARLY`

### New Products to Add

**Themes Service:**
- `themes-pro` / `monthly` → `STRIPE_PRICE_THEMES_PRO_MONTHLY`
- `themes-pro` / `yearly` → `STRIPE_PRICE_THEMES_PRO_YEARLY`
- `themes-agency` / `monthly` → `STRIPE_PRICE_THEMES_AGENCY_MONTHLY`
- `themes-agency` / `yearly` → `STRIPE_PRICE_THEMES_AGENCY_YEARLY`
- `themes-enterprise` / `monthly` → `STRIPE_PRICE_THEMES_ENTERPRISE_MONTHLY`
- `themes-enterprise` / `yearly` → `STRIPE_PRICE_THEMES_ENTERPRISE_YEARLY`

**Maintenance Service:**
- `maintenance-pro` / `monthly` → `STRIPE_PRICE_MAINTENANCE_PRO_MONTHLY`
- `maintenance-pro` / `yearly` → `STRIPE_PRICE_MAINTENANCE_PRO_YEARLY`
- `maintenance-agency` / `monthly` → `STRIPE_PRICE_MAINTENANCE_AGENCY_MONTHLY`
- `maintenance-agency` / `yearly` → `STRIPE_PRICE_MAINTENANCE_AGENCY_YEARLY`
- `maintenance-enterprise` / `monthly` → `STRIPE_PRICE_MAINTENANCE_ENTERPRISE_MONTHLY`
- `maintenance-enterprise` / `yearly` → `STRIPE_PRICE_MAINTENANCE_ENTERPRISE_YEARLY`

**SEO Service:**
- `seo-pro` / `monthly` → `STRIPE_PRICE_SEO_PRO_MONTHLY`
- `seo-pro` / `yearly` → `STRIPE_PRICE_SEO_PRO_YEARLY`
- `seo-agency` / `monthly` → `STRIPE_PRICE_SEO_AGENCY_MONTHLY`
- `seo-agency` / `yearly` → `STRIPE_PRICE_SEO_AGENCY_YEARLY`
- `seo-enterprise` / `monthly` → `STRIPE_PRICE_SEO_ENTERPRISE_MONTHLY`
- `seo-enterprise` / `yearly` → `STRIPE_PRICE_SEO_ENTERPRISE_YEARLY`

**Speed Optimization Service:**
- `speed-pro` / `monthly` → `STRIPE_PRICE_SPEED_PRO_MONTHLY`
- `speed-pro` / `yearly` → `STRIPE_PRICE_SPEED_PRO_YEARLY`
- `speed-agency` / `monthly` → `STRIPE_PRICE_SPEED_AGENCY_MONTHLY`
- `speed-agency` / `yearly` → `STRIPE_PRICE_SPEED_AGENCY_YEARLY`
- `speed-enterprise` / `monthly` → `STRIPE_PRICE_SPEED_ENTERPRISE_MONTHLY`
- `speed-enterprise` / `yearly` → `STRIPE_PRICE_SPEED_ENTERPRISE_YEARLY`

**Security Service:**
- `security-pro` / `monthly` → `STRIPE_PRICE_SECURITY_PRO_MONTHLY`
- `security-pro` / `yearly` → `STRIPE_PRICE_SECURITY_PRO_YEARLY`
- `security-agency` / `monthly` → `STRIPE_PRICE_SECURITY_AGENCY_MONTHLY`
- `security-agency` / `yearly` → `STRIPE_PRICE_SECURITY_AGENCY_YEARLY`
- `security-enterprise` / `monthly` → `STRIPE_PRICE_SECURITY_ENTERPRISE_MONTHLY`
- `security-enterprise` / `yearly` → `STRIPE_PRICE_SECURITY_ENTERPRISE_YEARLY`

---

## Files to Update

### 1. `lib/stripe.ts`
- Add THEMES_PLANS section
- Add MAINTENANCE_PLANS section
- Add SEO_PLANS section
- Add SPEED_PLANS section
- Add SECURITY_PLANS section
- Update ALL_STRIPE_PLANS to include new sections
- Update getProductByIdentifier() to handle new product IDs

### 2. `app/services/themes/page.tsx`
- Replace hardcoded `stripeMonthly` and `stripeYearly` with `UnifiedCheckoutButton`

### 3. `app/services/maintenance/page.tsx`
- Replace hardcoded `stripeMonthly` and `stripeYearly` with `UnifiedCheckoutButton`

### 4. `app/services/seo/page.tsx`
- Replace hardcoded Stripe URLs with `UnifiedCheckoutButton`

### 5. `app/services/speed-optimization/page.tsx`
- Replace hardcoded Stripe URLs with `UnifiedCheckoutButton`

### 6. `app/services/security/page.tsx`
- Replace hardcoded Stripe URLs with `UnifiedCheckoutButton`

---

## Environment Variables Needed

Add these to `.env.local` (development) and Vercel environment variables (production):

```env
# Existing (already configured)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Themes Service Price IDs
STRIPE_PRICE_THEMES_PRO_MONTHLY=price_...
STRIPE_PRICE_THEMES_PRO_YEARLY=price_...
STRIPE_PRICE_THEMES_AGENCY_MONTHLY=price_...
STRIPE_PRICE_THEMES_AGENCY_YEARLY=price_...
STRIPE_PRICE_THEMES_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_THEMES_ENTERPRISE_YEARLY=price_...

# Maintenance Service Price IDs
STRIPE_PRICE_MAINTENANCE_PRO_MONTHLY=price_...
STRIPE_PRICE_MAINTENANCE_PRO_YEARLY=price_...
STRIPE_PRICE_MAINTENANCE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_MAINTENANCE_AGENCY_YEARLY=price_...
STRIPE_PRICE_MAINTENANCE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_MAINTENANCE_ENTERPRISE_YEARLY=price_...

# SEO Service Price IDs
STRIPE_PRICE_SEO_PRO_MONTHLY=price_...
STRIPE_PRICE_SEO_PRO_YEARLY=price_...
STRIPE_PRICE_SEO_AGENCY_MONTHLY=price_...
STRIPE_PRICE_SEO_AGENCY_YEARLY=price_...
STRIPE_PRICE_SEO_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_SEO_ENTERPRISE_YEARLY=price_...

# Speed Optimization Service Price IDs
STRIPE_PRICE_SPEED_PRO_MONTHLY=price_...
STRIPE_PRICE_SPEED_PRO_YEARLY=price_...
STRIPE_PRICE_SPEED_AGENCY_MONTHLY=price_...
STRIPE_PRICE_SPEED_AGENCY_YEARLY=price_...
STRIPE_PRICE_SPEED_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_SPEED_ENTERPRISE_YEARLY=price_...

# Security Service Price IDs
STRIPE_PRICE_SECURITY_PRO_MONTHLY=price_...
STRIPE_PRICE_SECURITY_PRO_YEARLY=price_...
STRIPE_PRICE_SECURITY_AGENCY_MONTHLY=price_...
STRIPE_PRICE_SECURITY_AGENCY_YEARLY=price_...
STRIPE_PRICE_SECURITY_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_SECURITY_ENTERPRISE_YEARLY=price_...
```

---

## Creating Stripe Products & Prices

You need to create these products in your Stripe Dashboard:

### Option 1: Stripe Dashboard (Manual)
1. Go to https://dashboard.stripe.com/products
2. Click "Add Product"
3. For each product tier:
   - Name: "Themes Pro", "Themes Agency", etc.
   - Description
   - Set as recurring (monthly or yearly)
   - Set price
   - Copy the Price ID (starts with `price_`)
   - Add to environment variables

### Option 2: Stripe CLI (Automated)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Create products programmatically
stripe products create --name="Themes Pro Monthly" --description="Custom theme design & development"
stripe prices create --product=prod_... --currency=usd --unit-amount=9900 --recurring='{"interval":"month"}'

# Copy the price IDs to .env.local
```

---

## Testing Checklist

After implementing fixes:

### 1. Test Each Product Page
- [ ] Themes Pro Monthly
- [ ] Themes Pro Yearly
- [ ] Themes Agency Monthly
- [ ] Themes Agency Yearly
- [ ] Themes Enterprise Monthly
- [ ] Themes Enterprise Yearly
- [ ] Maintenance Pro Monthly
- [ ] Maintenance Pro Yearly
- [ ] Maintenance Agency Monthly
- [ ] Maintenance Agency Yearly
- [ ] Maintenance Enterprise Monthly
- [ ] Maintenance Enterprise Yearly
- [ ] SEO Service (all tiers)
- [ ] Speed Optimization Service (all tiers)
- [ ] Security Service (all tiers)

### 2. Test Checkout Flow
1. Click buy button
2. Should redirect to sign-in if not logged in
3. After sign-in, should create checkout session
4. Should redirect to Stripe checkout page (not 404)
5. Complete test payment (use card 4242 4242 4242 4242)
6. Should redirect to success page
7. User should receive confirmation email

### 3. Test Existing Products (Regression Test)
- [ ] WP Scan plans still work
- [ ] Hosting plans still work
- [ ] Plugin Bundle pricing page still works
- [ ] Individual plugin pages still work

---

## Deployment Steps

1. **Update code files** (see below for specific changes)
2. **Create Stripe products** in Stripe Dashboard
3. **Add environment variables** to Vercel
4. **Deploy to Vercel**
5. **Test all buy buttons** on production
6. **Monitor errors** in Vercel logs and Stripe Dashboard

---

## Summary

**Root Cause**: Hardcoded Stripe checkout URLs (`https://checkout.stripe.com/c/pay/cs_test_...`) don't exist. Stripe requires creating checkout sessions via API.

**Solution**: Use existing `UnifiedCheckoutButton` component that calls `/api/stripe/checkout` to create proper checkout sessions, then redirects to Stripe.

**Files to Change**: 5 service pages + 1 config file
**New Environment Variables**: ~30 (for Themes + 4 Services × 3 tiers × 2 billing cycles)
**Estimated Time**: 2-3 hours including Stripe product creation and testing

---

## Next Steps

1. Review this document
2. Implement code changes (see specific file updates below)
3. Create Stripe products and get Price IDs
4. Update environment variables
5. Deploy and test

Ready to implement? Let's start with updating `lib/stripe.ts`!
