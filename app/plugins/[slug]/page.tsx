import { notFound } from "next/navigation";
import { Metadata } from "next";
import { featuredPlugins } from "@/config/plugins";
import { PluginDetailClient } from "./plugin-detail-client";

export async function generateStaticParams() {
  return featuredPlugins.map((plugin) => ({
    slug: plugin.slug,
  }));
}

// Competitor keywords map
const competitorKeywords: Record<string, string[]> = {
  'instant-seo': ['yoast seo', 'rank math', 'all in one seo', 'yoast seo alternative', 'wordpress seo plugin', 'best seo plugin wordpress', 'seo optimization wordpress'],
  'instant-cache': ['wp rocket', 'w3 total cache', 'wp super cache', 'wordpress cache plugin', 'wp rocket alternative', 'wordpress speed optimization', 'fastest wordpress'],
  'instant-forms': ['contact form 7', 'wpforms', 'ninja forms', 'gravity forms', 'wordpress forms', 'contact form plugin', 'form builder wordpress'],
  'instant-security-guard': ['wordfence', 'sucuri', 'ithemes security', 'wordpress security plugin', 'wordfence alternative', 'wordpress malware scanner', 'wordpress firewall'],
  'instant-backup': ['updraftplus', 'backupbuddy', 'backup plugin wordpress', 'wordpress backup solution', 'updraftplus alternative', 'wordpress restore'],
  'instant-broken-link-fixer': ['broken link checker', 'link checker wordpress', 'broken links', 'wordpress link management', 'link building tools'],
  'instant-image-optimizer': ['smush', 'imagify', 'shortpixel', 'wordpress image optimization', 'webp converter', 'lazy load images'],
  'instant-duplicator': ['duplicator', 'wordpress migration', 'clone wordpress site', 'wordpress staging', 'site migration plugin'],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plugin = featuredPlugins.find((p) => p.slug === slug);

  if (!plugin) {
    return {
      title: 'Plugin Not Found',
    };
  }

  const lowestPrice = plugin.pricing.free 
    ? 0 
    : Math.min(
        ...Object.values(plugin.pricing)
          .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null && "price" in p)
          .map(p => p.price)
      );

  // Get competitor keywords for this plugin
  const competitors = competitorKeywords[slug] || [];
  const competitorList = competitors.slice(0, 3).join(', ');
  const alternativeText = competitors.length > 0 ? ` | Better Alternative to ${competitorList}` : '';

  return {
    title: `${plugin.name} - Best WordPress ${plugin.category} Plugin${alternativeText}`,
    description: `${plugin.tagline} - Premium WordPress ${plugin.category.toLowerCase()} plugin. Better alternative to ${competitors.slice(0, 2).join(' and ')}. ${plugin.description.substring(0, 100)}... Free version available.`,
    keywords: [
      plugin.name,
      plugin.slug,
      `WordPress ${plugin.category}`,
      `${plugin.category} plugin`,
      `best ${plugin.category.toLowerCase()} plugin wordpress`,
      `wordpress ${plugin.category.toLowerCase()}`,
      ...competitors,
    ],
    openGraph: {
      title: `${plugin.name} - WordPress ${plugin.category} Plugin`,
      description: `${plugin.tagline} - Better alternative to ${competitors[0] || 'other plugins'}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${plugin.name} - WordPress Plugin`,
      description: plugin.tagline,
    },
  };
}

export default async function PluginDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const plugin = featuredPlugins.find((p) => p.slug === slug);

    if (!plugin) {
      notFound();
    }

    // Serialize the plugin data to ensure it's safe to pass to client component
    const serializedPlugin = JSON.parse(JSON.stringify(plugin));

    return <PluginDetailClient plugin={serializedPlugin} />;
  } catch (error) {
    console.error('Plugin page error:', error);
    throw error; // Re-throw to see full error in dev mode
  }
}
