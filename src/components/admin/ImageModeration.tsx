'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  User,
  MapPin,
  Flag,
  FileImage
} from 'lucide-react';
import { TripImage } from '@/lib/types';
import { supabase } from '@/lib/supabase/supabase';

export function ImageModeration() {
  const [moderationQueue, setModerationQueue] = useState<TripImage[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'reported' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPendingImages() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('trip_images')
          .select(`
            *,
            uploader:profiles(*),
            trip:trips(*)
          `)
          .eq('moderation_status', 'pending')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setModerationQueue(
            data.map((img: any) => ({
              id: img.id,
              tripId: img.trip_id,
              uploadedBy: img.uploaded_by,
              storagePath: img.storage_path,
              originalFilename: img.original_filename,
              caption: img.caption,
              altText: img.alt_text,
              isCover: img.is_cover,
              sortOrder: img.sort_order,
              visibility: img.visibility || 'public',
              moderationStatus: img.moderation_status,
              fileSize: img.file_size || 300000,
              width: img.width || 1920,
              height: img.height || 1080,
              createdAt: img.created_at,
              updatedAt: img.created_at,
              previewUrl: img.storage_path,
              uploaderName: img.uploader?.full_name || 'Traveler',
              uploaderAvatar: img.uploader?.avatar_url || '',
              destinationName: img.trip?.destination_slug || 'Bangladesh',
              tripTitle: img.trip?.title || 'Trip Report',
              tripSlug: img.trip?.slug || '',
              reportsCount: 0,
              moderationNotes: ''
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching image moderation queue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPendingImages();
  }, []);

  const handleApprove = async (id: string) => {
    if (supabase) {
      await supabase.from('trip_images').update({ moderation_status: 'approved' }).eq('id', id);
    }
    setModerationQueue((prev) => prev.filter((img) => img.id !== id));
  };

  const handleReject = async (id: string) => {
    if (supabase) {
      await supabase.from('trip_images').update({ moderation_status: 'rejected' }).eq('id', id);
    }
    setModerationQueue((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Moderation Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider block">Super Admin Console</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Trip Photo Moderation Queue</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending Review ({moderationQueue.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading moderation queue...</div>
      ) : moderationQueue.length > 0 ? (
        <div className="space-y-4">
          {moderationQueue.map((img) => (
            <div key={img.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-5 items-start">
              <img src={img.previewUrl} alt={img.caption || 'Trip Photo'} className="w-full md:w-48 h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">{img.caption || 'Uploaded Photo'}</div>
                <div className="text-xs text-slate-500">Uploaded by @{img.uploaderName} for trip {img.tripTitle}</div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleApprove(img.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Approve</button>
                  <button onClick={() => handleReject(img.id)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <FileImage className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">No Photos Awaiting Moderation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">All uploaded user photos have been reviewed and moderated.</p>
        </div>
      )}
    </div>
  );
}
