'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_DESTINATIONS } from '@/lib/data/mockData';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MapPin, ArrowRight } from 'lucide-react';

export default function DestinationsPage() {
  const { t, locale } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black">
          {t('nav.destinations')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Aggregated community travel data automatically computed from published trips across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DESTINATIONS.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <ImageWithFallback
                src={dest.coverImage}
                alt={dest.nameEn}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase text-teal-400">{dest.division} Division</span>
                <h3 className="text-xl font-black">
                  {locale === 'bn' ? dest.nameBn : dest.nameEn}
                </h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <div className="font-black text-navy-800">{dest.tripCount}</div>
                  <div className="text-[10px] text-slate-400">Trips</div>
                </div>
                <div>
                  <div className="font-black text-teal-600">৳{dest.avgCostPerPerson.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">Avg / person</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-teal-600">
                <span>View Community Trips</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
