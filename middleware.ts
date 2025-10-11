import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const i18nMiddleware = createMiddleware({
  locales: ["en", "es", "fr", "de", "ar", "pt-BR", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  // Bypass i18n middleware for RSC prefetch requests to avoid 404s
  // Next.js uses ?_rsc= for segment prefetch; also respect RSC header when present
  const url = request.nextUrl;
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") {
    return NextResponse.next();
  }
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
