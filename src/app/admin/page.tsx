'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import { MOCK_DESTINATIONS, MOCK_TRIPS } from '@/lib/data/mockData';
import {
  ShieldAlert,
  Merge,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Globe,
  BarChart2,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'duplicates'>('analytics');
  const [duplicateDestinations, setDuplicateDestinations] = useState([
    { id: 'dup-1', primaryName: 'Sajek Valley', duplicateName: 'Sajek Vally', district: 'Rangamati', tripCount: 48 },
    { id: 'dup-2', primaryName: 'Cox\'s Bazar', duplicateName: 'Coxsbazar', district: 'Cox\'s Bazar', tripCount: 120 }
  ]);

  const [pendingTrips, setPendingTrips] = useState([
    { id: 'p-1', title: 'Bandarban Nilgiri 2 Days Trip Report', author: 'Tanvir Hossain', status: 'Pending Review' }
  ]);

  const handleMerge = (id: string) => {
    setDuplicateDestinations(duplicateDestinations.filter((d) => d.id !== id));
    alert('Duplicate destination successfully merged into primary record!');
  };

  const handleApproveTrip = (id: string) => {
    setPendingTrips(pendingTrips.filter((p) => p.id !== id));
    alert('Trip approved and published live on Ghurabo!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Control Center Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-brand-purple text-white font-bold text-[10px] uppercase">
            Platform Administration
          </span>
          <h1 className="text-3xl font-black mt-2 font-heading">Ghurabo Control Center</h1>
          <p className="text-xs text-slate-300">Analytics overview, content moderation, duplicate merger, & technical SEO governance.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/seo"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Globe className="w-4 h-4 text-brand-cyan" />
            <span>SEO Governance</span>
          </Link>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'moderation'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Content Moderation ({pendingTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'duplicates'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Merge className="w-4 h-4" />
          <span>Duplicate Merger ({duplicateDestinations.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && <AnalyticsOverview />}

      {/* TAB 2: CONTENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-heading">
            <ShieldAlert className="w-5 h-5 text-brand-purple" />
            <span>Pending Content Moderation Queue</span>
          </h3>

          {pendingTrips.length > 0 ? (
            <div className="space-y-3">
              {pendingTrips.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs gap-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm font-heading">{p.title}</div>
                    <div className="text-slate-500">Submitted by @{p.author}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveTrip(p.id)}
                      className="px-4 py-2 rounded-lg bg-brand-purple text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">No pending items in moderation queue.</div>
          )}
        </div>
      )}

      {/* TAB 3: DUPLICATE DESTINATIONS MERGER */}
      {activeTab === 'duplicates' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-heading">
            <Merge className="w-5 h-5 text-brand-purple" />
            <span>Duplicate Destination Auto-Detection & Merger</span>
          </h3>
          <p className="text-xs text-slate-500">
            Destinations submitted by users with typo variations or alternate spellings are flagged below. Safe merge preserves existing public trip URLs.
          </p>

          <div className="space-y-3">
            {duplicateDestinations.map((dup) => (
              <div key={dup.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Primary: <span className="text-brand-purple">{dup.primaryName}</span> ↔ Flagged Duplicate: <span className="text-rose-600 font-bold">{dup.duplicateName}</span>
                  </div>
                  <div className="text-slate-500">{dup.district} District · {dup.tripCount} Linked Trips</div>
                </div>
                <button
                  onClick={() => handleMerge(dup.id)}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Merge className="w-4 h-4 text-brand-cyan" /> Merge Safely
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
