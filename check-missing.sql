-- Check which of the 7 service products are missing

SELECT 
  'wp-scan' as expected_slug,
  CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'wp-scan') THEN '✅ Exists' ELSE '❌ Missing' END as status
UNION ALL
SELECT 'themes', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'themes') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'maintenance', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'maintenance') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'seo', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'seo') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'speed-optimization', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'speed-optimization') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'security', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'security') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'hosting', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'hosting') THEN '✅ Exists' ELSE '❌ Missing' END
UNION ALL
SELECT 'plugin-bundle', CASE WHEN EXISTS (SELECT 1 FROM products WHERE slug = 'plugin-bundle') THEN '✅ Exists' ELSE '❌ Missing' END;

-- Show what we actually have
SELECT type, COUNT(*) as count
FROM products
GROUP BY type
ORDER BY type;
