'use client';

import React, { useState, useEffect } from 'react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getPublicGalleryImages } from '@/lib/supabase/supabase';
import { TripImage } from '@/lib/types';
import { Camera } from 'lucide-react';

export default function PublicGalleryPage() {
  const [images, setImages] = useState<TripImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const liveImages = await getPublicGalleryImages();
        setImages(liveImages);
      } catch (err) {
        console.error('Error loading gallery photos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Gallery Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold border border-brand-purple/20">
          <Camera className="w-3.5 h-3.5" />
          <span>Real Traveler Snapshots</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading">
          Explore Bangladesh <span className="text-brand-purple">Travel Gallery</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Discover authentic community photos, scenic landscapes, and authentic itinerary snapshots shared by verified travelers.
        </p>
      </div>

      {/* Gallery Grid & Lightbox Container */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading travel gallery...</div>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}
