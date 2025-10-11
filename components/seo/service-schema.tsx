import { SEO_CONFIG } from '@/lib/seo-config';

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
  providerMobility?: string;
  priceRange?: string;
  url?: string;
  image?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function ServiceSchema({
  name,
  description,
  serviceType,
  areaServed = 'Worldwide',
  providerMobility = 'static',
  priceRange,
  url,
  image,
  aggregateRating,
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: SEO_CONFIG.company.name,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/logo.png`,
      telephone: SEO_CONFIG.company.phone,
      email: SEO_CONFIG.company.email,
    },
    areaServed: {
      '@type': 'Place',
      name: areaServed,
    },
    providerMobility,
    ...(priceRange && { priceRange }),
    ...(url && { url }),
    ...(image && { 
      image: image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}` 
    }),
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue.toString(),
        reviewCount: aggregateRating.reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      ...(priceRange && { priceRange }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
