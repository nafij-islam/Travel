'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/lib/types';
import enTranslations from './en.json';
import bnTranslations from './bn.json';

type Translations = typeof enTranslations;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Check localStorage or URL parameter
    const stored = localStorage.getItem('jatrio_locale') as Locale;
    if (stored === 'en' || stored === 'bn') {
      setLocaleState(stored);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as Locale;
      if (langParam === 'en' || langParam === 'bn') {
        setLocaleState(langParam);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('jatrio_locale', newLocale);
  };

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const dict: any = locale === 'bn' ? bnTranslations : enTranslations;
    const fallbackDict: any = enTranslations;

    const keys = keyPath.split('.');
    let current: any = dict;
    let fallbackCurrent: any = fallbackDict;

    for (const key of keys) {
      current = current?.[key];
      fallbackCurrent = fallbackCurrent?.[key];
    }

    let text = typeof current === 'string' ? current : typeof fallbackCurrent === 'string' ? fallbackCurrent : keyPath;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(`{${paramKey}}`, String(paramVal));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <div className={locale === 'bn' ? 'font-sans' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
