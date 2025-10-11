/**
 * Complete Product Seeder - PostgreSQL/Neon
 * Seeds ALL products: 12 plugins + 7 services + 1 bundle = 20 products
 * 
 * Usage:
 *   npx tsx scripts/seed-all-products.ts
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try loading from .env.local first, then .env.production, then .env
const envPath = ['.env.local', '.env.production', '.env']
  .map(file => path.join(process.cwd(), file))
  .find(file => {
    try {
      return require('fs').existsSync(file);
    } catch {
      return false;
    }
  });

if (envPath) {
  dotenv.config({ path: envPath });
}

// Vercel Postgres expects POSTGRES_URL, but we use DATABASE_URL
if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

if (!process.env.POSTGRES_URL) {
  console.error('❌ DATABASE_URL or POSTGRES_URL not found in environment variables');
  console.error('Please set DATABASE_URL in .env.local, .env.production, or .env');
  process.exit(1);
}

// Tier 1 plugins: $49.99/year starting price
const tier1Plugins = [
  'instant-image-optimizer',
  'instant-broken-link-fixer',
  'instant-duplicator',
  'instant-forms',
  'instant-cache',
  'instant-popup-master',
  'instant-ai-writer',
];

// Tier 2 plugins: $69.99/year starting price
const tier2Plugins = [
  'instant-security-guard',
  'instant-seo',
  'instant-backup',
  'instant-review-booster',
  'instant-cart-recovery',
];

// Plugin tier template with tiered pricing
const pluginTiers = (pluginName: string, slug: string) => {
  const isTier2 = tier2Plugins.includes(slug);
  
  return [
    {
      tier_name: 'pro-yearly',
      display_name: 'Pro',
      price: isTier2 ? 6999 : 4999, // $69.99 or $49.99/year
      currency: 'usd',
      pricing_model: 'subscription',
      billing_interval: 'year',
      site_limit: 1,
      features: [
        `Full ${pluginName} features`,
        '1 website',
        '1 year of updates & support',
        'Priority email support',
        'Regular updates',
        '30-day money-back guarantee',
      ],
      sort_order: 1,
    },
    {
      tier_name: 'agency-yearly',
      display_name: 'Agency',
      price: isTier2 ? 109999 : 99999, // $1,099.99 or $999.99/year
      currency: 'usd',
      pricing_model: 'subscription',
      billing_interval: 'year',
      site_limit: 25,
      features: [
        `Full ${pluginName} features`,
        'Up to 25 websites',
        '1 year of updates & support',
        'White label options',
        'Priority phone support',
        'Advanced features',
        'Team collaboration',
      ],
      sort_order: 2,
    },
    {
      tier_name: 'enterprise-yearly',
      display_name: 'Enterprise',
      price: isTier2 ? 699900 : 499900, // $6,999 or $4,999/year
      currency: 'usd',
      pricing_model: 'subscription',
      billing_interval: 'year',
      features: [
        `Full ${pluginName} features`,
        'Unlimited websites',
        '1 year of updates & support',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom development',
        'SLA guarantee',
        'Reseller license',
      ],
      sort_order: 3,
    },
  ];
};

const products = [
  // ===========================================
  // 12 INDIVIDUAL PLUGINS
  // ===========================================
  {
    slug: 'instant-image-optimizer',
    name: 'Instant Image Optimizer',
    type: 'plugin',
    description: 'AI-powered image optimization with automatic WebP/AVIF conversion, built-in CDN, and intelligent lazy loading. Reduce image sizes by up to 80% without quality loss.',
    short_description: 'AI-powered image optimization for WordPress',
    tiers: pluginTiers('Instant Image Optimizer', 'instant-image-optimizer'),
  },
  {
    slug: 'instant-broken-link-fixer',
    name: 'Instant Broken Link Fixer',
    type: 'plugin',
    description: 'Automatically detect and fix broken links across your WordPress site. Monitor external links, redirect 404 errors, and maintain SEO health.',
    short_description: 'Automatically detect and fix broken links',
    tiers: pluginTiers('Instant Broken Link Fixer', 'instant-broken-link-fixer'),
  },
  {
    slug: 'instant-security-guard',
    name: 'Instant Security Guard',
    type: 'plugin',
    description: 'Complete WordPress security solution with firewall, malware scanning, brute force protection, and real-time threat monitoring.',
    short_description: 'Complete WordPress security solution',
    tiers: pluginTiers('Instant Security Guard', 'instant-security-guard'),
  },
  {
    slug: 'instant-duplicator',
    name: 'Instant Duplicator',
    type: 'plugin',
    description: 'Clone WordPress sites in minutes. Perfect for staging, migrations, and multi-site management. One-click cloning with smart data handling.',
    short_description: 'Clone WordPress sites in minutes',
    tiers: pluginTiers('Instant Duplicator', 'instant-duplicator'),
  },
  {
    slug: 'instant-forms',
    name: 'Instant Forms',
    type: 'plugin',
    description: 'Drag-and-drop form builder with AI-powered optimization, conditional logic, and advanced integrations. Create beautiful, high-converting forms.',
    short_description: 'AI-powered form builder for WordPress',
    tiers: pluginTiers('Instant Forms', 'instant-forms'),
  },
  {
    slug: 'instant-seo',
    name: 'Instant SEO',
    type: 'plugin',
    description: 'Complete SEO toolkit with real-time content analysis, keyword tracking, schema markup, and competitive analysis. Improve your search rankings.',
    short_description: 'Complete SEO toolkit for WordPress',
    tiers: pluginTiers('Instant SEO', 'instant-seo'),
  },
  {
    slug: 'instant-backup',
    name: 'Instant Backup',
    type: 'plugin',
    description: 'Automated WordPress backups with one-click restoration. Cloud storage integration, incremental backups, and scheduled automation.',
    short_description: 'Automated WordPress backups',
    tiers: pluginTiers('Instant Backup', 'instant-backup'),
  },
  {
    slug: 'instant-cache',
    name: 'Instant Cache',
    type: 'plugin',
    description: 'Advanced caching solution for WordPress. Page caching, object caching, database optimization, and CDN integration for maximum performance.',
    short_description: 'Advanced caching solution for WordPress',
    tiers: pluginTiers('Instant Cache', 'instant-cache'),
  },
  {
    slug: 'instant-cart-recovery',
    name: 'Instant Cart Recovery',
    type: 'plugin',
    description: 'Recover abandoned WooCommerce carts with automated emails, exit-intent popups, and personalized discounts. Increase revenue by up to 30%.',
    short_description: 'Recover abandoned WooCommerce carts',
    tiers: pluginTiers('Instant Cart Recovery', 'instant-cart-recovery'),
  },
  {
    slug: 'instant-ai-writer',
    name: 'Instant AI Writer',
    type: 'plugin',
    description: 'AI-powered content generation for WordPress. Create blog posts, product descriptions, and meta content with advanced AI technology.',
    short_description: 'AI-powered content generation',
    tiers: pluginTiers('Instant AI Writer', 'instant-ai-writer'),
  },
  {
    slug: 'instant-review-booster',
    name: 'Instant Review Booster',
    type: 'plugin',
    description: 'Automated review collection for WooCommerce. Email campaigns, review requests, and social proof widgets to boost conversions.',
    short_description: 'Automated review collection for WooCommerce',
    tiers: pluginTiers('Instant Review Booster', 'instant-review-booster'),
  },
  {
    slug: 'instant-popup-master',
    name: 'Instant Popup Master',
    type: 'plugin',
    description: 'Create high-converting popups with advanced targeting, A/B testing, and analytics. Exit-intent, scroll triggers, and time-based displays.',
    short_description: 'Create high-converting popups',
    tiers: pluginTiers('Instant Popup Master', 'instant-popup-master'),
  },

  // ===========================================
  // SERVICES (from original seeder)
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
        price: 9900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Custom theme design', 'Mobile-responsive', 'Up to 10 templates', 'Basic post types', '1 month support'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 89100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Custom theme design', 'Mobile-responsive', 'Up to 10 templates', 'Basic post types', '1 month support'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 59900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Premium design', 'Unlimited templates', 'WooCommerce integration', 'Custom blocks', '3 months support'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 539100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Premium design', 'Unlimited templates', 'WooCommerce integration', 'Custom blocks', '3 months support'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 129900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Complete design system', 'Multi-site framework', 'Headless support', 'PWA', '6 months support'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 1169100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Complete design system', 'Multi-site framework', 'Headless support', 'PWA', '6 months support'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'maintenance',
    name: 'WordPress Maintenance & Care Plans',
    type: 'service',
    description: 'Comprehensive WordPress maintenance, security updates, backups, and expert support.',
    short_description: 'Professional WordPress maintenance',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 4900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 3,
        features: ['Up to 3 websites', 'Weekly updates', 'Daily backups', 'Malware scanning', '2 hours/month support'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 44100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 3,
        features: ['Up to 3 websites', 'Weekly updates', 'Daily backups', 'Malware scanning', '2 hours/month support'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 14900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 15,
        features: ['Up to 15 websites', 'Daily updates', 'Hourly backups', 'Priority scanning', '10 hours/month support'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 134100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 15,
        features: ['Up to 15 websites', 'Daily updates', 'Hourly backups', 'Priority scanning', '10 hours/month support'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 49900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Unlimited sites', 'Real-time updates', 'Continuous backups', 'Unlimited support', 'Dedicated manager'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 449100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Unlimited sites', 'Real-time updates', 'Continuous backups', 'Unlimited support', 'Dedicated manager'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'seo',
    name: 'SEO Services',
    type: 'service',
    description: 'Comprehensive SEO services to improve your search rankings and drive organic traffic.',
    short_description: 'Professional SEO services',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 9900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['1 website', 'Keyword research', 'On-page optimization', 'Technical SEO', 'Monthly reports'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 89100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['1 website', 'Keyword research', 'On-page optimization', 'Technical SEO', 'Monthly reports'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 49900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 5 websites', 'Advanced keyword research', 'Content optimization', 'Link building', 'Weekly reports'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 449100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 5 websites', 'Advanced keyword research', 'Content optimization', 'Link building', 'Weekly reports'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 149900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Unlimited websites', 'Enterprise SEO strategy', 'Content creation', 'Advanced analytics', 'Dedicated team'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 1349100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Unlimited websites', 'Enterprise SEO strategy', 'Content creation', 'Advanced analytics', 'Dedicated team'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'speed-optimization',
    name: 'Speed Optimization Services',
    type: 'service',
    description: 'Professional WordPress speed optimization to improve load times and user experience.',
    short_description: 'WordPress speed optimization',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 7900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 3 websites', 'Image optimization', 'Caching setup', 'Database optimization', 'Monthly monitoring'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 71100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 3 websites', 'Image optimization', 'Caching setup', 'Database optimization', 'Monthly monitoring'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 19900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 10 websites', 'Advanced optimization', 'Premium CDN', 'WooCommerce optimization', 'Weekly monitoring'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 179100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 10 websites', 'Advanced optimization', 'Premium CDN', 'WooCommerce optimization', 'Weekly monitoring'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 49900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Unlimited websites', 'Full-stack optimization', 'Custom CDN', 'Real-time monitoring', 'Dedicated specialist'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 449100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Unlimited websites', 'Full-stack optimization', 'Custom CDN', 'Real-time monitoring', 'Dedicated specialist'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'security',
    name: 'Security Services',
    type: 'service',
    description: 'Complete WordPress security services with monitoring, malware removal, and firewall protection.',
    short_description: 'WordPress security services',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 9900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 3 websites', 'Daily malware scans', 'Firewall setup', 'Security hardening', 'Emergency support'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 89100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 3 websites', 'Daily malware scans', 'Firewall setup', 'Security hardening', 'Emergency support'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 29900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 15 websites', 'Real-time monitoring', 'Advanced firewall', 'Penetration testing', '24/7 support'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 269100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 15 websites', 'Real-time monitoring', 'Advanced firewall', 'Penetration testing', '24/7 support'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 99900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Unlimited websites', 'Enterprise security', 'Custom solutions', 'Compliance audits', 'Dedicated team'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 899100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Unlimited websites', 'Enterprise security', 'Custom solutions', 'Compliance audits', 'Dedicated team'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'wp-scan',
    name: 'WordPress Security Scanner',
    type: 'subscription',
    description: 'Automated WordPress security scanning with vulnerability detection and compliance monitoring.',
    short_description: 'WordPress security scanner',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 4900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 5 websites', 'Daily scans', 'Vulnerability detection', 'Email alerts', 'Basic reports'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 44100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 5 websites', 'Daily scans', 'Vulnerability detection', 'Email alerts', 'Basic reports'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 14900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Up to 50 websites', 'Hourly scans', 'Advanced detection', 'API access', 'White-label reports'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 134100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Up to 50 websites', 'Hourly scans', 'Advanced detection', 'API access', 'White-label reports'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 49900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['Unlimited websites', 'Real-time scans', 'Custom rules', 'Dedicated support', 'SLA guarantee'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 449100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['Unlimited websites', 'Real-time scans', 'Custom rules', 'Dedicated support', 'SLA guarantee'],
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'hosting',
    name: 'Managed WordPress Hosting',
    type: 'service',
    description: 'Premium managed WordPress hosting with automatic updates, daily backups, and expert support.',
    short_description: 'Managed WordPress hosting',
    tiers: [
      {
        tier_name: 'startup-monthly',
        display_name: 'Startup Monthly',
        price: 2900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['1 website', '10GB storage', '50,000 visits/month', 'Free SSL', 'Daily backups'],
        sort_order: 1,
      },
      {
        tier_name: 'startup-yearly',
        display_name: 'Startup Yearly',
        price: 26100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['1 website', '10GB storage', '50,000 visits/month', 'Free SSL', 'Daily backups'],
        sort_order: 2,
      },
      {
        tier_name: 'professional-monthly',
        display_name: 'Professional Monthly',
        price: 5900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['3 websites', '30GB storage', '150,000 visits/month', 'Free SSL', 'Daily backups', 'CDN'],
        sort_order: 3,
      },
      {
        tier_name: 'professional-yearly',
        display_name: 'Professional Yearly',
        price: 53100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['3 websites', '30GB storage', '150,000 visits/month', 'Free SSL', 'Daily backups', 'CDN'],
        sort_order: 4,
      },
      {
        tier_name: 'growth-monthly',
        display_name: 'Growth Monthly',
        price: 11900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['10 websites', '100GB storage', '500,000 visits/month', 'Premium CDN', 'Staging sites'],
        sort_order: 5,
      },
      {
        tier_name: 'growth-yearly',
        display_name: 'Growth Yearly',
        price: 107100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['10 websites', '100GB storage', '500,000 visits/month', 'Premium CDN', 'Staging sites'],
        sort_order: 6,
      },
      {
        tier_name: 'scale-monthly',
        display_name: 'Scale Monthly',
        price: 29900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['30 websites', '300GB storage', '1M+ visits/month', 'Dedicated resources', '24/7 support'],
        sort_order: 7,
      },
      {
        tier_name: 'scale-yearly',
        display_name: 'Scale Yearly',
        price: 269100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['30 websites', '300GB storage', '1M+ visits/month', 'Dedicated resources', '24/7 support'],
        sort_order: 8,
      },
    ],
  },
  {
    slug: 'plugin-bundle',
    name: 'Premium Plugin Bundle',
    type: 'bundle',
    description: 'Complete collection of all 12 premium WordPress plugins.',
    short_description: 'All 12 premium plugins',
    tiers: [
      {
        tier_name: 'pro-monthly',
        display_name: 'Pro Monthly',
        price: 4900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 3,
        features: ['All 12 premium plugins', 'Up to 3 websites', 'Priority support', '30-day money-back'],
        sort_order: 1,
      },
      {
        tier_name: 'pro-yearly',
        display_name: 'Pro Yearly',
        price: 44100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 3,
        features: ['All 12 premium plugins', 'Up to 3 websites', 'Priority support', '30-day money-back'],
        sort_order: 2,
      },
      {
        tier_name: 'agency-monthly',
        display_name: 'Agency Monthly',
        price: 29900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        site_limit: 25,
        features: ['All 12 premium plugins', 'Up to 25 websites', 'White label', 'API access', 'Priority support'],
        sort_order: 3,
      },
      {
        tier_name: 'agency-yearly',
        display_name: 'Agency Yearly',
        price: 269100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        site_limit: 25,
        features: ['All 12 premium plugins', 'Up to 25 websites', 'White label', 'API access', 'Priority support'],
        sort_order: 4,
      },
      {
        tier_name: 'enterprise-monthly',
        display_name: 'Enterprise Monthly',
        price: 99900,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'month',
        features: ['All 12 premium plugins', 'Unlimited websites', '24/7 support', 'Custom SLA', 'Dedicated manager'],
        sort_order: 5,
      },
      {
        tier_name: 'enterprise-yearly',
        display_name: 'Enterprise Yearly',
        price: 899100,
        currency: 'usd',
        pricing_model: 'subscription',
        billing_interval: 'year',
        features: ['All 12 premium plugins', 'Unlimited websites', '24/7 support', 'Custom SLA', 'Dedicated manager'],
        sort_order: 6,
      },
    ],
  },
];

async function seedProducts() {
  console.log('🌱 Starting complete product seeding (20 products)...\n');

  try {
    await sql`SELECT 1`;
    console.log('✅ Database connected\n');

    let totalNew = 0;
    let totalUpdated = 0;
    let totalTiers = 0;

    for (const productData of products) {
      console.log(`📦 ${productData.name}...`);

      const { rows: existing } = await sql`
        SELECT id FROM products WHERE slug = ${productData.slug}
      `;

      let productId: string;

      if (existing.length > 0) {
        productId = existing[0].id.toString();
        await sql`
          UPDATE products 
          SET name = ${productData.name}, 
              type = ${productData.type}::product_type, 
              description = ${productData.description}, 
              short_description = ${productData.short_description}
          WHERE id = ${productId}
        `;
        totalUpdated++;
      } else {
        const { rows: newProduct } = await sql`
          INSERT INTO products (slug, name, type, description, short_description)
          VALUES (${productData.slug}, ${productData.name}, ${productData.type}::product_type, 
                  ${productData.description}, ${productData.short_description})
          RETURNING id
        `;
        productId = newProduct[0].id.toString();
        totalNew++;
      }

      // Seed tiers
      for (const tier of productData.tiers) {
        const { rows: existingTier } = await sql`
          SELECT id FROM pricing_tiers 
          WHERE product_id = ${productId} AND tier_name = ${tier.tier_name}
        `;

        if (existingTier.length > 0) {
          await sql`
            UPDATE pricing_tiers
            SET display_name = ${tier.display_name}, price = ${tier.price}, 
                currency = ${tier.currency}, 
                pricing_model = ${tier.pricing_model}::pricing_model_type, 
                billing_interval = ${tier.billing_interval || null}::billing_interval_type, 
                site_limit = ${tier.site_limit || null}, 
                features = ${JSON.stringify(tier.features)}, 
                sort_order = ${tier.sort_order}
            WHERE id = ${existingTier[0].id}
          `;
        } else {
          await sql`
            INSERT INTO pricing_tiers 
            (product_id, tier_name, display_name, price, currency, pricing_model, 
             billing_interval, site_limit, features, sort_order)
            VALUES (${productId}, ${tier.tier_name}, ${tier.display_name}, ${tier.price}, 
                    ${tier.currency}, ${tier.pricing_model}::pricing_model_type, 
                    ${tier.billing_interval || null}::billing_interval_type, 
                    ${tier.site_limit || null}, ${JSON.stringify(tier.features)}, ${tier.sort_order})
          `;
          totalTiers++;
        }
      }
    }

    console.log('\n✅ Seeding complete!');
    console.log(`   📦 Products: ${totalNew} new, ${totalUpdated} updated`);
    console.log(`   💰 Pricing tiers: ${totalTiers} created`);
    console.log(`   ✨ Total: 12 plugins + 7 services + 1 bundle = 20 products`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

seedProducts()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
