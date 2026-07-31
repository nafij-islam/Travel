'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_TRIPS, MOCK_USERS } from '@/lib/data/mockData';
import { TripCard } from '@/components/trips/TripCard';
import {
  LayoutDashboard,
  PlusCircle,
  Eye,
  Bookmark,
  Copy,
  Award,
  Users,
  MessageSquare,
  Settings
} from 'lucide-react';

export default function UserDashboardPage() {
  const { t } = useTranslation();
  const user = MOCK_USERS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Top Banner */}
      <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.fullName} className="w-16 h-16 rounded-full border-2 border-teal-400 object-cover" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user.fullName}!</h1>
            <p className="text-xs text-slate-300">@{user.username} · {user.districtsVisitedCount} Districts Visited</p>
          </div>
        </div>

        <Link
          href="/trips/create"
          className="px-6 py-3 rounded-2xl bg-brand-gradient text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('nav.shareTrip')}</span>
        </Link>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
            <Eye className="w-4 h-4 text-teal-600" /> Total Views
          </div>
          <div className="text-2xl font-black text-navy-800">4,280</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
            <Bookmark className="w-4 h-4 text-teal-600" /> Times Saved
          </div>
          <div className="text-2xl font-black text-navy-800">840</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
            <Copy className="w-4 h-4 text-teal-600" /> Times Copied
          </div>
          <div className="text-2xl font-black text-navy-800">320</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
            <Award className="w-4 h-4 text-teal-600" /> Helpful Votes
          </div>
          <div className="text-2xl font-black text-teal-600">{user.helpfulVotesCount}</div>
        </div>
      </div>

      {/* My Published Trips */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-navy-800">My Published Trips</h2>
          <Link href="/trips/create" className="text-xs font-bold text-teal-600 hover:underline">
            + Share New Trip
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TRIPS.slice(0, 2).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
