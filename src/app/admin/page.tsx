'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import {
  ShieldAlert,
  Merge,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Globe,
  BarChart2,
  ArrowRight,
  Inbox
} from 'lucide-react';

import { ImageModeration } from '@/components/admin/ImageModeration';
import { mergeDuplicateDestinations, supabase } from '@/lib/supabase/supabase';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'photos' | 'duplicates'>('analytics');
  
  // Real Supabase Queues
  const [pendingTrips, setPendingTrips] = useState<any[]>([]);
  const [duplicateDestinations, setDuplicateDestinations] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

  useEffect(() => {
    async function loadAdminQueues() {
      if (!supabase) {
        setLoadingPending(false);
        return;
      }
      try {
        // Fetch Pending Trips awaiting moderation
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select(`*, author:profiles(*)`)
          .eq('publication_status', 'pending_review')
          .order('created_at', { ascending: false });

        if (tripsError) {
          console.error('Error querying pending trips from Supabase:', tripsError);
        } else if (tripsData) {
          setPendingTrips(
            tripsData.map((t: any) => ({
              id: t.id,
              title: t.title,
              author: t.author?.full_name || 'Traveler',
              status: 'Pending Review',
              createdAt: t.created_at
            }))
          );
        }
      } catch (err) {
        console.error('Error loading admin moderation queues:', err);
      } finally {
        setLoadingPending(false);
      }
    }
    loadAdminQueues();
  }, []);

  const handleMerge = async (id: string, primaryName: string) => {
    await mergeDuplicateDestinations(primaryName, id);
    setDuplicateDestinations(duplicateDestinations.filter((d) => d.id !== id));
    alert('Duplicate destination merged in Supabase!');
  };

  const handleApproveTrip = async (id: string) => {
    if (supabase) {
      await supabase
        .from('trips')
        .update({ publication_status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);
    }
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
          <p className="text-xs text-slate-300">Analytics overview, content moderation, image moderation, duplicate merger, & technical SEO governance.</p>
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
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'photos'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-brand-purple" />
          <span>Photo Moderation Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'moderation'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trip Moderation ({pendingTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'duplicates'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Merge className="w-4 h-4" />
          <span>Duplicate Merger ({duplicateDestinations.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === 'analytics' && <AnalyticsOverview />}

      {/* TAB CONTENT: PHOTO MODERATION */}
      {activeTab === 'photos' && <ImageModeration />}

      {/* TAB CONTENT: TRIP MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-purple" />
            <span>Pending Content Moderation Queue</span>
          </h2>

          {loadingPending ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading moderation queue...</div>
          ) : pendingTrips.length > 0 ? (
            <div className="space-y-3">
              {pendingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">{trip.title}</div>
                    <div className="text-xs text-slate-500">Submitted by @{trip.author}</div>
                  </div>

                  <button
                    onClick={() => handleApproveTrip(trip.id)}
                    className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm hover:bg-brand-purple/90 shrink-0 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-white">No Trips Awaiting Moderation</div>
              <p>All user trip reports have been reviewed and published.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DUPLICATE DESTINATIONS MERGER */}
      {activeTab === 'duplicates' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Merge className="w-5 h-5 text-brand-purple" />
            <span>Duplicate Destination Auto-Detection & Merger</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Destinations submitted by users with typo variations or alternate spellings are flagged below. Safe merge preserves existing public trip URLs.
          </p>

          {duplicateDestinations.length > 0 ? (
            <div className="space-y-3">
              {duplicateDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Primary: <span className="text-brand-purple">{dest.primaryName}</span> ↔ Flagged Duplicate: <span className="text-rose-600">{dest.duplicateName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {dest.district} District · {dest.tripCount} Linked Trips
                    </div>
                  </div>

                  <button
                    onClick={() => handleMerge(dest.id, dest.primaryName)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-sm hover:bg-slate-800 shrink-0"
                  >
                    Merge Safely
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-white">No Duplicate Destinations Flagged</div>
              <p>All user destination entries are clean and merged.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
