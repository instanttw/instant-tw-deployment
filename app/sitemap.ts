import { MetadataRoute } from "next";
import { featuredPlugins } from "@/config/plugins";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wp.instant.tw";


  const staticPaths = [
    "",
    "/plugins",
    "/pricing",
    "/docs",
    "/wp-scan",
    "/support",
    "/about",
    "/contact",
    "/blog",
    "/changelog",
    "/roadmap",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/services/hosting",
    "/services/maintenance",
    "/services/speed-optimization",
    "/services/security",
    "/services/seo",
    "/services/themes",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/plugins" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/plugins" ? 0.9 : 0.7,
  }));

  const pluginEntries: MetadataRoute.Sitemap = featuredPlugins.map((plugin) => {
    const path = `/plugins/${plugin.slug}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...pluginEntries];
}
