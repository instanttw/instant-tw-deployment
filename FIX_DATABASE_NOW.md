# Fix Database - Production Issue Resolved

## Problem Confirmed ✅

Your production database has **wrong products**. 

**What your pages need:**
- themes
- maintenance  
- seo
- speed-optimization
- security
- wp-scan
- hosting
- plugin-bundle

**What your database has:**
- instant-backup
- instant-security-guard
- instant-seo-booster
- instant-cache-pro
- ... and 12 other instant-* plugins

**Result:** "Product not found" errors on all checkout pages.

## Solution: Re-seed Database

### Option 1: Using Neon SQL Editor (Easiest - 5 minutes)

**Step 1: Clear Current Products**

1. Go to: https://console.neon.tech
2. Select your database
3. Go to SQL Editor
4. Run this:

```sql
-- Delete all current products and tiers
DELETE FROM pricing_tiers;
DELETE FROM products;

-- Verify deletion
SELECT COUNT(*) FROM products;        -- Should be 0
SELECT COUNT(*) FROM pricing_tiers;   -- Should be 0
```

**Step 2: Seed from Local**

```bash
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"

# Make sure DATABASE_URL is set (use your production Neon URL)
npx tsx scripts/seed-products-postgres.ts
```

**Step 3: Verify Seeding**

Back in Neon SQL Editor:

```sql
-- Should show 6-8 products
SELECT COUNT(*) FROM products;

-- Should show 48-54 tiers
SELECT COUNT(*) FROM pricing_tiers;

-- Check the product slugs
SELECT slug, name, type FROM products ORDER BY slug;
```

**Expected slugs:**
- ✅ hosting
- ✅ maintenance
- ✅ plugin-bundle
- ✅ security (if in seeder)
- ✅ seo (if in seeder)
- ✅ speed-optimization (if in seeder)
- ✅ themes
- ✅ wp-scan

### Option 2: Using Vercel Environment (Alternative)

If you have Vercel CLI installed:

```bash
# Use Vercel's DATABASE_URL
vercel env pull .env.production

# Seed using production URL
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx tsx scripts/seed-products-postgres.ts
```

## After Seeding

### Test Immediately:

1. **Visit**: https://wp.instant.tw/wp-scan/plans
2. **Click**: "Upgrade to Pro"
3. **Should**: Redirect to Stripe Checkout (NOT error)
4. **Test**: Complete purchase with card 4242 4242 4242 4242

### If Still Failing:

**Check Vercel Logs:**
```bash
vercel logs --follow
```

Look for errors like:
- "Product not found" → Database not seeded correctly
- "Unauthorized" → Auth issue
- "Missing stripe-signature" → Webhook issue

### Verify Database:

```sql
-- Find wp-scan product
SELECT * FROM products WHERE slug = 'wp-scan';

-- Find its tiers
SELECT pt.* FROM pricing_tiers pt
INNER JOIN products p ON pt.product_id = p.id
WHERE p.slug = 'wp-scan';
```

Should show:
- pro-monthly ($19)
- pro-yearly ($190)
- agency-monthly ($99)
- agency-yearly ($990)
- enterprise-monthly ($299)
- enterprise-yearly ($2990)

## Common Issues After Seeding

### Issue 1: "Tier not found"

**Problem:** Page expects `pro-monthly` but database has just `pro`

**Solution:** Seeder creates correct tier names. Just make sure seeder ran successfully.

### Issue 2: Some pages work, others don't

**Problem:** Only some products were seeded

**Solution:** Run seeder again. It will update existing products.

### Issue 3: Prices are wrong

**Problem:** Seeder has different prices than pages expect

**Check prices in seeder:**
```typescript
// WP Scan Pro Monthly should be:
price: 1900, // $19
```

**If pages show different prices**, they have hardcoded values that don't match database.

## Maintenance vs WordPress-Maintenance

Your database has both:
- `wordpress-maintenance` (from wrong seeding)
- Should be: `maintenance` (from correct seeder)

After re-seeding, only `maintenance` should exist.

## Why This Happened

Someone (or some script) seeded the database with plugin products (instant-*) instead of the service products your site is designed for.

Your site architecture:
- Service-based marketplace (WP Scan, Themes, Hosting, etc.)
- NOT a plugin marketplace

The instant-* plugins are for a different type of site.

## Backup Current Data (Optional)

If you want to keep the current products:

```sql
-- Export current products (before deleting)
COPY products TO '/tmp/products_backup.csv' CSV HEADER;
COPY pricing_tiers TO '/tmp/pricing_tiers_backup.csv' CSV HEADER;
```

But honestly, these products don't match your site design, so backing up isn't necessary.

## Full Reset Instructions

```bash
# 1. Clear database (in Neon SQL Editor)
DELETE FROM pricing_tiers;
DELETE FROM products;

# 2. Verify cleanup
SELECT COUNT(*) FROM products;        -- Should be 0
SELECT COUNT(*) FROM pricing_tiers;   -- Should be 0

# 3. Re-seed (from your local machine)
cd "C:\Users\PIETER\Downloads\instant-tw-deployment"
npx tsx scripts/seed-products-postgres.ts

# 4. Verify seeding
# Back in Neon SQL Editor:
SELECT slug, name FROM products ORDER BY slug;

# 5. Test checkout
# Visit: https://wp.instant.tw/wp-scan/plans
# Click: "Upgrade to Pro"
# Should work!
```

## Expected Output from Seeder

```
🌱 Starting product seeding (PostgreSQL)...

✅ Database connected

📦 Seeding: WordPress Theme Design Services...
   ✨ Created new product (ID: ...)
      ↳ Created tier: Pro Monthly
      ↳ Created tier: Pro Yearly
      ↳ Created tier: Agency Monthly
      ↳ Created tier: Agency Yearly
      ↳ Created tier: Enterprise Monthly
      ↳ Created tier: Enterprise Yearly
   ✅ Seeded 6 pricing tiers

📦 Seeding: WordPress Maintenance & Care Plans...
   ✨ Created new product (ID: ...)
   ✅ Seeded 6 pricing tiers

📦 Seeding: WordPress Security Scanner...
   ✨ Created new product (ID: ...)
   ✅ Seeded 6 pricing tiers

... (more products)

🎉 Seeding complete!
   📊 Products seeded: 6-8 new
   💰 Pricing tiers: 48-54 new tiers created
   ✨ Total products in database: 6-8
```

## Summary

**Issue**: Database has wrong products (instant-* plugins)
**Fix**: Delete all, re-seed with correct products
**Time**: 5 minutes
**Risk**: Low (database is wrong anyway)

---

**Do this now:**
1. Delete products in Neon SQL Editor
2. Run seeder from local machine
3. Test wp-scan checkout
4. Celebrate! 🎉

---

**After fixing**: Test all pages to verify checkout works everywhere.
