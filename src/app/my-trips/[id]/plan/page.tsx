'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_TRIPS } from '@/lib/data/mockData';
import { TripCard } from '@/components/trips/TripCard';
import { Copy, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function MyTripPlanPage() {
  const params = useParams();
  const id = params?.id as string;
  const trip = MOCK_TRIPS.find((t) => t.id === id) || MOCK_TRIPS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href="/dashboard" className="text-xs font-semibold text-brand-purple flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Saved to My Trips
        </span>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-cyan/30 text-brand-purple text-xs font-bold">
          <Copy className="w-3.5 h-3.5" />
          <span>Cloned Trip Itinerary Plan</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          {trip.title}
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          This trip has been copied into your personal travel planner. You can customize your estimated expenses, dates, and accommodation bookings below.
        </p>

        <div className="pt-4">
          <TripCard trip={trip} />
        </div>
      </div>
    </div>
  );
}
