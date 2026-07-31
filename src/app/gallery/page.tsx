import React from 'react';
import { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { MOCK_TRIPS } from '@/lib/data/mockData';
import { TripImage } from '@/lib/types';
import { Camera, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Photo Gallery — Real Bangladesh Trips',
  description: 'Explore crowd-sourced travel photos, real trip costs, scenic landscapes, and authentic itinerary snapshots across Bangladesh.'
};

export default function PublicGalleryPage() {
  // Aggregate all trip images across mock trips
  const allImages: TripImage[] = MOCK_TRIPS.flatMap((trip) => {
    if (trip.tripImages && trip.tripImages.length > 0) {
      return trip.tripImages;
    }
    // Fallback for legacy trips
    return trip.images.map((imgUrl, idx) => ({
      id: `img_${trip.id}_${idx}`,
      tripId: trip.id,
      uploadedBy: trip.authorId,
      storagePath: imgUrl,
      originalFilename: `photo_${idx + 1}.jpg`,
      caption: idx === 0 ? `${trip.title} cover photo` : `Snapshot from ${trip.destination.nameEn}`,
      altText: trip.destination.nameEn,
      isCover: idx === 0,
      sortOrder: idx,
      visibility: 'public' as const,
      moderationStatus: 'approved' as const,
      fileSize: 450000,
      width: 1920,
      height: 1080,
      createdAt: trip.publishedAt,
      updatedAt: trip.publishedAt,
      previewUrl: imgUrl,
      uploaderName: trip.author.fullName,
      uploaderAvatar: trip.author.avatarUrl,
      destinationName: trip.destination.nameEn,
      tripTitle: trip.title,
      tripSlug: trip.slug,
      tripDate: '2026',
      travelStyleSlug: trip.travelStyle.slug
    }));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Gallery Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold border border-brand-purple/20">
          <Camera className="w-3.5 h-3.5" />
          <span>Real Traveler Snapshots</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
          Explore Bangladesh <span className="text-brand-purple">Travel Gallery</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Discover authentic community photos, scenic Sajek sea of clouds, Cox's Bazar sunsets, and tea garden trails shared by verified travelers.
        </p>
      </div>

      {/* Gallery Grid & Lightbox Container */}
      <GalleryGrid images={allImages} />
    </div>
  );
}
