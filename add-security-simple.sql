-- Add Security Service with all tiers in one go
-- Copy and paste this entire block into Neon SQL Editor and run

WITH new_product AS (
  INSERT INTO products (slug, name, type, description, short_description)
  VALUES (
    'security',
    'WordPress Security Services',
    'service'::product_type,
    'Advanced WordPress security including firewall, malware scanning, brute-force protection, and 24/7 monitoring. Keep your website safe from hackers and threats.',
    'Complete WordPress security solution'
  )
  RETURNING id
)
INSERT INTO pricing_tiers 
(product_id, tier_name, display_name, price, currency, pricing_model, billing_interval, features, sort_order)
SELECT 
  new_product.id,
  tier.tier_name,
  tier.display_name,
  tier.price,
  'usd',
  'subscription'::pricing_model_type,
  tier.billing_interval::billing_interval_type,
  tier.features::jsonb,
  tier.sort_order
FROM new_product,
(VALUES
  ('pro-monthly', 'Pro Monthly', 4900, 'month', '["Up to 3 websites", "Weekly security scans", "Malware removal", "Firewall protection", "Login security", "Email support"]', 1),
  ('pro-yearly', 'Pro Yearly', 44100, 'year', '["Up to 3 websites", "Weekly security scans", "Malware removal", "Firewall protection", "Login security", "Email support", "Save 25%"]', 2),
  ('agency-monthly', 'Agency Monthly', 14900, 'month', '["Up to 15 websites", "Daily security scans", "Priority malware removal", "Advanced firewall", "Brute-force protection", "Priority support", "White-label reports"]', 3),
  ('agency-yearly', 'Agency Yearly', 134100, 'year', '["Up to 15 websites", "Daily security scans", "Priority malware removal", "Advanced firewall", "Brute-force protection", "Priority support", "White-label reports", "Save 25%"]', 4),
  ('enterprise-monthly', 'Enterprise Monthly', 49900, 'month', '["Unlimited websites", "Real-time monitoring", "Instant malware removal", "Enterprise firewall", "DDoS protection", "Unlimited support", "Dedicated security manager", "24/7 priority support"]', 5),
  ('enterprise-yearly', 'Enterprise Yearly', 449100, 'year', '["Unlimited websites", "Real-time monitoring", "Instant malware removal", "Enterprise firewall", "DDoS protection", "Unlimited support", "Dedicated security manager", "24/7 priority support", "Save 25%"]', 6)
) AS tier(tier_name, display_name, price, billing_interval, features, sort_order);

-- Verify it was added
SELECT 
  p.slug, 
  p.name, 
  COUNT(pt.id) as tier_count
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.slug = 'security'
GROUP BY p.slug, p.name;

-- Final product count (should be 20)
SELECT COUNT(*) as total_products FROM products;
