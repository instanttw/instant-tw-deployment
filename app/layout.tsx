import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { CurrencyProvider } from "@/lib/currency-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import { OrganizationSchema, WebsiteSchema } from "@/components/seo";
import enMessages from "@/messages/en.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wp.instant.tw"),
  title: {
    default: "Instant - Premium WordPress Plugins & Services",
    template: "%s | Instant WordPress Plugins",
  },
  description: "Transform your WordPress site with our collection of premium plugins and professional services. Get security, hosting, optimization, and 8+ powerful plugins with exceptional support.",
  keywords: [
    "WordPress plugins",
    "premium WordPress plugins",
    "WordPress themes",
    "WordPress security",
    "WordPress hosting",
    "WordPress optimization",
    "WordPress SEO",
    "WordPress maintenance",
    "WP plugins",
    "WordPress vulnerability scanner",
    "WordPress speed optimization",
    "WordPress malware protection",
  ],
  authors: [{ name: "Instant", url: "https://wp.instant.tw" }],
  creator: "Instant",
  publisher: "Instant",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wp.instant.tw",
    siteName: "Instant - Premium WordPress Plugins & Services",
    title: "Instant - Premium WordPress Plugins & Services",
    description: "Transform your WordPress site with our collection of premium plugins and professional services.",
    images: [
      {
        url: "https://wp.instant.tw/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instant WordPress Plugins & Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@instantplugins",
    creator: "@instantplugins",
    title: "Instant - Premium WordPress Plugins & Services",
    description: "Transform your WordPress site with our collection of premium plugins and professional services.",
    images: ["https://wp.instant.tw/og-image.png"],
  },
  alternates: {
    canonical: "https://wp.instant.tw",
    languages: {
      'en': 'https://wp.instant.tw',
      'es': 'https://wp.instant.tw/es',
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Provide default en locale for Header/Footer components
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="currency-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const currency = localStorage.getItem('preferred-currency') || 'USD';
                document.documentElement.setAttribute('data-currency', currency);
              } catch (e) {}
            `,
          }}
        />
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <AuthProvider>
            <CartProvider>
              <CookieConsentProvider>
                <CurrencyProvider>
                  <Header />
                  <main>{children}</main>
                  <Footer />
                  <FloatingChatbot />
                  <CookieBanner />
                  <CartSidebar />
                  <Toaster position="top-right" richColors />
                </CurrencyProvider>
              </CookieConsentProvider>
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
