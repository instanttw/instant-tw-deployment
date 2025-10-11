import type { Metadata } from "next";
import { getMessages, getLocale } from "next-intl/server";
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
import { IntlProvider } from "@/components/i18n/intl-provider";
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
  let locale = 'en';
  try {
    locale = await getLocale();
  } catch (e) {
    console.error('[i18n:getLocale]', e);
    locale = 'en';
  }
  let messages: any;
  try {
    messages = await getMessages();
  } catch (e) {
    console.error('[i18n:getMessages]', e);
    try {
      messages = (await import('../messages/en.json')).default;
    } catch (e2) {
      console.error('[i18n:fallbackMessagesFailed]', e2);
      messages = {};
    }
  }
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
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
                <IntlProvider messages={messages} locale={locale}>
                  <Header />
                  <main>{children}</main>
                  <Footer />
                  <FloatingChatbot />
                  <CookieBanner />
                  <CartSidebar />
                  <Toaster position="top-right" richColors />
                </IntlProvider>
              </CurrencyProvider>
            </CookieConsentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
