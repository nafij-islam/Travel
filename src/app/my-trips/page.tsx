'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Compass, MapPin, Eye, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserTrips() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('trips')
          .select('*')
          .eq('author_id', session.user.id)
          .order('created_at', { ascending: false });

        if (data) setTrips(data);
      }
      setLoading(false);
    }

    loadUserTrips();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-brand-purple" />
            <span>My Travel Experiences</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your published travel stories, draft itineraries, and cost breakdowns.
          </p>
        </div>

        <Link
          href="/trips/create"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-brand-cyan" />
          <span>Share New Trip</span>
        </Link>
      </div>

      {/* Trips Stream */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading your travel reports...</div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between p-5 space-y-4 hover:border-brand-purple/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      trip.publication_status === 'published'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {trip.publication_status === 'published' ? 'Published' : 'Pending Review'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{trip.duration_days} Days</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading line-clamp-2">
                  {trip.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                  <span>{trip.destination_slug || 'Bangladesh'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-black text-brand-purple">৳{trip.cost_per_person?.toLocaleString()}/person</span>

                <Link
                  href={`/trips/${trip.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                >
                  View Trip
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Travel Reports Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You haven't shared any travel experiences or cost breakdowns yet. Share your first trip report with travelers across Bangladesh!
          </p>
          <Link
            href="/trips/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-brand-cyan" />
            <span>Share Your First Trip</span>
          </Link>
        </div>
      )}
    </div>
  );
}
