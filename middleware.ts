import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Don't add /en prefix for default locale
  localeDetection: true, // Auto-detect from browser
});

export const config = {
  // Only apply internationalization to core business pages that are in [locale]
  // Exclude all root-level pages and system routes
  matcher: [
    '/((?!api|_next|_vercel|.*\\.|login|signup|dashboard|admin|checkout|wp-scan|about|blog|careers|changelog|community|contact|partners|privacy|refund-policy|roadmap|terms|affiliates).*)',
  ],
};
