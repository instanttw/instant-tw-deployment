-- Add WP Scan product and its tiers to database
-- Run this in Neon SQL Editor

-- Step 1: Insert the wp-scan product
INSERT INTO products (slug, name, type, description, short_description, is_active)
VALUES (
  'wp-scan',
  'WordPress Security Scanner',
  'service',
  'Automated WordPress vulnerability scanning and monitoring. Detect security issues, outdated plugins, and potential threats before they become problems.',
  'WordPress security scanning & monitoring',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description;

-- Step 2: Add pricing tiers
-- Get the product ID
WITH wp_scan_product AS (
  SELECT id FROM products WHERE slug = 'wp-scan'
)
INSERT INTO pricing_tiers (
  product_id, tier_name, display_name, price, currency, 
  pricing_model, billing_interval, site_limit, sort_order
)
SELECT 
  (SELECT id FROM wp_scan_product),
  tier_name, display_name, price, currency,
  pricing_model::pricing_model_type, billing_interval::billing_interval_type, 
  site_limit, sort_order
FROM (VALUES
  -- Pro Monthly
  ('pro-monthly', 'Pro Monthly', 1900, 'usd', 'subscription', 'month', 3, 1),
  
  -- Pro Yearly (saves ~17%)
  ('pro-yearly', 'Pro Yearly', 19000, 'usd', 'subscription', 'year', 3, 2),
  
  -- Agency Monthly  
  ('agency-monthly', 'Agency Monthly', 9900, 'usd', 'subscription', 'month', 25, 3),
  
  -- Agency Yearly (saves ~17%)
  ('agency-yearly', 'Agency Yearly', 99000, 'usd', 'subscription', 'year', 25, 4),
  
  -- Enterprise Monthly
  ('enterprise-monthly', 'Enterprise Monthly', 29900, 'usd', 'subscription', 'month', 100, 5),
  
  -- Enterprise Yearly (saves ~17%)
  ('enterprise-yearly', 'Enterprise Yearly', 299000, 'usd', 'subscription', 'year', 100, 6)
) AS tiers(tier_name, display_name, price, currency, pricing_model, billing_interval, site_limit, sort_order)
ON CONFLICT (product_id, tier_name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  price = EXCLUDED.price,
  billing_interval = EXCLUDED.billing_interval;

-- Step 3: Verify the data was added
SELECT 
  p.slug,
  p.name,
  pt.tier_name,
  pt.display_name,
  pt.price / 100.0 AS price_usd,
  pt.billing_interval
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.slug = 'wp-scan'
ORDER BY pt.sort_order;
