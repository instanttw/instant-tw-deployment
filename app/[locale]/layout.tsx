import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { ClientProviders } from '@/components/providers/client-providers';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
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
    <ClientProviders locale={locale} messages={messages}>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingChatbot />
      <CookieBanner />
      <CartSidebar />
    </ClientProviders>
  );
}
