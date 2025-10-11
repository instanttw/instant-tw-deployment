import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { CurrencyProvider } from "@/lib/currency-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <CookieConsentProvider>
          <CurrencyProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingChatbot />
            <CookieBanner />
            <CartSidebar />
          </CurrencyProvider>
        </CookieConsentProvider>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
