"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { CurrencyProvider } from "@/lib/currency-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CartProvider } from "@/lib/cart-context";

interface ClientProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
}

export function ClientProviders({ children, locale, messages }: ClientProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <CookieConsentProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </CookieConsentProvider>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
