import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "de", "ar", "pt-BR", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false, // Disable automatic detection to prevent issues
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip middleware entirely for RSC requests
  if (search.includes('_rsc=') || request.headers.get('RSC')) {
    return NextResponse.next();
  }
  
  // Skip middleware for Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes (/api)
    // - _next static files
    // - _next image optimization files
    // - favicon, robots, sitemap
    // - files with extensions (e.g. .jpg, .png)
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
