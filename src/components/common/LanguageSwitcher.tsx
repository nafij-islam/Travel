'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          locale === 'en'
            ? 'bg-brand-purple text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>EN</span>
      </button>
      <button
        onClick={() => setLocale('bn')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          locale === 'bn'
            ? 'bg-brand-purple text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <span>বাংলা</span>
      </button>
    </div>
  );
};
