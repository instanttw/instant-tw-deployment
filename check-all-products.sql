-- Check which products exist in database vs what pages need

-- Step 1: List all products currently in database
SELECT 
  slug,
  name,
  type,
  (SELECT COUNT(*) FROM pricing_tiers WHERE product_id = products.id) as tier_count
FROM products
ORDER BY type, slug;

-- Step 2: Check which service pages need products
-- Expected services:
-- 1. wp-scan ✅ (working)
-- 2. themes (working)
-- 3. maintenance
-- 4. seo
-- 5. speed-optimization
-- 6. security
-- 7. hosting

-- Step 3: Check which plugins need products
-- Expected 12 plugins:
-- 1. instant-image-optimizer (partially working)
-- 2. instant-broken-link-fixer
-- 3. instant-duplicator
-- 4. instant-forms-replacement
-- 5. instant-security-guard
-- 6. instant-backup-restore
-- 7. instant-seo-booster
-- 8. instant-cache-optimizer
-- 9. instant-database-cleaner
-- 10. instant-migration-tool
-- 11. instant-redirect-manager
-- 12. instant-schema-generator

-- Step 4: Show missing products (compare with expected list above)
SELECT 'MISSING PRODUCTS - Need to add these:' as status;

-- Products that should exist but don't
SELECT 'Check if these exist:' as note;
SELECT * FROM (
  VALUES 
    ('wp-scan'),
    ('themes'),
    ('maintenance'),
    ('seo'),
    ('speed-optimization'),
    ('security'),
    ('hosting'),
    ('instant-image-optimizer'),
    ('instant-broken-link-fixer'),
    ('instant-duplicator'),
    ('instant-forms-replacement'),
    ('instant-security-guard'),
    ('instant-backup-restore'),
    ('instant-seo-booster'),
    ('instant-cache-optimizer'),
    ('instant-database-cleaner'),
    ('instant-migration-tool'),
    ('instant-redirect-manager'),
    ('instant-schema-generator'),
    ('plugin-bundle')
) AS expected(slug)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE products.slug = expected.slug
);
