import { BreadcrumbJsonLd } from 'next-seo';
import { SEO_CONFIG } from '@/lib/seo-config';

interface BreadcrumbItem {
  name: string;
  item?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  // Add home as the first item if not present
  const breadcrumbs = items[0]?.name === 'Home' 
    ? items 
    : [{ name: 'Home', item: SEO_CONFIG.siteUrl }, ...items];

  return (
    <BreadcrumbJsonLd
      itemListElements={breadcrumbs.map((item, index) => ({
        position: index + 1,
        name: item.name,
        item: item.item,
      }))}
    />
  );
}
