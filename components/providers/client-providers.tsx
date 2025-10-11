"use client";

import { ReactNode } from "react";
import { CurrencyProvider } from "@/lib/currency-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CartProvider } from "@/lib/cart-context";

interface ClientProvidersProps {
  children: ReactNode;
  locale?: string; // Optional for now
  messages?: Record<string, any>; // Optional for now
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      <CookieConsentProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </CookieConsentProvider>
    </CartProvider>
  );
}
