'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { TripCard } from '@/components/trips/TripCard';
import { MOCK_TRIPS, MOCK_TRAVEL_STYLES, MOCK_DESTINATIONS } from '@/lib/data/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  X
} from 'lucide-react';

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

  // Filter Logic
  const filteredTrips = useMemo(() => {
    return MOCK_TRIPS.filter((trip) => {
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
      if (sortBy === 'lowestCost') return a.costPerPerson - b.costPerPerson;
      if (sortBy === 'highestCost') return b.costPerPerson - a.costPerPerson;
      if (sortBy === 'mostSaved') return b.saveCount - a.saveCount;
      if (sortBy === 'mostCopied') return b.copyCount - a.copyCount;
      return b.viewCount - a.viewCount;
    });
  }, [searchTerm, selectedDestination, selectedStartCity, selectedStyle, maxCostFilter, contentLangFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDestination('');
    setSelectedStartCity('');
    setSelectedStyle('');
    setMaxCostFilter('');
    setContentLangFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm space-y-2 relative overflow-hidden">
        <h1 className="text-2xl sm:text-4xl font-black font-heading">
          {t('nav.exploreTrips')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Browse authentic trip itineraries, exact cost breakdowns, hotel experiences, and route details shared by travelers.
        </p>
      </div>

      {/* Main Grid: Filters Sidebar + Trip Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm font-heading">
                <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
                <span>{t('common.filter')}</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-brand-purple hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
              >
                <option value="">All Destinations</option>
                {MOCK_DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.slug}>{d.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Starting City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Starting City</label>
              <input
                type="text"
                value={selectedStartCity}
                onChange={(e) => setSelectedStartCity(e.target.value)}
                placeholder="e.g. Dhaka, Chittagong"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Travel Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Travel Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
              >
                <option value="">All Styles</option>
                {MOCK_TRAVEL_STYLES.map((s) => (
                  <option key={s.id} value={s.slug}>{s.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Max Cost per Person */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Max Cost per Person (৳{maxCostFilter || 'Any'})
              </label>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={maxCostFilter || 30000}
                onChange={(e) => setMaxCostFilter(e.target.value)}
                className="w-full accent-brand-purple"
              />
            </div>

            {/* Content Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Content Language</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContentLangFilter('all')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                    contentLangFilter === 'all' ? 'bg-slate-100 border-brand-purple text-brand-purple' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setContentLangFilter('en')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                    contentLangFilter === 'en' ? 'bg-slate-100 border-brand-purple text-brand-purple' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setContentLangFilter('bn')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                    contentLangFilter === 'bn' ? 'bg-slate-100 border-brand-purple text-brand-purple' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Trips Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Search Bar & Sort Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keyword, route, or destination..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 touch-target"
              >
                <Filter className="w-4 h-4 text-brand-purple" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="lowestCost">Sort: Lowest Cost</option>
                <option value="highestCost">Sort: Highest Cost</option>
                <option value="mostSaved">Sort: Most Saved</option>
                <option value="mostCopied">Sort: Most Copied</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">No Trips Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published trips match your exact filters. Try clearing your search parameters.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-sm hover:bg-brand-purple/90 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl p-6 overflow-y-auto z-50 space-y-6 animate-in slide-in-from-bottom pb-safe">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-heading">Filter Trips</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 touch-target">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Destination</label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              >
                <option value="">All Destinations</option>
                {MOCK_DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.slug}>{d.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Starting City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Starting City</label>
              <input
                type="text"
                value={selectedStartCity}
                onChange={(e) => setSelectedStartCity(e.target.value)}
                placeholder="e.g. Dhaka, Chittagong"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              />
            </div>

            {/* Travel Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Travel Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              >
                <option value="">All Styles</option>
                {MOCK_TRAVEL_STYLES.map((s) => (
                  <option key={s.id} value={s.slug}>{s.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExploreTripsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-bold text-slate-400">Loading trips...</div>}>
      <ExploreTripsContent />
    </Suspense>
  );
}
