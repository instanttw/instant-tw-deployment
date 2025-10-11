import { DefaultSeoProps } from 'next-seo';

export const SEO_CONFIG = {
  siteName: 'Instant - Premium WordPress Plugins & Services',
  siteUrl: 'https://wp.instant.tw',
  company: {
    name: 'Instant',
    legalName: 'Instant Technologies',
    foundingDate: '2020-01-01',
    description: 'Leading provider of premium WordPress plugins, themes, and professional services including security, hosting, and optimization.',
    email: 'support@instant.tw',
    phone: '+1-234-567-8900', // Update with actual phone
    address: {
      streetAddress: '123 WordPress Street', // Update with actual address
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94102',
      addressCountry: 'US',
    },
    social: {
      twitter: 'https://twitter.com/instantplugins',
      facebook: 'https://facebook.com/instantplugins',
      linkedin: 'https://linkedin.com/company/instant',
      github: 'https://github.com/instant-plugins',
      youtube: 'https://youtube.com/@instantplugins',
    },
  },
  defaultMeta: {
    title: 'Instant - Premium WordPress Plugins & Services',
    description: 'Transform your WordPress site with our collection of premium plugins and professional services. Get security, hosting, optimization, and 8+ powerful plugins with exceptional support.',
    keywords: [
      'WordPress plugins',
      'premium WordPress plugins',
      'WordPress themes',
      'WordPress security',
      'WordPress hosting',
      'WordPress optimization',
      'WordPress SEO',
      'WordPress maintenance',
      'WP plugins',
      'WordPress vulnerability scanner',
      'WordPress speed optimization',
      'WordPress malware protection',
    ],
  },
  primaryKeywords: {
    main: ['WordPress plugins', 'premium WordPress plugins', 'WordPress services'],
    longtail: [
      'best WordPress security plugins',
      'WordPress image optimization plugin',
      'WordPress vulnerability scanner',
      'WordPress hosting services',
      'WordPress speed optimization',
      'professional WordPress maintenance',
      'WordPress broken link checker',
      'WordPress security services',
    ],
    transactional: [
      'buy WordPress plugins',
      'WordPress plugin pricing',
      'download WordPress plugins',
      'premium WordPress themes',
    ],
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Instant',
    url: 'https://wp.instant.tw',
    logo: 'https://wp.instant.tw/logo.png',
    description: 'Leading provider of premium WordPress plugins, themes, and professional services.',
    foundingDate: '2020-01-01',
    email: 'support@instant.tw',
    telephone: '+1-234-567-8900',
    sameAs: [
      'https://twitter.com/instantplugins',
      'https://facebook.com/instantplugins',
      'https://linkedin.com/company/instant',
      'https://github.com/instant-plugins',
    ],
  },
  author: {
    '@type': 'Organization',
    name: 'Instant',
    url: 'https://wp.instant.tw',
  },
};

export const DEFAULT_SEO: DefaultSeoProps = {
  defaultTitle: SEO_CONFIG.defaultMeta.title,
  titleTemplate: '%s | Instant WordPress Plugins',
  description: SEO_CONFIG.defaultMeta.description,
  canonical: SEO_CONFIG.siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultMeta.title,
    description: SEO_CONFIG.defaultMeta.description,
    images: [
      {
        url: `${SEO_CONFIG.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Instant WordPress Plugins & Services',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@instantplugins',
    site: '@instantplugins',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: SEO_CONFIG.defaultMeta.keywords.join(', '),
    },
    {
      name: 'author',
      content: 'Instant',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'theme-color',
      content: '#000000',
    },
    {
      name: 'application-name',
      content: 'Instant WordPress',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Instant',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

// Helper function to generate page-specific SEO
export function generatePageSEO(
  title: string,
  description: string,
  path: string = '',
  additionalConfig?: Partial<DefaultSeoProps>
): DefaultSeoProps {
  const url = `${SEO_CONFIG.siteUrl}${path}`;
  
  return {
    ...DEFAULT_SEO,
    title,
    description,
    canonical: url,
    openGraph: {
      ...DEFAULT_SEO.openGraph,
      title,
      description,
      url,
    },
    ...additionalConfig,
  };
}

// Generate Product SEO
export function generateProductSEO(
  name: string,
  description: string,
  price: number,
  rating: number,
  reviews: number,
  slug: string,
  imageUrl?: string
) {
  return generatePageSEO(
    `${name} - Premium WordPress Plugin`,
    description,
    `/plugins/${slug}`,
    {
      openGraph: {
        type: 'product',
        url: `${SEO_CONFIG.siteUrl}/plugins/${slug}`,
        title: `${name} - Premium WordPress Plugin`,
        description,
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: name,
          },
        ] : undefined,
      },
    }
  );
}

// Generate Service SEO
export function generateServiceSEO(
  name: string,
  description: string,
  slug: string
) {
  return generatePageSEO(
    `${name} - Professional WordPress Services`,
    description,
    `/services/${slug}`
  );
}

// Generate Blog Post SEO
export function generateBlogSEO(
  title: string,
  description: string,
  slug: string,
  publishDate: string,
  modifiedDate?: string,
  author?: string,
  imageUrl?: string
) {
  return generatePageSEO(
    title,
    description,
    `/blog/${slug}`,
    {
      openGraph: {
        type: 'article',
        article: {
          publishedTime: publishDate,
          modifiedTime: modifiedDate || publishDate,
          authors: author ? [author] : undefined,
        },
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ] : undefined,
      },
    }
  );
}
