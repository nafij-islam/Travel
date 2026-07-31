'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_TRIPS } from '@/lib/data/mockData';
import { TripCard } from '@/components/trips/TripCard';
import { Wallet, Search, Filter } from 'lucide-react';

export default function BudgetTripsPage() {
  const { t } = useTranslation();
  const [maxBudget, setMaxBudget] = useState(5000);

  const filteredTrips = MOCK_TRIPS.filter((t) => t.costPerPerson <= maxBudget);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black">
          {t('nav.searchByBudget')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Filter authentic travel itineraries based on exact reported cost per person.
        </p>

        {/* Budget Slider */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/15 max-w-xl space-y-3">
          <div className="flex justify-between items-center text-sm font-bold">
            <span>Selected Max Cost per Person:</span>
            <span className="text-2xl font-black text-amber-300">৳{maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="25000"
            step="1000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-teal-400"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy-800">
          Showing Trips Under ৳{maxBudget.toLocaleString()} per person ({filteredTrips.length} Results)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
