/**
 * Stripe Configuration
 * All Product Plans: WP Scan, Hosting, Plugin Bundles
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Product Types
export type ProductType = 'wpscan' | 'hosting' | 'plugins' | 'themes' | 'maintenance' | 'seo' | 'speed' | 'security';
export type PlanTier = 'PRO' | 'AGENCY' | 'ENTERPRISE' | 'STARTUP' | 'PROFESSIONAL' | 'GROWTH' | 'SCALE';
export type BillingInterval = 'month' | 'year';

export interface StripeProduct {
  priceId: string;
  amount: number;
  interval: BillingInterval;
  plan: PlanTier;
  productType: ProductType;
  displayName?: string;
}

// ===========================================
// WP SCAN SUBSCRIPTION PLANS
// ===========================================
export const WP_SCAN_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_PRO_MONTHLY || 'price_wpscan_pro_monthly',
    amount: 1900, // $19.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_PRO_YEARLY || 'price_wpscan_pro_yearly',
    amount: 15200, // $152.00 (20% off: 19*12*0.8)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_AGENCY_MONTHLY || 'price_wpscan_agency_monthly',
    amount: 9900, // $99.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_AGENCY_YEARLY || 'price_wpscan_agency_yearly',
    amount: 79200, // $792.00 (20% off: 99*12*0.8)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_ENTERPRISE_MONTHLY || 'price_wpscan_enterprise_monthly',
    amount: 29900, // $299.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_WPSCAN_ENTERPRISE_YEARLY || 'price_wpscan_enterprise_yearly',
    amount: 239200, // $2,392.00 (20% off: 299*12*0.8)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'wpscan' as const,
    displayName: 'WP Scan Enterprise - Yearly',
  },
};

// ===========================================
// HOSTING PLANS
// ===========================================
export const HOSTING_PLANS = {
  STARTUP_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_STARTUP_MONTHLY || 'price_hosting_startup_monthly',
    amount: 2900, // $29.00
    interval: 'month' as const,
    plan: 'STARTUP' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Startup - Monthly',
  },
  STARTUP_YEARLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_STARTUP_YEARLY || 'price_hosting_startup_yearly',
    amount: 26100, // $261.00 (25% off: 29*12*0.75)
    interval: 'year' as const,
    plan: 'STARTUP' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Startup - Yearly',
  },
  PROFESSIONAL_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_PROFESSIONAL_MONTHLY || 'price_hosting_professional_monthly',
    amount: 6900, // $69.00
    interval: 'month' as const,
    plan: 'PROFESSIONAL' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Professional - Monthly',
  },
  PROFESSIONAL_YEARLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_PROFESSIONAL_YEARLY || 'price_hosting_professional_yearly',
    amount: 62100, // $621.00 (25% off: 69*12*0.75)
    interval: 'year' as const,
    plan: 'PROFESSIONAL' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Professional - Yearly',
  },
  GROWTH_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_GROWTH_MONTHLY || 'price_hosting_growth_monthly',
    amount: 13900, // $139.00
    interval: 'month' as const,
    plan: 'GROWTH' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Growth - Monthly',
  },
  GROWTH_YEARLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_GROWTH_YEARLY || 'price_hosting_growth_yearly',
    amount: 125100, // $1,251.00 (25% off: 139*12*0.75)
    interval: 'year' as const,
    plan: 'GROWTH' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Growth - Yearly',
  },
  SCALE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_SCALE_MONTHLY || 'price_hosting_scale_monthly',
    amount: 29900, // $299.00
    interval: 'month' as const,
    plan: 'SCALE' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Scale - Monthly',
  },
  SCALE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_HOSTING_SCALE_YEARLY || 'price_hosting_scale_yearly',
    amount: 269100, // $2,691.00 (25% off: 299*12*0.75)
    interval: 'year' as const,
    plan: 'SCALE' as const,
    productType: 'hosting' as const,
    displayName: 'Hosting Scale - Yearly',
  },
};

// ===========================================
// PLUGIN BUNDLE PLANS
// ===========================================
export const PLUGIN_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_PRO_MONTHLY || 'price_plugins_pro_monthly',
    amount: 4900, // $49.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_PRO_YEARLY || 'price_plugins_pro_yearly',
    amount: 44100, // $441.00 (25% off: 49*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_AGENCY_MONTHLY || 'price_plugins_agency_monthly',
    amount: 29900, // $299.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_AGENCY_YEARLY || 'price_plugins_agency_yearly',
    amount: 269100, // $2,691.00 (25% off: 299*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_ENTERPRISE_MONTHLY || 'price_plugins_enterprise_monthly',
    amount: 99900, // $999.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_PLUGINS_ENTERPRISE_YEARLY || 'price_plugins_enterprise_yearly',
    amount: 899100, // $8,991.00 (25% off: 999*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'plugins' as const,
    displayName: 'Plugin Bundle Enterprise - Yearly',
  },
};

// ===========================================
// THEMES SERVICE PLANS
// ===========================================
export const THEMES_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_PRO_MONTHLY || 'price_themes_pro_monthly',
    amount: 9900, // $99.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'themes' as const,
    displayName: 'Themes Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_PRO_YEARLY || 'price_themes_pro_yearly',
    amount: 89100, // $891.00 (25% off: 99*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'themes' as const,
    displayName: 'Themes Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_AGENCY_MONTHLY || 'price_themes_agency_monthly',
    amount: 59900, // $599.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'themes' as const,
    displayName: 'Themes Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_AGENCY_YEARLY || 'price_themes_agency_yearly',
    amount: 539100, // $5,391.00 (25% off: 599*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'themes' as const,
    displayName: 'Themes Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_ENTERPRISE_MONTHLY || 'price_themes_enterprise_monthly',
    amount: 129900, // $1,299.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'themes' as const,
    displayName: 'Themes Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_THEMES_ENTERPRISE_YEARLY || 'price_themes_enterprise_yearly',
    amount: 1169100, // $11,691.00 (25% off: 1299*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'themes' as const,
    displayName: 'Themes Enterprise - Yearly',
  },
};

// ===========================================
// MAINTENANCE SERVICE PLANS
// ===========================================
export const MAINTENANCE_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_PRO_MONTHLY || 'price_maintenance_pro_monthly',
    amount: 4900, // $49.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_PRO_YEARLY || 'price_maintenance_pro_yearly',
    amount: 44100, // $441.00 (25% off: 49*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_AGENCY_MONTHLY || 'price_maintenance_agency_monthly',
    amount: 14900, // $149.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_AGENCY_YEARLY || 'price_maintenance_agency_yearly',
    amount: 134100, // $1,341.00 (25% off: 149*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_ENTERPRISE_MONTHLY || 'price_maintenance_enterprise_monthly',
    amount: 49900, // $499.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_MAINTENANCE_ENTERPRISE_YEARLY || 'price_maintenance_enterprise_yearly',
    amount: 449100, // $4,491.00 (25% off: 499*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'maintenance' as const,
    displayName: 'Maintenance Enterprise - Yearly',
  },
};

// ===========================================
// SEO SERVICE PLANS
// ===========================================
export const SEO_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SEO_PRO_MONTHLY || 'price_seo_pro_monthly',
    amount: 79900, // $799.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'seo' as const,
    displayName: 'SEO Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SEO_PRO_YEARLY || 'price_seo_pro_yearly',
    amount: 719100, // $7,191.00 (25% off: 799*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'seo' as const,
    displayName: 'SEO Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SEO_AGENCY_MONTHLY || 'price_seo_agency_monthly',
    amount: 149900, // $1,499.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'seo' as const,
    displayName: 'SEO Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SEO_AGENCY_YEARLY || 'price_seo_agency_yearly',
    amount: 1349100, // $13,491.00 (25% off: 1499*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'seo' as const,
    displayName: 'SEO Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SEO_ENTERPRISE_MONTHLY || 'price_seo_enterprise_monthly',
    amount: 299900, // $2,999.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'seo' as const,
    displayName: 'SEO Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SEO_ENTERPRISE_YEARLY || 'price_seo_enterprise_yearly',
    amount: 2699100, // $26,991.00 (25% off: 2999*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'seo' as const,
    displayName: 'SEO Enterprise - Yearly',
  },
};

// ===========================================
// SPEED OPTIMIZATION SERVICE PLANS
// ===========================================
export const SPEED_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_PRO_MONTHLY || 'price_speed_pro_monthly',
    amount: 39900, // $399.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_PRO_YEARLY || 'price_speed_pro_yearly',
    amount: 359100, // $3,591.00 (25% off: 399*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_AGENCY_MONTHLY || 'price_speed_agency_monthly',
    amount: 99900, // $999.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_AGENCY_YEARLY || 'price_speed_agency_yearly',
    amount: 899100, // $8,991.00 (25% off: 999*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_ENTERPRISE_MONTHLY || 'price_speed_enterprise_monthly',
    amount: 199900, // $1,999.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SPEED_ENTERPRISE_YEARLY || 'price_speed_enterprise_yearly',
    amount: 1799100, // $17,991.00 (25% off: 1999*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'speed' as const,
    displayName: 'Speed Optimization Enterprise - Yearly',
  },
};

// ===========================================
// SECURITY SERVICE PLANS
// ===========================================
export const SECURITY_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_PRO_MONTHLY || 'price_security_pro_monthly',
    amount: 99900, // $999.00
    interval: 'month' as const,
    plan: 'PRO' as const,
    productType: 'security' as const,
    displayName: 'Security Pro - Monthly',
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_PRO_YEARLY || 'price_security_pro_yearly',
    amount: 899100, // $8,991.00 (25% off: 999*12*0.75)
    interval: 'year' as const,
    plan: 'PRO' as const,
    productType: 'security' as const,
    displayName: 'Security Pro - Yearly',
  },
  AGENCY_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_AGENCY_MONTHLY || 'price_security_agency_monthly',
    amount: 249900, // $2,499.00
    interval: 'month' as const,
    plan: 'AGENCY' as const,
    productType: 'security' as const,
    displayName: 'Security Agency - Monthly',
  },
  AGENCY_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_AGENCY_YEARLY || 'price_security_agency_yearly',
    amount: 2249100, // $22,491.00 (25% off: 2499*12*0.75)
    interval: 'year' as const,
    plan: 'AGENCY' as const,
    productType: 'security' as const,
    displayName: 'Security Agency - Yearly',
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_ENTERPRISE_MONTHLY || 'price_security_enterprise_monthly',
    amount: 499900, // $4,999.00
    interval: 'month' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'security' as const,
    displayName: 'Security Enterprise - Monthly',
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_SECURITY_ENTERPRISE_YEARLY || 'price_security_enterprise_yearly',
    amount: 4499100, // $44,991.00 (25% off: 4999*12*0.75)
    interval: 'year' as const,
    plan: 'ENTERPRISE' as const,
    productType: 'security' as const,
    displayName: 'Security Enterprise - Yearly',
  },
};

// ===========================================
// COMBINED PLANS (All Products)
// ===========================================
export const ALL_STRIPE_PLANS = {
  ...WP_SCAN_PLANS,
  ...HOSTING_PLANS,
  ...PLUGIN_PLANS,
  ...THEMES_PLANS,
  ...MAINTENANCE_PLANS,
  ...SEO_PLANS,
  ...SPEED_PLANS,
  ...SECURITY_PLANS,
};

// Legacy export for backward compatibility
export const STRIPE_PLANS = WP_SCAN_PLANS;

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get plan configuration by price ID
 */
export function getPlanByPriceId(priceId: string): StripeProduct | null {
  const entry = Object.entries(ALL_STRIPE_PLANS).find(
    ([_, config]) => config.priceId === priceId
  );
  return entry ? entry[1] : null;
}

/**
 * Get plan key by plan name and billing cycle
 * For WP Scan plans (backward compatibility)
 */
export function getPlanKey(plan: string, billing: 'monthly' | 'yearly'): keyof typeof WP_SCAN_PLANS {
  const planUpper = plan.toUpperCase();
  const billingUpper = billing.toUpperCase();
  return `${planUpper}_${billingUpper}` as keyof typeof WP_SCAN_PLANS;
}

/**
 * Get product by productId and billing cycle
 * Supports multiple formats:
 * - "pro" / "agency" / "enterprise" (WP Scan plans)
 * - "hosting-startup" / "hosting-professional" / etc.
 * - "plugins-pro" / "plugins-agency" / etc.
 * - "themes-pro" / "themes-agency" / etc.
 * - "maintenance-pro" / "maintenance-agency" / etc.
 * - "seo-pro" / "seo-agency" / etc.
 * - "speed-pro" / "speed-agency" / etc.
 * - "security-pro" / "security-agency" / etc.
 */
export function getProductByIdentifier(
  productId: string,
  billingCycle: 'monthly' | 'yearly'
): StripeProduct | null {
  const billing = billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY';
  
  // Handle WP Scan plans (legacy format: "pro", "agency", "enterprise")
  if (['pro', 'agency', 'enterprise'].includes(productId.toLowerCase())) {
    const planKey = `${productId.toUpperCase()}_${billing}` as keyof typeof WP_SCAN_PLANS;
    return WP_SCAN_PLANS[planKey] || null;
  }
  
  // Handle hosting plans (format: "hosting-startup", "hosting-professional", etc.)
  if (productId.startsWith('hosting-')) {
    const tier = productId.replace('hosting-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof HOSTING_PLANS;
    return HOSTING_PLANS[planKey] || null;
  }
  
  // Handle plugin plans (format: "plugins-pro", "plugins-agency", etc.)
  if (productId.startsWith('plugins-')) {
    const tier = productId.replace('plugins-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof PLUGIN_PLANS;
    return PLUGIN_PLANS[planKey] || null;
  }
  
  // Handle themes service (format: "themes-pro", "themes-agency", etc.)
  if (productId.startsWith('themes-')) {
    const tier = productId.replace('themes-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof THEMES_PLANS;
    return THEMES_PLANS[planKey] || null;
  }
  
  // Handle maintenance service (format: "maintenance-pro", "maintenance-agency", etc.)
  if (productId.startsWith('maintenance-')) {
    const tier = productId.replace('maintenance-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof MAINTENANCE_PLANS;
    return MAINTENANCE_PLANS[planKey] || null;
  }
  
  // Handle SEO service (format: "seo-pro", "seo-agency", etc.)
  if (productId.startsWith('seo-')) {
    const tier = productId.replace('seo-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof SEO_PLANS;
    return SEO_PLANS[planKey] || null;
  }
  
  // Handle speed optimization service (format: "speed-pro", "speed-agency", etc.)
  if (productId.startsWith('speed-')) {
    const tier = productId.replace('speed-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof SPEED_PLANS;
    return SPEED_PLANS[planKey] || null;
  }
  
  // Handle security service (format: "security-pro", "security-agency", etc.)
  if (productId.startsWith('security-')) {
    const tier = productId.replace('security-', '').toUpperCase();
    const planKey = `${tier}_${billing}` as keyof typeof SECURITY_PLANS;
    return SECURITY_PLANS[planKey] || null;
  }
  
  // Try direct match as fallback
  const directKey = `${productId.toUpperCase()}_${billing}`;
  return (ALL_STRIPE_PLANS as any)[directKey] || null;
}

/**
 * Get all plans by product type
 */
export function getPlansByType(productType: ProductType): StripeProduct[] {
  return Object.values(ALL_STRIPE_PLANS).filter(
    plan => plan.productType === productType
  );
}
