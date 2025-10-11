/**
 * Stripe Price IDs Configuration
 * 
 * IMPORTANT: Replace these placeholder IDs with your actual Stripe Price IDs
 * from your Stripe Dashboard (https://dashboard.stripe.com/prices)
 * 
 * To create prices in Stripe:
 * 1. Go to Products in Stripe Dashboard
 * 2. Create products for each plan/plugin
 * 3. Add prices (monthly/yearly) to each product
 * 4. Copy the price IDs (start with "price_") and update this file
 */

export interface PriceMapping {
  monthly: string;
  yearly: string;
}

export interface StripePrices {
  // Main subscription plans
  plans: {
    pro: PriceMapping;
    agency: PriceMapping;
    enterprise: PriceMapping;
  };
  
  // Hosting plans
  hosting: {
    starter: PriceMapping;
    business: PriceMapping;
    agency: PriceMapping;
    enterprise: PriceMapping;
  };
  
  // Individual plugins (one-time or subscription)
  plugins: {
    instantDuplicator: PriceMapping;
    instantDuplicatorAgency: PriceMapping;
    instantDuplicatorEnterprise: PriceMapping;
    seoOptimizer: PriceMapping;
    speedBooster: PriceMapping;
    securityPro: PriceMapping;
    backupMaster: PriceMapping;
    formBuilder: PriceMapping;
    wooEnhancer: PriceMapping;
    emailAutomation: PriceMapping;
    analyticsDashboard: PriceMapping;
    cacheOptimizer: PriceMapping;
    imageOptimizer: PriceMapping;
    membershipPro: PriceMapping;
    popupBuilder: PriceMapping;
  };
  
  // Services
  services: {
    speedOptimization: {
      pro: PriceMapping;
      agency: PriceMapping;
      enterprise: PriceMapping;
    };
    seo: {
      pro: PriceMapping;
      agency: PriceMapping;
      enterprise: PriceMapping;
    };
    security: {
      pro: PriceMapping;
      agency: PriceMapping;
      enterprise: PriceMapping;
    };
    maintenance: {
      pro: PriceMapping;
      agency: PriceMapping;
      enterprise: PriceMapping;
    };
  };
  
  // WP Scan plans
  wpScan: {
    pro: PriceMapping;
    agency: PriceMapping;
    enterprise: PriceMapping;
  };
}

// TODO: Replace all "price_xxx" with actual Stripe Price IDs from your dashboard
export const STRIPE_PRICES: StripePrices = {
  plans: {
    pro: {
      monthly: "price_1QXXpQQ7DZRJfE9G2bSfBxqN", // Replace with actual ID
      yearly: "price_1QXXqAQ7DZRJfE9GVvKQOAVQ",  // Replace with actual ID
    },
    agency: {
      monthly: "price_1QXXr4Q7DZRJfE9GCX7rBCNT", // Replace with actual ID
      yearly: "price_1QXXrgQ7DZRJfE9GnTkL7DzW",  // Replace with actual ID
    },
    enterprise: {
      monthly: "price_1QXXsLQ7DZRJfE9G0bQKUWXg", // Replace with actual ID
      yearly: "price_1QXXsxQ7DZRJfE9GqYHWN7Sp",  // Replace with actual ID
    },
  },
  
  hosting: {
    starter: {
      monthly: "price_hosting_starter_monthly",
      yearly: "price_hosting_starter_yearly",
    },
    business: {
      monthly: "price_hosting_business_monthly",
      yearly: "price_hosting_business_yearly",
    },
    agency: {
      monthly: "price_hosting_agency_monthly",
      yearly: "price_hosting_agency_yearly",
    },
    enterprise: {
      monthly: "price_hosting_enterprise_monthly",
      yearly: "price_hosting_enterprise_yearly",
    },
  },
  
  plugins: {
    instantDuplicator: {
      monthly: "price_instant_duplicator_pro_monthly",
      yearly: "price_instant_duplicator_pro_yearly",
    },
    instantDuplicatorAgency: {
      monthly: "price_instant_duplicator_agency_monthly",
      yearly: "price_instant_duplicator_agency_yearly",
    },
    instantDuplicatorEnterprise: {
      monthly: "price_instant_duplicator_enterprise_monthly",
      yearly: "price_instant_duplicator_enterprise_yearly",
    },
    seoOptimizer: {
      monthly: "price_seo_optimizer",
      yearly: "price_seo_optimizer",
    },
    speedBooster: {
      monthly: "price_speed_booster",
      yearly: "price_speed_booster",
    },
    securityPro: {
      monthly: "price_security_pro",
      yearly: "price_security_pro",
    },
    backupMaster: {
      monthly: "price_backup_master",
      yearly: "price_backup_master",
    },
    formBuilder: {
      monthly: "price_form_builder",
      yearly: "price_form_builder",
    },
    wooEnhancer: {
      monthly: "price_woo_enhancer",
      yearly: "price_woo_enhancer",
    },
    emailAutomation: {
      monthly: "price_email_automation",
      yearly: "price_email_automation",
    },
    analyticsDashboard: {
      monthly: "price_analytics_dashboard",
      yearly: "price_analytics_dashboard",
    },
    cacheOptimizer: {
      monthly: "price_cache_optimizer",
      yearly: "price_cache_optimizer",
    },
    imageOptimizer: {
      monthly: "price_image_optimizer",
      yearly: "price_image_optimizer",
    },
    membershipPro: {
      monthly: "price_membership_pro",
      yearly: "price_membership_pro",
    },
    popupBuilder: {
      monthly: "price_popup_builder",
      yearly: "price_popup_builder",
    },
  },
  
  services: {
    speedOptimization: {
      pro: {
        monthly: "price_speed_pro_monthly",
        yearly: "price_speed_pro_yearly",
      },
      agency: {
        monthly: "price_speed_agency_monthly",
        yearly: "price_speed_agency_yearly",
      },
      enterprise: {
        monthly: "price_speed_enterprise_monthly",
        yearly: "price_speed_enterprise_yearly",
      },
    },
    seo: {
      pro: {
        monthly: "price_seo_service_pro_monthly",
        yearly: "price_seo_service_pro_yearly",
      },
      agency: {
        monthly: "price_seo_service_agency_monthly",
        yearly: "price_seo_service_agency_yearly",
      },
      enterprise: {
        monthly: "price_seo_service_enterprise_monthly",
        yearly: "price_seo_service_enterprise_yearly",
      },
    },
    security: {
      pro: {
        monthly: "price_security_service_pro_monthly",
        yearly: "price_security_service_pro_yearly",
      },
      agency: {
        monthly: "price_security_service_agency_monthly",
        yearly: "price_security_service_agency_yearly",
      },
      enterprise: {
        monthly: "price_security_service_enterprise_monthly",
        yearly: "price_security_service_enterprise_yearly",
      },
    },
    maintenance: {
      pro: {
        monthly: "price_maintenance_pro_monthly",
        yearly: "price_maintenance_pro_yearly",
      },
      agency: {
        monthly: "price_maintenance_agency_monthly",
        yearly: "price_maintenance_agency_yearly",
      },
      enterprise: {
        monthly: "price_maintenance_enterprise_monthly",
        yearly: "price_maintenance_enterprise_yearly",
      },
    },
  },
  
  wpScan: {
    pro: {
      monthly: "price_wpscan_pro_monthly",
      yearly: "price_wpscan_pro_yearly",
    },
    agency: {
      monthly: "price_wpscan_agency_monthly",
      yearly: "price_wpscan_agency_yearly",
    },
    enterprise: {
      monthly: "price_wpscan_enterprise_monthly",
      yearly: "price_wpscan_enterprise_yearly",
    },
  },
};

/**
 * Helper function to get price ID by product ID and billing cycle
 */
export function getPriceId(productId: string, billingCycle: "monthly" | "yearly" = "monthly"): string | null {
  // Handle different product ID formats
  const parts = productId.split("-");
  
  // Main plans (pro, agency, enterprise)
  if (["pro", "agency", "enterprise"].includes(productId)) {
    return STRIPE_PRICES.plans[productId as keyof typeof STRIPE_PRICES.plans][billingCycle];
  }
  
  // Hosting plans
  if (productId.startsWith("hosting-")) {
    const plan = parts[1] as keyof typeof STRIPE_PRICES.hosting;
    return STRIPE_PRICES.hosting[plan]?.[billingCycle] || null;
  }
  
  // Services
  if (productId.includes("speed-") || productId.includes("seo-") || 
      productId.includes("security-") || productId.includes("maintenance-")) {
    const [service, tier] = productId.split("-");
    const serviceKey = service === "speed" ? "speedOptimization" : service;
    return (STRIPE_PRICES.services as any)[serviceKey]?.[tier]?.[billingCycle] || null;
  }
  
  // WP Scan
  if (productId.startsWith("wpscan-")) {
    const tier = parts[1] as keyof typeof STRIPE_PRICES.wpScan;
    return STRIPE_PRICES.wpScan[tier]?.[billingCycle] || null;
  }
  
  // Individual plugins (convert kebab-case to camelCase)
  const pluginKey = productId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  if (pluginKey in STRIPE_PRICES.plugins) {
    return (STRIPE_PRICES.plugins as any)[pluginKey][billingCycle];
  }
  
  return null;
}
