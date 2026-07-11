'use client';

import { useI18n, LOCALES } from '@/lib/i18n-context';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card">
      {LOCALES.map((l) => (
        <button
          key={l.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-250 ${
            locale === l.id ? 'tab-active' : 'option-chip border-transparent'
          }`}
          onClick={() => setLocale(l.id)}
        >
          <span className="text-sm">{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
