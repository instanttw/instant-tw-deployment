import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always', // Always require /en prefix
  localeDetection: true, // Auto-detect from browser
});

export const config = {
  // Only match paths that should use i18n (everything except specific excluded routes)
  matcher: [
    // Include root and [locale] paths
    '/',
    '/(en)/:path*',
    // Exclude all non-i18n routes
    '/((?!api|_next|_vercel|.*\\.|login|signup|dashboard|admin|checkout|wp-scan|about|blog|careers|changelog|community|contact|partners|privacy|refund-policy|roadmap|terms|affiliates).*)',
  ],
};
