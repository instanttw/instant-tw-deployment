/**
 * Product Seeder Script
 * Populates database with all products and pricing tiers
 * 
 * Usage:
 *   npx tsx scripts/seed-products.ts
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Create connection
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

// ===========================================
// PRODUCT DATA
// ===========================================

const products = [
  // ===========================================
  // THEMES SERVICE
  // ===========================================
  {
    slug: 'themes',
    name: 'WordPress Theme Design Services',
    type: 'service',
    description: 'Professional WordPress theme design and development. Custom designs that capture your brand identity and deliver exceptional user experiences.',
    short_description: 'Custom WordPress themes built for your brand',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 9900, // $99
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          '1 domain',
          'Custom theme design',
          'Mobile-responsive layout',
          'Up to 10 page templates',
          'Basic custom post types',
          'Theme documentation',
          '1 month post-launch support',
          'Performance optimization',
          'SEO-friendly markup',
          'Browser compatibility testing',
        ]),
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 89100, // $891 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          '1 domain',
          'Custom theme design',
          'Mobile-responsive layout',
          'Up to 10 page templates',
          'Basic custom post types',
          'Theme documentation',
          '1 month post-launch support',
          'Performance optimization',
          'SEO-friendly markup',
          'Browser compatibility testing',
        ]),
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 59900, // $599
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          '10-50 domains',
          'Premium custom theme design',
          'Advanced mobile optimization',
          'Unlimited page templates',
          'Advanced custom post types',
          'WooCommerce integration',
          'Custom Gutenberg blocks',
          'Animation & interactions',
          '3 months post-launch support',
          'A/B testing setup',
          'Conversion optimization',
          'White-label ready',
          'Priority support',
        ]),
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 539100, // $5,391 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          '10-50 domains',
          'Premium custom theme design',
          'Advanced mobile optimization',
          'Unlimited page templates',
          'Advanced custom post types',
          'WooCommerce integration',
          'Custom Gutenberg blocks',
          'Animation & interactions',
          '3 months post-launch support',
          'A/B testing setup',
          'Conversion optimization',
          'White-label ready',
          'Priority support',
        ]),
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 129900, // $1,299
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          'Unlimited domains',
          'Complete design system',
          'Multi-site theme framework',
          'Headless WordPress support',
          'Custom page builder',
          'Advanced WooCommerce features',
          'Progressive Web App (PWA)',
          'Multilingual support',
          'Accessibility (WCAG) compliance',
          '6 months post-launch support',
          'Monthly design updates',
          'Dedicated design team',
          'Performance monitoring',
          '24/7 priority support',
          'Custom SLA agreements',
        ]),
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 1169100, // $11,691 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          'Unlimited domains',
          'Complete design system',
          'Multi-site theme framework',
          'Headless WordPress support',
          'Custom page builder',
          'Advanced WooCommerce features',
          'Progressive Web App (PWA)',
          'Multilingual support',
          'Accessibility (WCAG) compliance',
          '6 months post-launch support',
          'Monthly design updates',
          'Dedicated design team',
          'Performance monitoring',
          '24/7 priority support',
          'Custom SLA agreements',
        ]),
        sort_order: 6,
      },
    ],
  },

  // ===========================================
  // MAINTENANCE SERVICE
  // ===========================================
  {
    slug: 'maintenance',
    name: 'WordPress Maintenance & Care Plans',
    type: 'service',
    description: 'Comprehensive WordPress maintenance, security updates, backups, and expert support. Keep your website secure, fast, and running smoothly 24/7.',
    short_description: 'Professional WordPress maintenance and support',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 4900, // $49
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 3,
        features: JSON.stringify([
          'Up to 3 websites',
          'Weekly security & plugin updates',
          'Daily automated backups (30-day retention)',
          'Uptime monitoring (15-min intervals)',
          'Malware scanning & removal',
          'Performance optimization (quarterly)',
          '2 hours/month support',
          'Email support (24hr response)',
          'Monthly health reports',
        ]),
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 44100, // $441 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 3,
        features: JSON.stringify([
          'Up to 3 websites',
          'Weekly security & plugin updates',
          'Daily automated backups (30-day retention)',
          'Uptime monitoring (15-min intervals)',
          'Malware scanning & removal',
          'Performance optimization (quarterly)',
          '2 hours/month support',
          'Email support (24hr response)',
          'Monthly health reports',
        ]),
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 14900, // $149
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 15,
        features: JSON.stringify([
          'Up to 15 websites',
          'Daily security & plugin updates',
          'Hourly automated backups (90-day retention)',
          'Uptime monitoring (5-min intervals)',
          'Priority malware scanning & removal',
          'Performance optimization (monthly)',
          '10 hours/month support',
          'White-label reports for clients',
          'Priority support (4hr response)',
          'Emergency support included',
          'Staging environment setup',
        ]),
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 134100, // $1,341 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 15,
        features: JSON.stringify([
          'Up to 15 websites',
          'Daily security & plugin updates',
          'Hourly automated backups (90-day retention)',
          'Uptime monitoring (5-min intervals)',
          'Priority malware scanning & removal',
          'Performance optimization (monthly)',
          '10 hours/month support',
          'White-label reports for clients',
          'Priority support (4hr response)',
          'Emergency support included',
          'Staging environment setup',
        ]),
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 49900, // $499
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          'Unlimited websites',
          'Real-time security & plugin updates',
          'Continuous backups with instant restore',
          'Uptime monitoring (1-min intervals)',
          'Advanced malware scanning & removal',
          'Performance optimization (weekly)',
          'Unlimited support hours',
          'Custom SLA agreements',
          'Dedicated account manager',
          '24/7 priority support (1hr response)',
          'Emergency hotline',
          'Custom development included',
          'Disaster recovery planning',
        ]),
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 449100, // $4,491 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          'Unlimited websites',
          'Real-time security & plugin updates',
          'Continuous backups with instant restore',
          'Uptime monitoring (1-min intervals)',
          'Advanced malware scanning & removal',
          'Performance optimization (weekly)',
          'Unlimited support hours',
          'Custom SLA agreements',
          'Dedicated account manager',
          '24/7 priority support (1hr response)',
          'Emergency hotline',
          'Custom development included',
          'Disaster recovery planning',
        ]),
        sort_order: 6,
      },
    ],
  },

  // ===========================================
  // SEO SERVICE
  // ===========================================
  {
    slug: 'seo',
    name: 'WordPress SEO Optimization Services',
    type: 'service',
    description: 'Complete WordPress SEO services including keyword research, on-page optimization, technical SEO, content strategy, and link building.',
    short_description: 'Professional SEO services for WordPress',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 79900, // $799
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          '1-2 websites',
          'Keyword research (up to 50 keywords)',
          'On-page SEO optimization',
          'Technical SEO audit',
          'XML sitemap optimization',
          'Schema markup implementation',
          'Google Analytics & Search Console setup',
          'Monthly performance reports',
          'Email support',
        ]),
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 719100, // $7,191 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          '1-2 websites',
          'Keyword research (up to 50 keywords)',
          'On-page SEO optimization',
          'Technical SEO audit',
          'XML sitemap optimization',
          'Schema markup implementation',
          'Google Analytics & Search Console setup',
          'Monthly performance reports',
          'Email support',
        ]),
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 149900, // $1,499
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced keyword research (unlimited)',
          'Comprehensive SEO audits',
          'Content optimization strategy',
          'Link building campaign (10 backlinks/month)',
          'Competitor analysis',
          'Local SEO optimization',
          'Advanced schema markup',
          'Core Web Vitals optimization',
          'White-label client reports',
          'Priority support',
        ]),
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 1349100, // $13,491 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced keyword research (unlimited)',
          'Comprehensive SEO audits',
          'Content optimization strategy',
          'Link building campaign (10 backlinks/month)',
          'Competitor analysis',
          'Local SEO optimization',
          'Advanced schema markup',
          'Core Web Vitals optimization',
          'White-label client reports',
          'Priority support',
        ]),
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 299900, // $2,999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          'Unlimited websites',
          'Enterprise SEO strategy',
          'International SEO (multi-language)',
          'Advanced link building (30+ backlinks/month)',
          'Content creation (4 articles/month)',
          'Brand monitoring & reputation management',
          'Enterprise schema implementation',
          'E-commerce SEO optimization',
          'Custom SEO tools & dashboards',
          'Dedicated SEO manager',
          '24/7 support',
          'Custom SLA',
        ]),
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 2699100, // $26,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          'Unlimited websites',
          'Enterprise SEO strategy',
          'International SEO (multi-language)',
          'Advanced link building (30+ backlinks/month)',
          'Content creation (4 articles/month)',
          'Brand monitoring & reputation management',
          'Enterprise schema implementation',
          'E-commerce SEO optimization',
          'Custom SEO tools & dashboards',
          'Dedicated SEO manager',
          '24/7 support',
          'Custom SLA',
        ]),
        sort_order: 6,
      },
    ],
  },

  // ===========================================
  // SPEED OPTIMIZATION SERVICE
  // ===========================================
  {
    slug: 'speed-optimization',
    name: 'WordPress Speed Optimization Services',
    type: 'service',
    description: 'Professional WordPress performance optimization. Achieve 95+ PageSpeed scores with advanced caching, CDN setup, image optimization, and database tuning.',
    short_description: 'Make your WordPress site blazing fast',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 39900, // $399
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          '1-2 websites',
          'PageSpeed audit & optimization',
          'Image optimization (bulk)',
          'Caching setup & configuration',
          'CSS/JS minification',
          'Database optimization',
          'CDN setup (basic)',
          'Core Web Vitals optimization',
          'Monthly performance monitoring',
          'Target: 85+ PageSpeed score',
        ]),
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 359100, // $3,591 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          '1-2 websites',
          'PageSpeed audit & optimization',
          'Image optimization (bulk)',
          'Caching setup & configuration',
          'CSS/JS minification',
          'Database optimization',
          'CDN setup (basic)',
          'Core Web Vitals optimization',
          'Monthly performance monitoring',
          'Target: 85+ PageSpeed score',
        ]),
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 99900, // $999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced performance optimization',
          'Premium CDN setup (Cloudflare Enterprise)',
          'Server-level caching (Redis/Memcached)',
          'Critical CSS implementation',
          'Lazy loading optimization',
          'HTTP/2 & HTTP/3 setup',
          'Database query optimization',
          'Code splitting & async loading',
          'Real-time monitoring',
          'Target: 90+ PageSpeed score',
        ]),
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 899100, // $8,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced performance optimization',
          'Premium CDN setup (Cloudflare Enterprise)',
          'Server-level caching (Redis/Memcached)',
          'Critical CSS implementation',
          'Lazy loading optimization',
          'HTTP/2 & HTTP/3 setup',
          'Database query optimization',
          'Code splitting & async loading',
          'Real-time monitoring',
          'Target: 90+ PageSpeed score',
        ]),
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 199900, // $1,999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          'Unlimited websites',
          'Custom server optimization',
          'Global CDN with 200+ PoPs',
          'Advanced caching strategies',
          'WooCommerce performance optimization',
          'Custom performance monitoring',
          'A/B testing for performance',
          'Progressive Web App (PWA) setup',
          'Edge computing configuration',
          'Dedicated performance engineer',
          '24/7 monitoring & support',
          'Target: 95+ PageSpeed score',
        ]),
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 1799100, // $17,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          'Unlimited websites',
          'Custom server optimization',
          'Global CDN with 200+ PoPs',
          'Advanced caching strategies',
          'WooCommerce performance optimization',
          'Custom performance monitoring',
          'A/B testing for performance',
          'Progressive Web App (PWA) setup',
          'Edge computing configuration',
          'Dedicated performance engineer',
          '24/7 monitoring & support',
          'Target: 95+ PageSpeed score',
        ]),
        sort_order: 6,
      },
    ],
  },

  // ===========================================
  // SECURITY SERVICE
  // ===========================================
  {
    slug: 'security',
    name: 'WordPress Security Services',
    type: 'service',
    description: 'Enterprise-grade WordPress security with 24/7 monitoring, malware removal, firewall protection, and security audits.',
    short_description: 'Protect your WordPress site from threats',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 99900, // $999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          '1-3 websites',
          'Security audit & hardening',
          'Malware scanning & removal',
          'Firewall setup (basic WAF)',
          'SSL certificate setup',
          'Login security (2FA, limiting)',
          'File integrity monitoring',
          'Security updates',
          'Monthly security reports',
        ]),
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 899100, // $8,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          '1-3 websites',
          'Security audit & hardening',
          'Malware scanning & removal',
          'Firewall setup (basic WAF)',
          'SSL certificate setup',
          'Login security (2FA, limiting)',
          'File integrity monitoring',
          'Security updates',
          'Monthly security reports',
        ]),
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 249900, // $2,499
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced security audits',
          'Real-time threat monitoring',
          'Advanced WAF (OWASP rules)',
          'DDoS protection',
          'Penetration testing (annual)',
          'Security incident response',
          'Compliance audits (PCI, GDPR)',
          'White-label security reports',
          'Priority support',
        ]),
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 2249100, // $22,491 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 10,
        features: JSON.stringify([
          'Up to 10 websites',
          'Advanced security audits',
          'Real-time threat monitoring',
          'Advanced WAF (OWASP rules)',
          'DDoS protection',
          'Penetration testing (annual)',
          'Security incident response',
          'Compliance audits (PCI, GDPR)',
          'White-label security reports',
          'Priority support',
        ]),
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 499900, // $4,999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: JSON.stringify([
          'Unlimited websites',
          'Enterprise security strategy',
          '24/7 security monitoring (SOC)',
          'Advanced threat intelligence',
          'Quarterly penetration testing',
          'Zero-trust architecture setup',
          'SIEM integration',
          'Advanced compliance (SOC 2, ISO 27001, HIPAA)',
          'Incident response team',
          'Security insurance up to $1M',
          'Dedicated security manager',
          '24/7 emergency hotline',
        ]),
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 4499100, // $44,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: JSON.stringify([
          'Unlimited websites',
          'Enterprise security strategy',
          '24/7 security monitoring (SOC)',
          'Advanced threat intelligence',
          'Quarterly penetration testing',
          'Zero-trust architecture setup',
          'SIEM integration',
          'Advanced compliance (SOC 2, ISO 27001, HIPAA)',
          'Incident response team',
          'Security insurance up to $1M',
          'Dedicated security manager',
          '24/7 emergency hotline',
        ]),
        sort_order: 6,
      },
    ],
  },
];

// ===========================================
// SEEDING FUNCTIONS
// ===========================================

async function seedProducts() {
  console.log('🌱 Starting product seeding...\n');

  try {
    // Test connection
    await pool.execute('SELECT 1');
    console.log('✅ Database connected\n');

    let totalProducts = 0;
    let totalTiers = 0;

    for (const productData of products) {
      console.log(`📦 Seeding: ${productData.name}...`);

      // Check if product exists
      const [existing] = await pool.execute<any[]>(
        'SELECT id FROM products WHERE slug = ?',
        [productData.slug]
      );

      let productId: string;

      if (existing.length > 0) {
        // Update existing product
        productId = existing[0].id.toString();
        await pool.execute(
          `UPDATE products 
           SET name = ?, type = ?, description = ?, short_description = ?
           WHERE id = ?`,
          [
            productData.name,
            productData.type,
            productData.description,
            productData.short_description,
            productId,
          ]
        );
        console.log(`   ✏️  Updated existing product (ID: ${productId})`);
      } else {
        // Insert new product
        const [result] = await pool.execute<any>(
          `INSERT INTO products (slug, name, type, description, short_description)
           VALUES (?, ?, ?, ?, ?)`,
          [
            productData.slug,
            productData.name,
            productData.type,
            productData.description,
            productData.short_description,
          ]
        );
        productId = result.insertId.toString();
        console.log(`   ✨ Created new product (ID: ${productId})`);
        totalProducts++;
      }

      // Seed pricing tiers
      for (const tier of productData.tiers) {
        // Check if tier exists
        const [existingTier] = await pool.execute<any[]>(
          'SELECT id FROM pricing_tiers WHERE product_id = ? AND tier_name = ?',
          [productId, tier.tier_name]
        );

        if (existingTier.length > 0) {
          // Update existing tier
          await pool.execute(
            `UPDATE pricing_tiers
             SET display_name = ?, price = ?, currency = ?, 
                 pricing_model = ?, billing_interval = ?, 
                 site_limit = ?, features = ?, sort_order = ?
             WHERE id = ?`,
            [
              tier.display_name,
              tier.price,
              tier.currency,
              tier.pricing_model,
              tier.billing_interval || null,
              tier.site_limit || null,
              tier.features,
              tier.sort_order,
              existingTier[0].id,
            ]
          );
          console.log(`      ↳ Updated tier: ${tier.display_name}`);
        } else {
          // Insert new tier
          await pool.execute(
            `INSERT INTO pricing_tiers 
             (product_id, tier_name, display_name, price, currency, 
              pricing_model, billing_interval, site_limit, features, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              tier.tier_name,
              tier.display_name,
              tier.price,
              tier.currency,
              tier.pricing_model,
              tier.billing_interval || null,
              tier.site_limit || null,
              tier.features,
              tier.sort_order,
            ]
          );
          console.log(`      ↳ Created tier: ${tier.display_name}`);
          totalTiers++;
        }
      }

      console.log(`   ✅ Seeded ${productData.tiers.length} pricing tiers\n`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`   📊 Products seeded: ${totalProducts} new, ${products.length - totalProducts} updated`);
    console.log(`   💰 Pricing tiers: ${totalTiers} new tiers created`);
    console.log(`   ✨ Total products in database: ${products.length}`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// ===========================================
// RUN SEEDER
// ===========================================

seedProducts()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
