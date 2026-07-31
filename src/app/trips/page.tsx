'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { TripCard } from '@/components/trips/TripCard';
import { MOCK_TRAVEL_STYLES } from '@/lib/data/mockData';
import { getPublishedTrips } from '@/lib/supabase/supabase';
import { Trip } from '@/lib/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Compass,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

function ExploreTripsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Filter States initialized from URL params
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destination') || '');
  const [selectedStartCity, setSelectedStartCity] = useState(searchParams.get('startingCity') || '');
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || '');
  const [maxCostFilter, setMaxCostFilter] = useState(searchParams.get('maxBudget') || '');
  const [contentLangFilter, setContentLangFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Live Supabase Published Trips
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const liveTrips = await getPublishedTrips();
        setTrips(liveTrips);
      } catch (err) {
        console.error('Error loading published trips:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  // Filter Logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = trip.title.toLowerCase().includes(term);
        const matchesDest = trip.destination.nameEn.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDest) return false;
      }

      if (selectedDestination && !trip.destination.slug.toLowerCase().includes(selectedDestination.toLowerCase()) && !trip.destination.nameEn.toLowerCase().includes(selectedDestination.toLowerCase())) {
        return false;
      }

      if (selectedStartCity && !trip.startLocationText.toLowerCase().includes(selectedStartCity.toLowerCase())) {
        return false;
      }

      if (selectedStyle && trip.travelStyle.slug !== selectedStyle) {
        return false;
      }

      if (maxCostFilter && trip.costPerPerson > parseInt(maxCostFilter, 10)) {
        return false;
      }

      if (contentLangFilter !== 'all' && trip.contentLanguage !== contentLangFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'cost_asc') return a.costPerPerson - b.costPerPerson;
      if (sortBy === 'cost_desc') return b.costPerPerson - a.costPerPerson;
      if (sortBy === 'duration') return b.durationDays - a.durationDays;
      if (sortBy === 'recent') return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      return (b.saveCount || 0) - (a.saveCount || 0); // 'popular'
    });
  }, [trips, searchTerm, selectedDestination, selectedStartCity, selectedStyle, maxCostFilter, contentLangFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDestination('');
    setSelectedStartCity('');
    setSelectedStyle('');
    setMaxCostFilter('');
    setContentLangFilter('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold border border-brand-purple/20">
          <Compass className="w-3 h-3" />
          <span>Real Community Trips</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading">
          Explore All <span className="text-brand-purple">Travel Reports</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Filter authentic travel itineraries across Bangladesh by destination, starting city, transport, and budget per person.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
            />
          </div>

          {/* Destination */}
          <input
            type="text"
            placeholder="Destination (e.g. Sajek)"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
          />

          {/* Travel Style */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
          >
            <option value="">All Travel Styles</option>
            {MOCK_TRAVEL_STYLES.map((style) => (
              <option key={style.id} value={style.slug}>
                {style.nameEn}
              </option>
            ))}
          </select>

          {/* Max Budget */}
          <input
            type="number"
            placeholder="Max Budget (৳)"
            value={maxCostFilter}
            onChange={(e) => setMaxCostFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
          />

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-purple"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="cost_asc">Cost: Low to High</option>
            <option value="cost_desc">Cost: High to Low</option>
            <option value="duration">Duration: Longest</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTrips.length}</span> published trip reports
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 hover:text-brand-purple transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading published trip reports...</div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        /* Professional Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Trips Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No published trip reports match your current search filters. Try clearing your search parameters or be the first traveler to post a trip for this location!
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Reset Filters
            </button>
            <Link
              href="/trips/create"
              className="px-6 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm hover:bg-brand-purple/90 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-brand-cyan" />
              <span>Share Trip Report</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExploreTripsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-xs text-slate-400">Loading travel reports...</div>}>
      <ExploreTripsContent />
    </Suspense>
  );
}
