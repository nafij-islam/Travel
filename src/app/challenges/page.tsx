'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_ACHIEVEMENTS } from '@/lib/data/mockData';
import { Award } from 'lucide-react';

export default function ChallengesPage() {
  const { t, locale } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black">{t('nav.challenges')} & Badges</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Earn community badges by sharing authentic budget reports, answering traveler questions, and exploring Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {MOCK_ACHIEVEMENTS.map((ach) => (
          <div
            key={ach.id}
            className={`p-6 rounded-3xl border space-y-4 shadow-sm ${
              ach.isUnlocked ? 'bg-white border-brand-purple/40 ring-2 ring-brand-purple/10' : 'bg-slate-50 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                ach.isUnlocked ? 'bg-brand-purple text-white shadow-md' : 'bg-slate-200 text-slate-500'
              }`}>
                <Award className="w-6 h-6 text-brand-cyan" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy-900 text-base">
                    {locale === 'bn' ? ach.titleBn : ach.titleEn}
                  </h3>
                  {ach.isUnlocked && (
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-green/20 text-slate-900 border border-brand-green/40 text-[10px] font-bold">
                      Unlocked
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-semibold">{ach.category}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {locale === 'bn' ? ach.descriptionBn : ach.descriptionEn}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Progress</span>
                <span>{ach.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-brand-purple rounded-full transition-all duration-500"
                  style={{ width: `${ach.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
