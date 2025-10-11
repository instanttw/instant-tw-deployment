"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const currencyFormats: Record<Currency, Intl.NumberFormatOptions> = {
  USD: { style: "currency", currency: "USD" },
  EUR: { style: "currency", currency: "EUR" },
  GBP: { style: "currency", currency: "GBP" },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Try to read from data attribute set by beforeInteractive script
    if (typeof window !== "undefined") {
      const saved = document.documentElement.getAttribute("data-currency");
      if (saved && (saved === "USD" || saved === "EUR" || saved === "GBP")) {
        return saved as Currency;
      }
    }
    return "USD";
  });

  useEffect(() => {
    // Sync with localStorage in case it changed
    const saved = localStorage.getItem("preferred-currency");
    if (saved && (saved === "USD" || saved === "EUR" || saved === "GBP")) {
      if (saved !== currency) {
        setCurrencyState(saved as Currency);
      }
    }
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferred-currency", newCurrency);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", currencyFormats[currency]).format(price);
  };

  const symbol = currencySymbols[currency];

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
