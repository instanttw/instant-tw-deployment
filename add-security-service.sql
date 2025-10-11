-- Add the missing Security Service product

-- Step 1: Insert the product
INSERT INTO products (slug, name, type, description, short_description)
VALUES (
  'security',
  'WordPress Security Services',
  'service'::product_type,
  'Advanced WordPress security including firewall, malware scanning, brute-force protection, and 24/7 monitoring. Keep your website safe from hackers and threats.',
  'Complete WordPress security solution'
)
RETURNING id;

-- Step 2: Copy the product ID from above and replace 'PASTE_PRODUCT_ID_HERE' below

-- Add pricing tiers for Security Service
-- Replace PASTE_PRODUCT_ID_HERE with the ID returned above
INSERT INTO pricing_tiers 
(product_id, tier_name, display_name, price, currency, pricing_model, billing_interval, features, sort_order)
VALUES
  -- Pro Monthly
  ('PASTE_PRODUCT_ID_HERE', 'pro-monthly', 'Pro Monthly', 4900, 'usd', 'subscription'::pricing_model_type, 'month'::billing_interval_type, 
   '["Up to 3 websites", "Weekly security scans", "Malware removal", "Firewall protection", "Login security", "2 hours/month security support", "Email support (24hr response)"]'::jsonb, 
   1),
  
  -- Pro Yearly
  ('PASTE_PRODUCT_ID_HERE', 'pro-yearly', 'Pro Yearly', 44100, 'usd', 'subscription'::pricing_model_type, 'year'::billing_interval_type,
   '["Up to 3 websites", "Weekly security scans", "Malware removal", "Firewall protection", "Login security", "2 hours/month security support", "Email support (24hr response)", "25% discount vs monthly"]'::jsonb,
   2),
  
  -- Agency Monthly
  ('PASTE_PRODUCT_ID_HERE', 'agency-monthly', 'Agency Monthly', 14900, 'usd', 'subscription'::pricing_model_type, 'month'::billing_interval_type,
   '["Up to 15 websites", "Daily security scans", "Priority malware removal", "Advanced firewall", "Brute-force protection", "Two-factor authentication", "10 hours/month security support", "Priority support (4hr response)", "White-label reports"]'::jsonb,
   3),
  
  -- Agency Yearly
  ('PASTE_PRODUCT_ID_HERE', 'agency-yearly', 'Agency Yearly', 134100, 'usd', 'subscription'::pricing_model_type, 'year'::billing_interval_type,
   '["Up to 15 websites", "Daily security scans", "Priority malware removal", "Advanced firewall", "Brute-force protection", "Two-factor authentication", "10 hours/month security support", "Priority support (4hr response)", "White-label reports", "25% discount vs monthly"]'::jsonb,
   4),
  
  -- Enterprise Monthly
  ('PASTE_PRODUCT_ID_HERE', 'enterprise-monthly', 'Enterprise Monthly', 49900, 'usd', 'subscription'::pricing_model_type, 'month'::billing_interval_type,
   '["Unlimited websites", "Real-time security monitoring", "Instant malware removal", "Enterprise firewall", "DDoS protection", "Security hardening", "Unlimited security support", "Dedicated security manager", "24/7 priority support (1hr response)", "Penetration testing", "Custom SLA"]'::jsonb,
   5),
  
  -- Enterprise Yearly
  ('PASTE_PRODUCT_ID_HERE', 'enterprise-yearly', 'Enterprise Yearly', 449100, 'usd', 'subscription'::pricing_model_type, 'year'::billing_interval_type,
   '["Unlimited websites", "Real-time security monitoring", "Instant malware removal", "Enterprise firewall", "DDoS protection", "Security hardening", "Unlimited security support", "Dedicated security manager", "24/7 priority support (1hr response)", "Penetration testing", "Custom SLA", "25% discount vs monthly"]'::jsonb,
   6);

-- Step 3: Verify
SELECT p.slug, p.name, COUNT(pt.id) as tier_count
FROM products p
LEFT JOIN pricing_tiers pt ON p.id = pt.product_id
WHERE p.slug = 'security'
GROUP BY p.slug, p.name;
