import { ProductJsonLd } from 'next-seo';
import { SEO_CONFIG } from '@/lib/seo-config';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  sku?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
  category?: string;
  offers?: Array<{
    price: number;
    priceCurrency: string;
    name: string;
    description?: string;
  }>;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'USD',
  rating,
  reviewCount,
  brand = 'Instant',
  sku,
  availability = 'InStock',
  url,
  category,
  offers,
}: ProductSchemaProps) {
  const productUrl = url || `${SEO_CONFIG.siteUrl}/plugins/${name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <ProductJsonLd
      productName={name}
      description={description}
      images={[image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`]}
      brand={brand}
      reviews={rating && reviewCount ? [
        {
          author: 'Verified Customers',
          datePublished: new Date().toISOString(),
          reviewBody: `Average rating from ${reviewCount} verified customers.`,
          name: `${name} Reviews`,
          reviewRating: {
            bestRating: '5',
            ratingValue: rating.toString(),
            worstRating: '1',
          },
        },
      ] : undefined}
      aggregateRating={rating && reviewCount ? {
        ratingValue: rating.toString(),
        reviewCount: reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      } : undefined}
      offers={offers ? offers.map(offer => ({
        price: offer.price.toString(),
        priceCurrency: offer.priceCurrency,
        name: offer.name,
        description: offer.description,
        availability: 'https://schema.org/InStock',
        url: productUrl,
        seller: {
          name: SEO_CONFIG.company.name,
        },
      })) : [{
        price: price.toString(),
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        url: productUrl,
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        seller: {
          name: SEO_CONFIG.company.name,
        },
      }]}
      sku={sku}
      category={category}
    />
  );
}

// Software Application Schema (more specific for plugins)
export function SoftwareApplicationSchema({
  name,
  description,
  image,
  price,
  currency = 'USD',
  rating,
  reviewCount,
  category,
  operatingSystem = 'WordPress',
  applicationCategory = 'BusinessApplication',
  downloadUrl,
}: ProductSchemaProps & {
  operatingSystem?: string;
  applicationCategory?: string;
  downloadUrl?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    image: image.startsWith('http') ? image : `${SEO_CONFIG.siteUrl}${image}`,
    operatingSystem,
    applicationCategory,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: `${SEO_CONFIG.siteUrl}/plugins/${name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.company.name,
      url: SEO_CONFIG.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.company.name,
      url: SEO_CONFIG.siteUrl,
    },
    ...(downloadUrl && { downloadUrl }),
    ...(rating && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toString(),
        reviewCount: reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(category && { applicationSubCategory: category }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
