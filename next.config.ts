import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // No output: 'export' for dash.instant.tw (needs dynamic features)
  // Only add output: 'export' when building for wp.instant.tw static site
  
  typescript: {
    // Skip type checking during build (types will be checked in development)
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Skip ESLint during build (will run in development)
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  // Trailing slashes can break RSC prefetch (_rsc) routes; keep default (false)
  trailingSlash: false,

  // Ensure Turbopack resolves from this workspace (prevents lockfile root mis-detection)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  // @ts-ignore - typed in Next.js runtime
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
