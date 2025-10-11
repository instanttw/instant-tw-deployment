'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function DebugTranslations() {
  const locale = useLocale();
  const t = useTranslations('home');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h2>🐛 Translation Debug Info</h2>
      <p><strong>Current Locale:</strong> {locale}</p>
      <p><strong>Home Title (EN):</strong> "Premium & Custom WordPress Plugins Built for Success"</p>
      <p><strong>Home Title (ES):</strong> "Plugins WordPress Premium y Personalizados Construidos para el Éxito"</p>
      <p><strong>Actual Rendered:</strong> "{t('title')}"</p>
      <p><strong>Status:</strong> {t('title').includes('Premium') ? '❌ English' : '✅ Translated'}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Header Tests:</h3>
        <p><strong>Pricing (should be "Precios" in Spanish):</strong> {useTranslations('header')('pricing')}</p>
        <p><strong>Plugins:</strong> {useTranslations('header')('plugins')}</p>
      </div>
    </div>
  );
}