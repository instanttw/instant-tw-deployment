import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
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
  title: "Instant - Premium WordPress Plugins",
  description: "Transform your WordPress site with our collection of premium plugins. Professional features, exceptional support, and regular updates guaranteed.",
  keywords: ["WordPress", "plugins", "premium plugins", "WooCommerce", "SEO", "security", "Instant"],
  authors: [{ name: "Instant" }],
  openGraph: {
    title: "Instant - Premium WordPress Plugins",
    description: "Transform your WordPress site with our collection of premium plugins.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from next-intl
  const locale = await getLocale();
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
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
      </body>
    </html>
  );
}
