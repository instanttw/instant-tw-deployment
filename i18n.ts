import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'fr', 'de', 'ar', 'pt-BR', 'it'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
  'pt-BR': 'Português (Brasil)',
  it: 'Italiano',
};

export default getRequestConfig(async ({ locale }) => {
  const chosen = (locale && locales.includes(locale as Locale)) ? (locale as Locale) : 'en';
  let messages: Record<string, any>;
  try {
    messages = (await import(`./messages/${chosen}.json`)).default;
  } catch {
    messages = (await import(`./messages/en.json`)).default;
  }
  return { locale: chosen, messages };
});
