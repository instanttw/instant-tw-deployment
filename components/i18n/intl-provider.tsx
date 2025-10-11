"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";

type Props = {
  messages: Record<string, unknown>;
  locale?: string;
  children: React.ReactNode;
};

export function IntlProvider({ messages, locale, children }: Props) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
