// Temporary hardcoded translations to replace next-intl
const translations = {
  header: {
    wpScan: "WP Scan",
    hosting: "Hosting",
    themes: "Themes",
    plugins: "Plugins",
    services: "Services",
    maintenancePlans: "Maintenance Plans",
    speedOptimization: "Speed Optimization",
    securityServices: "Security Services",
    seoServices: "SEO Services",
    pricing: "Pricing",
    browsePlugins: "Browse Plugins",
  },
  // Add more sections as needed
};

export function useTranslations(section: keyof typeof translations) {
  return (key: string) => {
    const sectionTranslations = translations[section] as any;
    return sectionTranslations[key] || key;
  };
}