import { MetadataRoute } from "next";
import { featuredPlugins } from "@/config/plugins";
import { locales } from "@/i18n";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wp.instant.tw";

  const createAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    languages["x-default"] = `${baseUrl}${path}`;
    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      languages[locale] = `${baseUrl}${prefix}${path}`;
    }
    return { languages } as MetadataRoute.Sitemap[0]["alternates"];
  };

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
    alternates: createAlternates(path || "/"),
  }));

  const pluginEntries: MetadataRoute.Sitemap = featuredPlugins.map((plugin) => {
    const path = `/plugins/${plugin.slug}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: createAlternates(path),
    };
  });

  return [...staticEntries, ...pluginEntries];
}
