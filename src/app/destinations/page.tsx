'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { getPopularDestinations } from '@/lib/supabase/supabase';
import { Destination } from '@/lib/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MapPin, ArrowRight, Compass } from 'lucide-react';

export default function DestinationsPage() {
  const { t, locale } = useTranslation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const liveDests = await getPopularDestinations();
        setDestinations(liveDests);
      } catch (err) {
        console.error('Error loading destinations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestinations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-heading">
          {t('nav.destinations')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          Explore real travel guides and average trip costs automatically computed from community reports across Bangladesh.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading popular destinations...</div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={dest.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800'}
                  alt={dest.nameEn}
                  fill
                  preset="destinationCard"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase text-brand-cyan">{dest.division} Division</span>
                  <h3 className="text-xl font-black font-heading">
                    {locale === 'bn' ? dest.nameBn : dest.nameEn}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                  <div>
                    <div className="font-black text-slate-900 dark:text-white">{dest.tripCount}</div>
                    <div className="text-[10px] text-slate-400">Trips</div>
                  </div>
                  <div>
                    <div className="font-black text-brand-cyan">৳{dest.avgCostPerPerson.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Avg / person</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-brand-purple">
                  <span>View Community Trips</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">No Destinations Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Destinations will automatically populate here as community members publish trip reports across Bangladesh.
          </p>
        </div>
      )}
    </div>
  );
}
