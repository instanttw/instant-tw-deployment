import { OrganizationJsonLd } from 'next-seo';
import { SEO_CONFIG } from '@/lib/seo-config';

export function OrganizationSchema() {
  return (
    <OrganizationJsonLd
      type="Organization"
      id={SEO_CONFIG.siteUrl}
      url={SEO_CONFIG.siteUrl}
      name={SEO_CONFIG.company.name}
      legalName={SEO_CONFIG.company.legalName}
      description={SEO_CONFIG.company.description}
      logo={`${SEO_CONFIG.siteUrl}/logo.png`}
      foundingDate={SEO_CONFIG.company.foundingDate}
      address={{
        streetAddress: SEO_CONFIG.company.address.streetAddress,
        addressLocality: SEO_CONFIG.company.address.addressLocality,
        addressRegion: SEO_CONFIG.company.address.addressRegion,
        postalCode: SEO_CONFIG.company.address.postalCode,
        addressCountry: SEO_CONFIG.company.address.addressCountry,
      }}
      contactPoint={[
        {
          telephone: SEO_CONFIG.company.phone,
          contactType: 'customer support',
          email: SEO_CONFIG.company.email,
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'Spanish'],
        },
      ]}
      sameAs={Object.values(SEO_CONFIG.company.social)}
    />
  );
}
