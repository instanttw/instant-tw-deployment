import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

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

  // i18n provider is in root layout
  return <>{children}</>;
}
