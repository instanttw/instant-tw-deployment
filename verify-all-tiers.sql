-- Verify ALL pricing tiers exist for ALL products
-- This ensures all 92+ buttons will work

-- PLUGINS: Should have 3 tiers each (pro, agency, enterprise)
-- Free tier might not exist in DB as it's a download, not purchase

SELECT 
  'PLUGINS' as category,
  p.slug,
  p.name,
  COUNT(pt.id) as tier_count,
  STRING_AGG(pt.tier_name, ', ' ORDER BY pt.tier_name) as tiers
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.type = 'plugin'::product_type
GROUP BY p.slug, p.name
ORDER BY p.slug;

-- Expected: Each plugin should have 3-4 tiers (pro, agency, enterprise, maybe free)

-- SERVICES: Should have 6 tiers each (pro-monthly, pro-yearly, agency-monthly, agency-yearly, enterprise-monthly, enterprise-yearly)

SELECT 
  'SERVICES' as category,
  p.slug,
  p.name,
  COUNT(pt.id) as tier_count,
  STRING_AGG(pt.tier_name, ', ' ORDER BY pt.tier_name) as tiers
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.type = 'service'::product_type
GROUP BY p.slug, p.name
ORDER BY p.slug;

-- Expected: Each service should have 6 tiers

-- BUNDLE: Should have 6 tiers (same as services)

SELECT 
  'BUNDLE' as category,
  p.slug,
  p.name,
  COUNT(pt.id) as tier_count,
  STRING_AGG(pt.tier_name, ', ' ORDER BY pt.tier_name) as tiers
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.type = 'bundle'::product_type
GROUP BY p.slug, p.name
ORDER BY p.slug;

-- SUMMARY: Total tiers across all products

SELECT 
  p.type,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(pt.id) as total_tiers,
  ROUND(AVG(tier_counts.tier_count), 1) as avg_tiers_per_product
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
LEFT JOIN (
  SELECT product_id, COUNT(*) as tier_count
  FROM pricing_tiers
  GROUP BY product_id
) tier_counts ON p.id = tier_counts.product_id
GROUP BY p.type
ORDER BY p.type;

-- MISSING TIERS CHECK: Find products with fewer than expected tiers

SELECT 
  p.slug,
  p.name,
  p.type,
  COUNT(pt.id) as tier_count,
  CASE 
    WHEN p.type = 'plugin'::product_type AND COUNT(pt.id) < 3 THEN '⚠️ Missing tiers (expected 3-4)'
    WHEN p.type = 'service'::product_type AND COUNT(pt.id) < 6 THEN '⚠️ Missing tiers (expected 6)'
    WHEN p.type = 'bundle'::product_type AND COUNT(pt.id) < 6 THEN '⚠️ Missing tiers (expected 6)'
    ELSE '✅ OK'
  END as status
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
GROUP BY p.id, p.slug, p.name, p.type
HAVING 
  (p.type = 'plugin'::product_type AND COUNT(pt.id) < 3) OR
  (p.type = 'service'::product_type AND COUNT(pt.id) < 6) OR
  (p.type = 'bundle'::product_type AND COUNT(pt.id) < 6)
ORDER BY p.type, p.slug;
