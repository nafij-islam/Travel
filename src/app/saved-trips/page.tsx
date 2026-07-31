'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Compass, MapPin, PlusCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_TRIPS } from '@/lib/data/mockData';

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedTrips() {
      const supabase = createClient();
      if (!supabase) {
        setSavedTrips(MOCK_TRIPS.slice(0, 2));
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('trip_saves')
          .select('trip_id, trips(*)')
          .eq('user_id', session.user.id);

        if (data && data.length > 0) {
          const list = data.map((item: any) => item.trips).filter(Boolean);
          setSavedTrips(list);
        } else {
          setSavedTrips(MOCK_TRIPS.slice(0, 2));
        }
      } else {
        setSavedTrips(MOCK_TRIPS.slice(0, 2));
      }
      setLoading(false);
    }

    loadSavedTrips();
  }, []);

  const handleRemoveSave = (tripId: string) => {
    setSavedTrips(savedTrips.filter((t) => t.id !== tripId));
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-brand-purple" />
          <span>Saved Trips & Bookmarks</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Quickly access your bookmarked travel plans, cost estimates, and favorite itineraries.
        </p>
      </div>

      {/* Saved Trips Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading saved itineraries...</div>
      ) : savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between p-5 space-y-4 hover:border-brand-purple/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold">
                    {trip.durationDays || trip.duration_days || 3} Days Trip
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSave(trip.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading line-clamp-2">
                  {trip.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                  <span>{trip.destinationSlug || trip.destination_slug || 'Bangladesh'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-black text-brand-purple">
                  ৳{(trip.costPerPerson || trip.cost_per_person || 5200).toLocaleString()}/person
                </span>

                <Link
                  href={`/trips/${trip.slug || trip.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple/90 transition-colors"
                >
                  View Itinerary
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Saved Trips Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Bookmark interesting trip reports while exploring to save them for your next Bangladesh vacation!
          </p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
          >
            <Compass className="w-4 h-4 text-brand-cyan" />
            <span>Explore All Trips</span>
          </Link>
        </div>
      )}
    </div>
  );
}
