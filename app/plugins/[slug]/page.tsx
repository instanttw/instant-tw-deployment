import { notFound } from "next/navigation";
import { Metadata } from "next";
import { featuredPlugins } from "@/config/plugins";
import { PluginDetailClient } from "./plugin-detail-client";
import { SoftwareApplicationSchema, BreadcrumbSchema } from "@/components/seo";

export async function generateStaticParams() {
  return featuredPlugins.map((plugin) => ({
    slug: plugin.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plugin = featuredPlugins.find((p) => p.slug === slug);

  if (!plugin) {
    return {
      title: "Plugin Not Found",
    };
  }

  const proPrice = plugin.pricing?.pro?.price || 0;
  const description = plugin.description.length > 160 
    ? plugin.description.substring(0, 157) + "..." 
    : plugin.description;

  return {
    title: `${plugin.name} - Premium WordPress Plugin`,
    description: description,
    keywords: [
      plugin.name,
      `${plugin.name} WordPress plugin`,
      `WordPress ${plugin.category.toLowerCase()}`,
      `premium WordPress ${plugin.category.toLowerCase()} plugin`,
      plugin.category,
      "WordPress plugin",
      "WP plugin",
    ],
    openGraph: {
      type: "product",
      title: `${plugin.name} - Premium WordPress Plugin`,
      description: description,
      url: `https://wp.instant.tw/plugins/${slug}`,
      images: [
        {
          url: plugin.icon.startsWith('http') ? plugin.icon : `https://wp.instant.tw${plugin.icon}`,
          width: 1200,
          height: 630,
          alt: plugin.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${plugin.name} - Premium WordPress Plugin`,
      description: description,
      images: [plugin.icon.startsWith('http') ? plugin.icon : `https://wp.instant.tw${plugin.icon}`],
    },
    alternates: {
      canonical: `https://wp.instant.tw/plugins/${slug}`,
    },
  };
}

export default async function PluginDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plugin = featuredPlugins.find((p) => p.slug === slug);

  if (!plugin) {
    notFound();
  }

  const proPrice = plugin.pricing?.pro?.price || 0;

  return (
    <>
      <SoftwareApplicationSchema
        name={plugin.name}
        description={plugin.description}
        image={plugin.icon}
        price={proPrice}
        rating={plugin.rating}
        reviewCount={plugin.totalReviews}
        category={plugin.category}
        downloadUrl={plugin.freeDownloadUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: "Plugins", item: "https://wp.instant.tw/plugins" },
          { name: plugin.name, item: `https://wp.instant.tw/plugins/${slug}` },
        ]}
      />
      <PluginDetailClient plugin={plugin} />
    </>
  );
}
