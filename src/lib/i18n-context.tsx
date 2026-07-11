'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Locale, translations, TranslationKey, LOCALES } from '@/lib/i18n';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default to browser language or 'zh'
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith('ja')) return 'ja';
      if (lang.startsWith('en')) return 'en';
    }
    return 'zh';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l === 'zh' ? 'zh-CN' : l;
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const dict = translations[locale] ?? translations.zh;
      let str = (dict as Record<string, string>)[key] ?? (translations.zh as Record<string, string>)[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export { LOCALES };
