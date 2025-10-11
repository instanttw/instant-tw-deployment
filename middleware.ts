import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed', // Don't add /en prefix for default locale
  localeDetection: true, // Auto-detect from browser
});

export const config = {
  // Match all pathnames except:
  // - API routes (/api)
  // - Next.js internals (/_next, /_vercel)
  // - Static files (images, fonts, etc.)
  // - Auth/protected routes (/login, /signup, /dashboard, /admin, /checkout)
  matcher: [
    '/((?!api|_next|_vercel|login|signup|dashboard|admin|checkout|.*\\..*).*)',
  ],
};
