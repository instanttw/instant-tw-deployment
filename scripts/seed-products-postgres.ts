/**
 * Product Seeder Script - PostgreSQL/Neon
 * Populates database with all products and pricing tiers
 * 
 * Usage:
 *   npx tsx scripts/seed-products-postgres.ts
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

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
        features: [
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
        ],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 89100, // $891 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
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
        ],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 59900, // $599
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
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
        ],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 539100, // $5,391 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
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
        ],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 129900, // $1,299
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
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
        ],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 1169100, // $11,691 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
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
        ],
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
        features: [
          'Up to 3 websites',
          'Weekly security & plugin updates',
          'Daily automated backups (30-day retention)',
          'Uptime monitoring (15-min intervals)',
          'Malware scanning & removal',
          'Performance optimization (quarterly)',
          '2 hours/month support',
          'Email support (24hr response)',
          'Monthly health reports',
        ],
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
        features: [
          'Up to 3 websites',
          'Weekly security & plugin updates',
          'Daily automated backups (30-day retention)',
          'Uptime monitoring (15-min intervals)',
          'Malware scanning & removal',
          'Performance optimization (quarterly)',
          '2 hours/month support',
          'Email support (24hr response)',
          'Monthly health reports',
        ],
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
        features: [
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
        ],
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
        features: [
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
        ],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 49900, // $499
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
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
        ],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 449100, // $4,491 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
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
        ],
        sort_order: 6,
      },
    ],
  },

  // Additional services already added above (SEO, Speed, Security)
  
  // ===========================================
  // WP SCAN SERVICE
  // ===========================================
  {
    slug: 'wp-scan',
    name: 'WordPress Security Scanner',
    type: 'service',
    description: 'Automated WordPress vulnerability scanning and monitoring. Detect security issues, outdated plugins, and potential threats before they become problems.',
    short_description: 'WordPress security scanning & monitoring',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 1900, // $19
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 3,
        features: [
          'Monitor up to 3 websites',
          'Weekly automated scans',
          'Full CVE vulnerability details',
          'CVSS scores & risk ratings',
          'PDF report exports',
          'Email alerts',
          'Scan history',
          'Priority support',
        ],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 19000, // $190
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 3,
        features: [
          'Monitor up to 3 websites',
          'Weekly automated scans',
          'Full CVE vulnerability details',
          'CVSS scores & risk ratings',
          'PDF report exports',
          'Email alerts',
          'Scan history',
          'Priority support',
        ],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 9900, // $99
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 25,
        features: [
          'Monitor up to 25 websites',
          'Daily automated scans',
          'White-label PDF reports',
          'Custom branding',
          'Slack integrations',
          'Advanced filters',
          'Historical data (12 months)',
          'Team collaboration (5 users)',
          'Priority support',
        ],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 99000, // $990
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 25,
        features: [
          'Monitor up to 25 websites',
          'Daily automated scans',
          'White-label PDF reports',
          'Custom branding',
          'Slack integrations',
          'Advanced filters',
          'Historical data (12 months)',
          'Team collaboration (5 users)',
          'Priority support',
        ],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 29900, // $299
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          'Unlimited websites',
          'Real-time monitoring',
          'Full API access',
          'Custom webhooks',
          'SSO & SAML',
          'Dedicated account manager',
          'SLA guarantees',
          'Custom integrations',
          'Unlimited team members',
          '24/7 support',
        ],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 299000, // $2,990
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          'Unlimited websites',
          'Real-time monitoring',
          'Full API access',
          'Custom webhooks',
          'SSO & SAML',
          'Dedicated account manager',
          'SLA guarantees',
          'Custom integrations',
          'Unlimited team members',
          '24/7 support',
        ],
        sort_order: 6,
      },
    ],
  },

  // ===========================================
  // HOSTING SERVICE
  // ===========================================
  {
    slug: 'hosting',
    name: 'Managed WordPress Hosting',
    type: 'service',
    description: 'Lightning-fast, secure managed WordPress hosting. Optimized for performance with automatic backups, SSL certificates, and expert support.',
    short_description: 'Fast & secure WordPress hosting',
    tiers: [
      {
        tier_name: 'startup-monthly',
        display_name: 'Startup Monthly',
        price: 2900, // $29
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          '1 WordPress site',
          '20GB SSD storage',
          '50,000 monthly visits',
          'Free SSL certificate',
          'Daily automated backups',
          'CDN included',
          'Email support',
          'Staging environment',
        ],
        sort_order: 1,
      },
      {
        tier_name: 'startup-yearly',
        display_name: 'Startup Yearly',
        price: 26100, // $261 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          '1 WordPress site',
          '20GB SSD storage',
          '50,000 monthly visits',
          'Free SSL certificate',
          'Daily automated backups',
          'CDN included',
          'Email support',
          'Staging environment',
        ],
        sort_order: 2,
      },
      {
        tier_name: 'professional-monthly',
        display_name: 'Professional Monthly',
        price: 6900, // $69
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          '3 WordPress sites',
          '60GB SSD storage',
          '200,000 monthly visits',
          'Free SSL certificates',
          'Daily automated backups',
          'Premium CDN',
          'Git integration',
          'Multiple staging environments',
          'Priority support',
        ],
        sort_order: 3,
      },
      {
        tier_name: 'professional-yearly',
        display_name: 'Professional Yearly',
        price: 62100, // $621 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          '3 WordPress sites',
          '60GB SSD storage',
          '200,000 monthly visits',
          'Free SSL certificates',
          'Daily automated backups',
          'Premium CDN',
          'Git integration',
          'Multiple staging environments',
          'Priority support',
        ],
        sort_order: 4,
      },
      {
        tier_name: 'growth-monthly',
        display_name: 'Growth Monthly',
        price: 13900, // $139
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          '10 WordPress sites',
          '120GB SSD storage',
          '500,000 monthly visits',
          'Advanced caching',
          'On-demand backups',
          'Performance optimization',
          'Priority support',
        ],
        sort_order: 5,
      },
      {
        tier_name: 'growth-yearly',
        display_name: 'Growth Yearly',
        price: 125100, // $1,251 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          '10 WordPress sites',
          '120GB SSD storage',
          '500,000 monthly visits',
          'Advanced caching',
          'On-demand backups',
          'Performance optimization',
          'Priority support',
        ],
        sort_order: 6,
      },
      {
        tier_name: 'scale-monthly',
        display_name: 'Scale Monthly',
        price: 29900, // $299
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          '30 WordPress sites',
          '300GB SSD storage',
          '1,000,000+ monthly visits',
          'Dedicated resources',
          'Custom configurations',
          'White-glove migrations',
          '24/7 priority support',
        ],
        sort_order: 7,
      },
      {
        tier_name: 'scale-yearly',
        display_name: 'Scale Yearly',
        price: 269100, // $2,691 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          '30 WordPress sites',
          '300GB SSD storage',
          '1,000,000+ monthly visits',
          'Dedicated resources',
          'Custom configurations',
          'White-glove migrations',
          '24/7 priority support',
        ],
        sort_order: 8,
      },
    ],
  },

  // ===========================================
  // PLUGIN BUNDLE
  // ===========================================
  {
    slug: 'plugin-bundle',
    name: 'Premium Plugin Bundle',
    type: 'bundle',
    description: 'Complete collection of all 12 premium WordPress plugins. Everything you need to build powerful WordPress websites.',
    short_description: 'All 12 premium plugins included',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 4900, // $49
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 3,
        features: [
          'All 12 premium plugins',
          'Use on 3 websites',
          '1 year updates & support',
          'Priority email support',
          'Premium documentation',
          '30-day money-back guarantee',
        ],
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
        features: [
          'All 12 premium plugins',
          'Use on 3 websites',
          '1 year updates & support',
          'Priority email support',
          'Premium documentation',
          '30-day money-back guarantee',
        ],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 29900, // $299
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 25,
        features: [
          'All 12 premium plugins',
          'Use on 25 websites',
          '1 year updates & support',
          'Priority email & phone support',
          'White label options',
          'API access',
          'Custom integrations',
          'Dedicated account manager',
        ],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 269100, // $2,691 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 25,
        features: [
          'All 12 premium plugins',
          'Use on 25 websites',
          '1 year updates & support',
          'Priority email & phone support',
          'White label options',
          'API access',
          'Custom integrations',
          'Dedicated account manager',
        ],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 99900, // $999
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: [
          'All 12 premium plugins',
          'Unlimited websites',
          'Lifetime updates & support',
          '24/7 priority support',
          'Dedicated account manager',
          'Custom SLA guarantee',
          'On-site training',
          'Custom development',
          'Security audits',
        ],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 899100, // $8,991 (25% off)
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: [
          'All 12 premium plugins',
          'Unlimited websites',
          'Lifetime updates & support',
          '24/7 priority support',
          'Dedicated account manager',
          'Custom SLA guarantee',
          'On-site training',
          'Custom development',
          'Security audits',
        ],
        sort_order: 6,
      },
    ],
  },
];

// ===========================================
// SEEDING FUNCTIONS
// ===========================================

async function seedProducts() {
  console.log('🌱 Starting product seeding (PostgreSQL)...\n');

  try {
    // Test connection
    await sql`SELECT 1`;
    console.log('✅ Database connected\n');

    let totalProducts = 0;
    let totalTiers = 0;

    for (const productData of products) {
      console.log(`📦 Seeding: ${productData.name}...`);

      // Check if product exists
      const { rows: existing } = await sql`
        SELECT id FROM products WHERE slug = ${productData.slug}
      `;

      let productId: string;

      if (existing.length > 0) {
        // Update existing product
        productId = existing[0].id.toString();
        await sql`
          UPDATE products 
          SET name = ${productData.name}, 
              type = ${productData.type}::product_type, 
              description = ${productData.description}, 
              short_description = ${productData.short_description}
          WHERE id = ${productId}
        `;
        console.log(`   ✏️  Updated existing product (ID: ${productId})`);
      } else {
        // Insert new product
        const { rows: newProduct } = await sql`
          INSERT INTO products (slug, name, type, description, short_description)
          VALUES (
            ${productData.slug}, 
            ${productData.name}, 
            ${productData.type}::product_type, 
            ${productData.description}, 
            ${productData.short_description}
          )
          RETURNING id
        `;
        productId = newProduct[0].id.toString();
        console.log(`   ✨ Created new product (ID: ${productId})`);
        totalProducts++;
      }

      // Seed pricing tiers
      for (const tier of productData.tiers) {
        // Check if tier exists
        const { rows: existingTier } = await sql`
          SELECT id FROM pricing_tiers 
          WHERE product_id = ${productId} AND tier_name = ${tier.tier_name}
        `;

        if (existingTier.length > 0) {
          // Update existing tier
          await sql`
            UPDATE pricing_tiers
            SET display_name = ${tier.display_name}, 
                price = ${tier.price}, 
                currency = ${tier.currency}, 
                pricing_model = ${tier.pricing_model}::pricing_model_type, 
                billing_interval = ${tier.billing_interval || null}::billing_interval_type, 
                site_limit = ${tier.site_limit || null}, 
                features = ${JSON.stringify(tier.features)}, 
                sort_order = ${tier.sort_order}
            WHERE id = ${existingTier[0].id}
          `;
          console.log(`      ↳ Updated tier: ${tier.display_name}`);
        } else {
          // Insert new tier
          await sql`
            INSERT INTO pricing_tiers 
            (product_id, tier_name, display_name, price, currency, 
             pricing_model, billing_interval, site_limit, features, sort_order)
            VALUES (
              ${productId}, 
              ${tier.tier_name}, 
              ${tier.display_name}, 
              ${tier.price}, 
              ${tier.currency}, 
              ${tier.pricing_model}::pricing_model_type, 
              ${tier.billing_interval || null}::billing_interval_type, 
              ${tier.site_limit || null}, 
              ${JSON.stringify(tier.features)}, 
              ${tier.sort_order}
            )
          `;
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
