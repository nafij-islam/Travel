'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import { ImageModeration } from '@/components/admin/ImageModeration';
import {
  approveTripInSupabase,
  rejectTripInSupabase,
  softDeleteTripInSupabase,
  restoreTripInSupabase,
  permanentlyDeleteTripInSupabase,
  mergeDuplicateDestinations,
  supabase
} from '@/lib/supabase/supabase';
import {
  ShieldAlert,
  Merge,
  FileText,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
  Eye,
  Globe,
  BarChart2,
  Inbox,
  X,
  AlertTriangle,
  MapPin,
  Wallet,
  Bus,
  Home,
  User,
  Calendar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'photos' | 'duplicates' | 'trash'>('moderation');
  const [subStatusTab, setSubStatusTab] = useState<'pending_review' | 'published' | 'rejected'>('pending_review');

  // Real Supabase Queues & Counts
  const [tripsList, setTripsList] = useState<any[]>([]);
  const [trashList, setTrashList] = useState<any[]>([]);
  const [duplicateDestinations, setDuplicateDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState<string>('');

  // Modals State
  const [viewingTrip, setViewingTrip] = useState<any | null>(null);
  const [rejectingTrip, setRejectingTrip] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [deletingTrip, setDeletingTrip] = useState<any | null>(null);
  const [hardDeletingTrip, setHardDeletingTrip] = useState<any | null>(null);

  const fetchAdminTrips = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentAdminId(user.id);

      // 1. Fetch active trips (is_deleted = false)
      const { data: tripsData, error: tripsErr } = await supabase
        .from('trips')
        .select(`
          *,
          author:profiles(*),
          destination:destinations(*),
          trip_transport_segments(*),
          trip_accommodations(*),
          trip_expenses(*),
          trip_days(*),
          trip_images(*)
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (tripsErr) console.error('Error fetching admin trips:', tripsErr);
      if (tripsData) setTripsList(tripsData);

      // 2. Fetch soft-deleted trash trips (is_deleted = true)
      const { data: trashData } = await supabase
        .from('trips')
        .select(`*, author:profiles(*)`)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false });

      if (trashData) setTrashList(trashData);
    } catch (err) {
      console.error('Error loading admin queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminTrips();
  }, []);

  // Filter active trips by sub-status tab
  const displayedTrips = tripsList.filter((t) => t.publication_status === subStatusTab);

  // Counts
  const pendingCount = tripsList.filter((t) => t.publication_status === 'pending_review').length;
  const publishedCount = tripsList.filter((t) => t.publication_status === 'published').length;
  const rejectedCount = tripsList.filter((t) => t.publication_status === 'rejected').length;

  // Actions
  const handleApprove = async (trip: any) => {
    const success = await approveTripInSupabase(trip.id, currentAdminId, trip.author_id, trip.title);
    if (success) {
      alert(`Trip "${trip.title}" approved and published live on Ghurabo!`);
      fetchAdminTrips();
    } else {
      alert('Error approving trip. Please check Supabase permissions.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingTrip || !rejectionReasonInput.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    const success = await rejectTripInSupabase(
      rejectingTrip.id,
      currentAdminId,
      rejectingTrip.author_id,
      rejectingTrip.title,
      rejectionReasonInput.trim()
    );
    if (success) {
      alert(`Trip "${rejectingTrip.title}" has been rejected. Traveler notified with reason.`);
      setRejectingTrip(null);
      setRejectionReasonInput('');
      fetchAdminTrips();
    } else {
      alert('Failed to reject trip.');
    }
  };

  const handleConfirmSoftDelete = async () => {
    if (!deletingTrip) return;
    const success = await softDeleteTripInSupabase(deletingTrip.id, currentAdminId, deletingTrip.title);
    if (success) {
      alert(`Trip "${deletingTrip.title}" moved to Trash.`);
      setDeletingTrip(null);
      fetchAdminTrips();
    } else {
      alert('Failed to delete trip.');
    }
  };

  const handleRestore = async (trip: any) => {
    const success = await restoreTripInSupabase(trip.id, currentAdminId, trip.title);
    if (success) {
      alert(`Trip "${trip.title}" restored from Trash!`);
      fetchAdminTrips();
    } else {
      alert('Failed to restore trip.');
    }
  };

  const handleConfirmHardDelete = async () => {
    if (!hardDeletingTrip) return;
    const success = await permanentlyDeleteTripInSupabase(hardDeletingTrip.id, currentAdminId);
    if (success) {
      alert(`Trip "${hardDeletingTrip.title}" permanently deleted.`);
      setHardDeletingTrip(null);
      fetchAdminTrips();
    } else {
      alert('Failed to permanently delete trip.');
    }
  };

  const handleMerge = async (id: string, primaryName: string) => {
    await mergeDuplicateDestinations(primaryName, id);
    setDuplicateDestinations((prev) => prev.filter((d) => d.id !== id));
    alert('Duplicate destination merged in Supabase!');
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
          <p className="text-xs text-slate-300">Analytics overview, trip moderation, photo moderation, duplicate merger, & SEO governance.</p>
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

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'moderation'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trip Moderation Queue ({pendingCount})</span>
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
          onClick={() => setActiveTab('trash')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'trash'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Trash Bin ({trashList.length})</span>
        </button>

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

      {/* TAB 1: TRIP MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          {/* Sub-status Filter Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setSubStatusTab('pending_review')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subStatusTab === 'pending_review'
                  ? 'bg-white dark:bg-slate-900 text-brand-purple shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pending Review ({pendingCount})
            </button>
            <button
              onClick={() => setSubStatusTab('published')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subStatusTab === 'published'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Published Live ({publishedCount})
            </button>
            <button
              onClick={() => setSubStatusTab('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subStatusTab === 'rejected'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-slate-400">Loading trip reports...</div>
          ) : displayedTrips.length > 0 ? (
            <div className="space-y-4">
              {displayedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-brand-purple tracking-wider">
                        {trip.destination_slug || 'Bangladesh'} · {trip.duration_days} Days · ৳{trip.cost_per_person?.toLocaleString()}/person
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">{trip.title}</h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Submitted by <span className="font-semibold text-slate-800 dark:text-slate-200">@{trip.author?.username || 'traveler'}</span> ({trip.author?.full_name})
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {/* View Details Modal Button */}
                      <button
                        onClick={() => setViewingTrip(trip)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4 text-brand-purple" />
                        <span>View Details</span>
                      </button>

                      {/* Approve Button */}
                      {trip.publication_status !== 'published' && (
                        <button
                          onClick={() => handleApprove(trip)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                      )}

                      {/* Reject Button */}
                      {trip.publication_status !== 'rejected' && (
                        <button
                          onClick={() => setRejectingTrip(trip)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      )}

                      {/* Soft Delete Button */}
                      <button
                        onClick={() => setDeletingTrip(trip)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">No Trips in {subStatusTab.replace('_', ' ').toUpperCase()}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Trips submitted by community members will appear here for review and moderation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PHOTO MODERATION */}
      {activeTab === 'photos' && <ImageModeration />}

      {/* TAB 3: TRASH BIN */}
      {activeTab === 'trash' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <span>Super Admin Trash Bin (Soft-Deleted Trips)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Soft-deleted trips are immediately hidden from all public pages, searches, and galleries. Super Admins can restore them or permanently purge them.
          </p>

          {trashList.length > 0 ? (
            <div className="space-y-3">
              {trashList.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">{trip.title}</div>
                    <div className="text-xs text-slate-500">
                      Author: @{trip.author?.username || 'traveler'} · Deleted: {new Date(trip.deleted_at || trip.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestore(trip)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore Trip</span>
                    </button>
                    <button
                      onClick={() => setHardDeletingTrip(trip)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-white">Trash Bin is Empty</div>
              <p>No soft-deleted trips currently stored in Trash.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && <AnalyticsOverview />}

      {/* TAB 5: DUPLICATE MERGER */}
      {activeTab === 'duplicates' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Merge className="w-5 h-5 text-brand-purple" />
            <span>Duplicate Destination Auto-Detection & Merger</span>
          </h2>
          {duplicateDestinations.length > 0 ? (
            <div className="space-y-3">
              {duplicateDestinations.map((dest) => (
                <div key={dest.id} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-bold">Primary: {dest.primaryName} ↔ Duplicate: {dest.duplicateName}</div>
                  <button onClick={() => handleMerge(dest.id, dest.primaryName)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">Merge Safely</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 dark:text-white">No Duplicate Destinations Flagged</div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: VIEW DETAILS TRIP PREVIEW */}
      {viewingTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" onClick={() => setViewingTrip(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-purple tracking-wider">
                  {viewingTrip.destination_slug || 'Bangladesh'} · {viewingTrip.duration_days} Days
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{viewingTrip.title}</h2>
                <div className="text-xs text-slate-500 mt-1">Submitted by @{viewingTrip.author?.username || 'traveler'}</div>
              </div>
              <button onClick={() => setViewingTrip(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trip Details Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-slate-400">Cost Per Person</div>
                  <div className="font-black text-brand-cyan text-base">৳{viewingTrip.cost_per_person?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Group Total Spent</div>
                  <div className="font-black text-slate-900 dark:text-white text-base">৳{viewingTrip.total_cost?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Travelers</div>
                  <div className="font-black text-slate-900 dark:text-white text-base">{viewingTrip.traveler_count} People</div>
                </div>
              </div>

              {viewingTrip.trip_transport_segments && viewingTrip.trip_transport_segments.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-brand-purple" />
                    <span>Transport Breakdown</span>
                  </div>
                  <div className="space-y-1">
                    {viewingTrip.trip_transport_segments.map((seg: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                        <span>{seg.from_location} ➔ {seg.to_location} ({seg.transport_type})</span>
                        <span className="font-bold">৳{seg.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setViewingTrip(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs">Close</button>
              {viewingTrip.publication_status !== 'published' && (
                <button onClick={() => { handleApprove(viewingTrip); setViewingTrip(null); }} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">Approve & Publish</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECTION REASON MODAL */}
      {rejectingTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setRejectingTrip(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <XCircle className="w-5 h-5 text-amber-500" />
              <span>Reject Trip Report</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please enter a clear rejection reason for <span className="font-bold">"{rejectingTrip.title}"</span>. The traveler will receive a notification to revise and resubmit.
            </p>
            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Please clarify transport cost breakdown between Dhaka and Sajek..."
              rows={4}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setRejectingTrip(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={handleConfirmReject} className="px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SOFT DELETE CONFIRMATION */}
      {deletingTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setDeletingTrip(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Move Trip to Trash?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "{deletingTrip.title}" will be immediately hidden from public pages and moved to the Trash Bin. You can restore it anytime.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeletingTrip(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={handleConfirmSoftDelete} className="px-6 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm">Move to Trash</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PERMANENT HARD DELETE CONFIRMATION */}
      {hardDeletingTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setHardDeletingTrip(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Permanently Delete Trip?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This action <span className="font-bold text-rose-600">CANNOT be undone</span>. "{hardDeletingTrip.title}" will be permanently erased from PostgreSQL.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setHardDeletingTrip(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500">Cancel</button>
              <button onClick={handleConfirmHardDelete} className="px-6 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm">Permanently Purge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
