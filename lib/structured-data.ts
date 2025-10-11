import { Plugin } from "@/types";

export function generateProductSchema(plugin: Plugin) {
  const prices = Object.values(plugin.pricing)
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null && "price" in p)
    .map((p) => p.price);
  
  const lowestPrice = plugin.pricing.free ? 0 : Math.min(...prices);
  const highestPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: plugin.name,
    description: plugin.description,
    applicationCategory: "Plugin",
    operatingSystem: "WordPress",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: plugin.rating,
      reviewCount: plugin.totalReviews,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Organization",
      name: "Instant",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Instant",
    description: "Premium WordPress plugins marketplace",
    url: "https://wp.instant.tw",
    logo: "https://wp.instant.tw/logo.png",
    sameAs: [
      "https://facebook.com/instantplugins",
      "https://twitter.com/instantplugins",
      "https://linkedin.com/company/instant",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@instant.tw",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Instant",
    url: "https://wp.instant.tw",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://wp.instant.tw/plugins?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}
