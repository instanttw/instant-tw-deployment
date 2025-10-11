# Urgent Fixes for Remaining Issues

## Issues Identified:

1. ✅ **Old API Still Active** - Fixed! Disabled `/api/stripe/checkout`
2. ⏳ **Cancel Page 500 Error** - URL trailing slash issue
3. ⏳ **Plugin Yearly Pricing Missing** - Need to update plugin pricing data
4. ⏳ **Need to Redeploy** - Changes not live yet

---

## Issue 1: Old API Disabled ✅

**Fixed:** The old static Stripe API has been disabled. All buttons will now use the dynamic API.

**File Changed:** `app/api/stripe/checkout/route.ts`

---

## Issue 2: Cancel Page URL Issue

**Problem:** `/checkout/cancel/` (with trailing slash) shows 500 error

**Solution:** Next.js should handle this automatically, but the error might be from trying to fetch something on that page.

**The cancel page itself is fine** - check if there's a middleware blocking it or if there's an API call failing.

---

## Issue 3: Plugin Yearly Pricing Missing

**Problem:** Plugins only show monthly pricing ($39). When toggled to yearly, same price shows. Should be 25% off yearly.

**Current Plugin Pricing Structure:**
```typescript
// From config/plugins-data.ts
pricing: {
  free: { price: 0, ... },
  pro: { price: 39, billingCycle: "annual", ... }, // ❌ Only one price
  agency: { price: 119, billingCycle: "annual", ... },
  enterprise: { price: 299, billingCycle: "annual", ... }
}
```

**What's Needed:**
The plugin detail page has a toggle for monthly/yearly, but plugins only have ONE price in the database (which is treated as yearly).

**Solutions:**

### Option A: Add Monthly Pricing to Database
Add separate tiers for monthly pricing:
- `pro-monthly` ($39/month)
- `pro-yearly` ($351/year = $39 × 12 × 0.75)

### Option B: Remove Yearly Toggle from Plugin Pages
Since plugins are sold as annual licenses, remove the monthly/yearly toggle and just show the annual price.

### Option C: Calculate Monthly Dynamically
Keep yearly as base, calculate monthly as yearly / 12 * 1.33 (adds back the 25% discount).

**Recommended:** Option B - Plugins should just be annual licenses. Remove the toggle.

---

## Issue 4: Service Pages Not Working

**Root Cause:** Old API was being called somehow

**Fix:** Disabled old API, now all buttons will use dynamic API

---

## Quick SQL to Add Yearly Plugin Pricing (If Going with Option A)

```sql
-- Example for instant-image-optimizer
-- Add monthly tier
INSERT INTO pricing_tiers 
(product_id, tier_name, display_name, price, currency, pricing_model, billing_interval, features, sort_order)
SELECT 
  id,
  'pro-monthly',
  'Pro Monthly',
  5200, -- $52/month (25% more than yearly average)
  'usd',
  'subscription'::pricing_model_type,
  'month'::billing_interval_type,
  '[]'::jsonb,
  1
FROM products 
WHERE slug = 'instant-image-optimizer';

-- The existing 'pro' tier becomes yearly
UPDATE pricing_tiers 
SET tier_name = 'pro-yearly',
    display_name = 'Pro Yearly',
    price = 3900, -- $39/year (25% off vs monthly)
    billing_interval = 'year'::billing_interval_type
WHERE product_id = (SELECT id FROM products WHERE slug = 'instant-image-optimizer')
  AND tier_name = 'pro';
```

**Repeat for all 12 plugins × 3 tiers = 36 updates needed!**

This is a LOT of work. **Recommend Option B** instead.

---

## Recommended Actions (Priority Order):

### 1. Deploy Current Fixes (URGENT)
```bash
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
vercel --prod
```

This deploys:
- ✅ Guest checkout enabled
- ✅ Old API disabled
- ✅ All buttons use dynamic API

**After deploy, test WP Scan again** - should work!

### 2. Fix Plugin Page Toggle (Quick Fix)

Remove the billing cycle toggle from plugin pages since they're annual-only:

**File:** `app/plugins/[slug]/plugin-detail-client.tsx`

Remove these lines (around line 138):
```typescript
// DELETE THIS SECTION
<div className="flex justify-center mb-8">
  <div className="inline-flex items-center gap-2 p-1 bg-secondary rounded-lg">
    <Button
      variant={billingCycle === "annual" ? "default" : "ghost"}
      size="sm"
      onClick={() => setBillingCycle("annual")}
    >
      Annual (Save 20%)
    </Button>
    <Button
      variant={billingCycle === "monthly" ? "default" : "ghost"}
      size="sm"
      onClick={() => setBillingCycle("monthly")}
    >
      Monthly
    </Button>
  </div>
</div>
```

This removes the toggle completely. Plugins will only show annual pricing.

### 3. Fix Cancel Page URL (If Still Needed)

Check if issue persists after deploy. If yes, add a redirect:

**File:** `next.config.ts`

```typescript
async redirects() {
  return [
    {
      source: '/checkout/cancel/',
      destination: '/checkout/cancel',
      permanent: true,
    },
  ];
}
```

---

## Testing After Deploy:

1. **WP Scan Pro Monthly** → https://wp.instant.tw/wp-scan/plans
2. **WP Scan Pro Yearly** → Same page, toggle to yearly
3. **Plugin Pro** → https://wp.instant.tw/plugins/instant-image-optimizer
4. **Service pages** → Test themes, maintenance, etc.
5. **Cancel page** → Click back from Stripe checkout

---

## Summary:

**Priority 1:** Deploy current fixes → Test WP Scan
**Priority 2:** Remove billing toggle from plugin pages
**Priority 3:** Test all 20 pages systematically

**Time Required:** 15 minutes to deploy + test

---

**Next Steps:**
1. Run `vercel --prod` to deploy
2. Wait 2-3 minutes for deployment
3. Test WP Scan page - should work now!
4. Let me know results and I'll help with remaining issues
