import type { NextConfig } from "next";

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
    unoptimized: false, // Enable Next.js image optimization
    domains: ['wp.instant.tw'], // Add your domain
    formats: ['image/avif', 'image/webp'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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

export default nextConfig;
