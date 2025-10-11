import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Support the same locales as configured in the root i18n.ts
  const supported = ['en', 'es', 'fr', 'de', 'ar', 'pt', 'it'] as const;
  const chosen = (locale && supported.includes(locale as any)) ? locale : 'en';
  try {
    const messages = (await import(`../messages/${chosen}.json`)).default;
    return {locale: chosen, messages};
  } catch {
    const messages = (await import(`../messages/en.json`)).default;
    return {locale: 'en', messages};
  }
});
