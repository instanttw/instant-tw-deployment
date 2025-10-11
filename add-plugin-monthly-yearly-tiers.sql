-- Add monthly and yearly tiers for all 12 plugins
-- Current: Only have 'pro', 'agency', 'enterprise' tiers (treated as one-time)
-- Adding: 'pro-monthly', 'pro-yearly', 'agency-monthly', 'agency-yearly', 'enterprise-monthly', 'enterprise-yearly'
-- Pricing: Monthly = current price, Yearly = monthly × 12 × 0.75 (25% discount)

-- Step 1: Update existing tiers to be monthly subscriptions
UPDATE pricing_tiers pt
SET 
  tier_name = CASE 
    WHEN tier_name = 'pro' THEN 'pro-monthly'
    WHEN tier_name = 'agency' THEN 'agency-monthly'
    WHEN tier_name = 'enterprise' THEN 'enterprise-monthly'
    ELSE tier_name
  END,
  display_name = CASE 
    WHEN tier_name = 'pro' THEN 'Pro Monthly'
    WHEN tier_name = 'agency' THEN 'Agency Monthly'
    WHEN tier_name = 'enterprise' THEN 'Enterprise Monthly'
    ELSE display_name
  END,
  pricing_model = 'subscription'::pricing_model_type,
  billing_interval = 'month'::billing_interval_type
FROM products p
WHERE pt.product_id = p.id
  AND p.type = 'plugin'
  AND pt.tier_name IN ('pro', 'agency', 'enterprise');

-- Step 2: Add yearly tiers (25% discount vs monthly × 12)
INSERT INTO pricing_tiers (
  product_id, tier_name, display_name, price, currency,
  pricing_model, billing_interval, site_limit, features, sort_order
)
SELECT 
  pt.product_id,
  REPLACE(pt.tier_name, '-monthly', '-yearly') as tier_name,
  REPLACE(pt.display_name, 'Monthly', 'Yearly') as display_name,
  ROUND(pt.price * 12 * 0.75) as price, -- 25% discount
  pt.currency,
  'subscription'::pricing_model_type,
  'year'::billing_interval_type,
  pt.site_limit,
  pt.features,
  pt.sort_order + 1 as sort_order
FROM pricing_tiers pt
JOIN products p ON pt.product_id = p.id
WHERE p.type = 'plugin'
  AND pt.tier_name IN ('pro-monthly', 'agency-monthly', 'enterprise-monthly')
ON CONFLICT (product_id, tier_name) DO UPDATE SET
  price = EXCLUDED.price,
  display_name = EXCLUDED.display_name,
  billing_interval = EXCLUDED.billing_interval;

-- Step 3: Verify the changes
SELECT 
  p.slug as plugin,
  pt.tier_name,
  pt.display_name,
  pt.price / 100.0 as price_dollars,
  pt.billing_interval,
  pt.site_limit
FROM products p
JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.type = 'plugin'
  AND pt.tier_name NOT IN ('free')
ORDER BY p.slug, pt.tier_name;

-- Expected results for instant-image-optimizer (if Pro is $39/month):
-- pro-monthly: $39/month
-- pro-yearly: $351/year ($39 × 12 × 0.75 = $351, saves $117)
-- agency-monthly: $119/month  
-- agency-yearly: $1071/year ($119 × 12 × 0.75 = $1071, saves $357)
-- enterprise-monthly: $299/month
-- enterprise-yearly: $2691/year ($299 × 12 × 0.75 = $2691, saves $897)
