-- Verify WP Scan product and tiers exist

-- Check if wp-scan product exists
SELECT id, slug, name, type FROM products WHERE slug = 'wp-scan';

-- Check all tiers for wp-scan
SELECT 
  pt.tier_name,
  pt.display_name,
  pt.price,
  pt.currency,
  pt.pricing_model,
  pt.billing_interval
FROM pricing_tiers pt
JOIN products p ON pt.product_id = p.id
WHERE p.slug = 'wp-scan'
ORDER BY pt.tier_name;

-- Expected tiers:
-- pro-monthly
-- pro-yearly
-- agency-monthly
-- agency-yearly
-- enterprise-monthly
-- enterprise-yearly
