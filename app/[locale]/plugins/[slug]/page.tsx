import { notFound } from "next/navigation";
import { featuredPlugins } from "@/config/plugins";
import { PluginDetailClient } from "./plugin-detail-client";

export async function generateStaticParams() {
  return featuredPlugins.map((plugin) => ({
    slug: plugin.slug,
  }));
}

export default async function PluginDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const plugin = featuredPlugins.find((p) => p.slug === slug);

  if (!plugin) {
    notFound();
  }

  return <PluginDetailClient plugin={plugin} />;
}
