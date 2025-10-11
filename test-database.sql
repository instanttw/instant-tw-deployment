-- Quick Database Verification Tests
-- Run these in Neon Console to verify everything is set up correctly

-- Test 1: Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'products', 'pricing_tiers', 'orders', 'order_items', 
    'licenses', 'downloads', 'service_bookings', 'webhook_events'
  )
ORDER BY table_name;
-- Expected: 8 rows

-- Test 2: Check products seeded
SELECT 
  COUNT(*) as total_products,
  SUM(CASE WHEN type = 'plugin' THEN 1 ELSE 0 END) as plugins,
  SUM(CASE WHEN type = 'service' THEN 1 ELSE 0 END) as services
FROM products
WHERE is_active = true;
-- Expected: 16 total (12 plugins, 4 services)

-- Test 3: Check pricing tiers
SELECT 
  COUNT(*) as total_tiers,
  COUNT(DISTINCT product_id) as products_with_pricing
FROM pricing_tiers
WHERE is_active = true;
-- Expected: 40+ tiers

-- Test 4: View all products with pricing
SELECT 
  p.name as product,
  p.type,
  pt.tier_name,
  pt.display_name,
  pt.price / 100.0 as price_dollars,
  pt.pricing_model,
  pt.billing_interval,
  pt.site_limit
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.is_active = true AND pt.is_active = true
ORDER BY p.type, p.name, pt.price;
-- Expected: List of all products with tiers

-- Test 5: Check if orders table is ready
SELECT COUNT(*) as total_orders FROM orders;
-- Expected: 0 (no orders yet)

-- Test 6: Check if licenses table is ready
SELECT COUNT(*) as total_licenses FROM licenses;
-- Expected: 0 (no licenses yet)

-- Test 7: Verify ENUM types
SELECT 
  t.typname as enum_name,
  string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE '%_type'
GROUP BY t.typname
ORDER BY t.typname;
-- Expected: 11 enum types

-- Test 8: Sample products for testing
SELECT 
  slug,
  name,
  type,
  requires_license
FROM products
WHERE slug IN (
  'instant-backup',
  'instant-security-guard',
  'stripe-implementation',
  'wordpress-speed-optimization'
)
ORDER BY type, name;
-- Expected: 4 products (2 plugins, 2 services)
