import { NextRequest, NextResponse } from "next/server";
// import createMiddleware from "next-intl/middleware"; // DISABLED - causing site-wide 404s

// EMERGENCY FIX: Disable all middleware to restore site functionality
// The next-intl implementation was causing ALL routes to return 404
// Will re-implement i18n properly after site is restored

export default function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED: All middleware bypassed to fix 404 errors
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
