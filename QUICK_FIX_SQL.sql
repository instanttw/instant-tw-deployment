-- =========================================
-- QUICK FIX SQL - Run this in Neon SQL Editor
-- Fixes slug mismatches for 3 existing products
-- =========================================

-- Step 1: Fix maintenance slug
UPDATE products 
SET slug = 'maintenance', 
    name = 'WordPress Maintenance & Care Plans',
    description = 'Comprehensive WordPress maintenance, security updates, backups, and expert support.'
WHERE slug = 'wordpress-maintenance';

-- Step 2: Fix SEO slug  
UPDATE products 
SET slug = 'seo',
    name = 'WordPress SEO Services',
    description = 'Professional SEO optimization services for WordPress websites.'
WHERE slug = 'wordpress-seo-setup';

-- Step 3: Fix speed optimization slug
UPDATE products 
SET slug = 'speed-optimization',
    name = 'WordPress Speed Optimization Services', 
    description = 'Comprehensive speed optimization including caching, image optimization, and code minification.'
WHERE slug = 'wordpress-speed-optimization';

-- Step 4: Delete extra service we don't need
DELETE FROM pricing_tiers 
WHERE product_id IN (
  SELECT id FROM products WHERE slug = 'stripe-implementation'
);
DELETE FROM products WHERE slug = 'stripe-implementation';

-- =========================================
-- Verification Queries
-- =========================================

-- Check all products after fix
SELECT slug, name, type FROM products ORDER BY type, slug;

-- Count products by type
SELECT type, COUNT(*) as count 
FROM products 
GROUP BY type 
ORDER BY type;

-- Expected:
-- service: 3 (after this fix) - will be 7 after running seeder
-- plugin: 12 (should already exist)
-- bundle: 0 (will be 1 after running seeder)

-- Check for missing service products
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'wp-scan') THEN '✅' ELSE '❌'
  END as wp_scan,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'themes') THEN '✅' ELSE '❌'
  END as themes,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'maintenance') THEN '✅' ELSE '❌'
  END as maintenance,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'seo') THEN '✅' ELSE '❌'
  END as seo,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'speed-optimization') THEN '✅' ELSE '❌'
  END as speed_optimization,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'security') THEN '✅' ELSE '❌'
  END as security,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'hosting') THEN '✅' ELSE '❌'
  END as hosting,
  CASE 
    WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'plugin-bundle') THEN '✅' ELSE '❌'
  END as plugin_bundle;

-- After running this SQL, you should see:
-- ✅ maintenance
-- ✅ seo  
-- ✅ speed-optimization
-- ❌ wp-scan (will be added by seeder)
-- ❌ themes (will be added by seeder)
-- ❌ security (needs to be added - not in current seeder!)
-- ❌ hosting (will be added by seeder)
-- ❌ plugin-bundle (will be added by seeder)

-- =========================================
-- NEXT STEPS
-- =========================================
-- 1. ✅ Run this SQL in Neon SQL Editor
-- 2. ⏳ Run: npx tsx scripts/seed-products-postgres.ts
-- 3. ⏳ Run verification queries again
-- 4. ⏳ Test checkout on all pages
