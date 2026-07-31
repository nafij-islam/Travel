'use client';

import React, { useState } from 'react';
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
import { MOCK_TRIPS } from '@/lib/data/mockData';

export function ImageModeration() {
  // Aggregate images for admin moderation state
  const initialModerationQueue: TripImage[] = [
    {
      id: 'img-mod-1',
      tripId: 'trip-1',
      uploadedBy: 'user-3',
      storagePath: 'trip-images/user-3/trip-1/unverified_view.webp',
      originalFilename: 'unverified_view.jpg',
      caption: 'Crowded hotel area in Sajek',
      altText: 'Sajek Hotel Area',
      isCover: false,
      sortOrder: 2,
      visibility: 'public',
      moderationStatus: 'pending',
      fileSize: 380000,
      width: 1920,
      height: 1080,
      createdAt: '2026-07-28T10:00:00Z',
      updatedAt: '2026-07-28T10:00:00Z',
      previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      uploaderName: 'Tanvir Hossain',
      uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      destinationName: 'Sajek Valley',
      tripTitle: 'Dhaka to Sajek Valley: 3 Days Friends Trip under ৳5,200',
      tripSlug: 'dhaka-to-sajek-valley-3-days-friends-trip',
      reportsCount: 0,
      moderationNotes: ''
    },
    {
      id: 'img-mod-2',
      tripId: 'trip-2',
      uploadedBy: 'user-2',
      storagePath: 'trip-images/user-2/trip-2/coxs_bazar_water.webp',
      originalFilename: 'coxs_bazar_water.jpg',
      caption: 'Sunset waves on Inani Beach',
      altText: 'Inani Beach Sunset',
      isCover: false,
      sortOrder: 1,
      visibility: 'public',
      moderationStatus: 'pending',
      fileSize: 620000,
      width: 1920,
      height: 1080,
      createdAt: '2026-07-29T14:20:00Z',
      updatedAt: '2026-07-29T14:20:00Z',
      previewUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
      uploaderName: 'Anika Rahman',
      uploaderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      destinationName: 'Cox\'s Bazar',
      tripTitle: 'Cox\'s Bazar Budget Travel Guide for Couples',
      tripSlug: 'coxs-bazar-budget-travel-guide',
      reportsCount: 2,
      moderationNotes: 'Reported: Unclear landmark location.'
    }
  ];

  const [queue, setQueue] = useState<TripImage[]>(initialModerationQueue);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'reported' | 'all'>('pending');
  const [moderationNoteInput, setModerationNoteInput] = useState<{ [id: string]: string }>({});

  const handleApprove = (id: string) => {
    setQueue(
      queue.map((img) =>
        img.id === id ? { ...img, moderationStatus: 'approved' } : img
      )
    );
  };

  const handleReject = (id: string) => {
    setQueue(
      queue.map((img) =>
        img.id === id ? { ...img, moderationStatus: 'rejected' } : img
      )
    );
  };

  const handleRemove = (id: string) => {
    setQueue(queue.filter((img) => img.id !== id));
  };

  const handleSaveNote = (id: string) => {
    const note = moderationNoteInput[id] || '';
    setQueue(
      queue.map((img) =>
        img.id === id ? { ...img, moderationNotes: note } : img
      )
    );
    alert('Moderation note saved.');
  };

  const filteredQueue = queue.filter((img) => {
    if (activeFilter === 'pending') return img.moderationStatus === 'pending';
    if (activeFilter === 'reported') return (img.reportsCount || 0) > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Moderation Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-brand-purple font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Super Admin Console</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Trip Photo Moderation Queue
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'pending'
                ? 'bg-white text-brand-purple shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({queue.filter((q) => q.moderationStatus === 'pending').length})
          </button>
          <button
            onClick={() => setActiveFilter('reported')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'reported'
                ? 'bg-white text-rose-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reported ({queue.filter((q) => (q.reportsCount || 0) > 0).length})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Entries
          </button>
        </div>
      </div>

      {/* Queue Items */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 font-heading">Moderation Queue Clear!</h4>
          <p className="text-xs text-slate-500">All submitted trip photos have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col lg:flex-row gap-5"
            >
              {/* Image Thumbnail */}
              <div className="relative w-full lg:w-64 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={item.previewUrl}
                  alt={item.caption || 'Upload photo'}
                  className="w-full h-full object-cover"
                />
                {(item.reportsCount || 0) > 0 && (
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Flag className="w-3 h-3" />
                    <span>{item.reportsCount} User Reports</span>
                  </div>
                )}
              </div>

              {/* Details & Info */}
              <div className="flex-1 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.moderationStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.moderationStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {item.moderationStatus}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Uploaded {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    "{item.caption || 'Untitled photo'}"
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-purple shrink-0" />
                      <span>Uploader: <strong className="text-slate-800">{item.uploaderName}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                      <span>Destination: <strong className="text-slate-800">{item.destinationName}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <FileImage className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">Trip: <strong className="text-slate-800">{item.tripTitle}</strong></span>
                    </div>
                  </div>

                  {/* Moderation Notes */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Moderation Notes / Audit Log
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={item.moderationNotes || ''}
                        onChange={(e) =>
                          setModerationNoteInput({
                            ...moderationNoteInput,
                            [item.id]: e.target.value
                          })
                        }
                        placeholder="Add note for uploader or internal log..."
                        className="flex-1 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium"
                      />
                      <button
                        onClick={() => handleSaveNote(item.id)}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  {item.tripSlug && (
                    <Link
                      href={`/trips/${item.tripSlug}`}
                      target="_blank"
                      className="text-xs font-bold text-brand-purple flex items-center gap-1 hover:underline"
                    >
                      <span>View Related Trip</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-colors"
                      title="Permanently Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
