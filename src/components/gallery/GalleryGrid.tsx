'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, User, Star, Filter, Image as ImageIcon, ChevronDown, Sparkles } from 'lucide-react';
import { TripImage } from '@/lib/types';
import { ImageLightbox } from './ImageLightbox';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

interface GalleryGridProps {
  images: TripImage[];
  initialDestination?: string;
  initialStyle?: string;
}

const BATCH_SIZE = 12;

export function GalleryGrid({
  images,
  initialDestination = 'all',
  initialStyle = 'all'
}: GalleryGridProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestination);
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);
  const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'styles'>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<TripImage | null>(null);

  // Pagination Batch Count
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  // Extract unique destinations and styles for filter controls
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    images.forEach((img) => {
      if (img.destinationName) set.add(img.destinationName);
    });
    return Array.from(set);
  }, [images]);

  const uniqueStyles = useMemo(() => {
    const set = new Set<string>();
    images.forEach((img) => {
      if (img.travelStyleSlug) set.add(img.travelStyleSlug);
    });
    return Array.from(set);
  }, [images]);

  // Filter & sort images: public + approved + cover first + sort_order
  const filteredImages = useMemo(() => {
    return images
      .filter((img) => {
        if (img.visibility !== 'public' || img.moderationStatus !== 'approved') return false;
        if (selectedDestination !== 'all' && img.destinationName !== selectedDestination) return false;
        if (selectedStyle !== 'all' && img.travelStyleSlug !== selectedStyle) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.isCover && !b.isCover) return -1;
        if (!a.isCover && b.isCover) return 1;
        return a.sortOrder - b.sortOrder;
      });
  }, [images, selectedDestination, selectedStyle]);

  // Currently displayed batch subset
  const displayedImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedDestination('all');
              setSelectedStyle('all');
              setVisibleCount(BATCH_SIZE);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all touch-target ${
              activeTab === 'all' && selectedDestination === 'all' && selectedStyle === 'all'
                ? 'bg-brand-purple text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Photos ({images.length})
          </button>

          {uniqueDestinations.map((dest) => (
            <button
              key={dest}
              onClick={() => {
                setActiveTab('destinations');
                setSelectedDestination(dest);
                setSelectedStyle('all');
                setVisibleCount(BATCH_SIZE);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all touch-target ${
                selectedDestination === dest
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              📍 {dest}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStyle}
            onChange={(e) => {
              setSelectedStyle(e.target.value);
              setVisibleCount(BATCH_SIZE);
            }}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-purple"
          >
            <option value="all">All Travel Styles</option>
            {uniqueStyles.map((style) => (
              <option key={style} value={style}>
                {style.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">No Travel Photos Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your destination or travel style filters to view crowd-sourced photos from Bangladesh.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transform-gpu">
          {displayedImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setActiveLightboxImage(img)}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden aspect-4/3 cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300 border border-slate-200/60 dark:border-slate-800/80 transform-gpu"
            >
              {/* Optimized Next.js Thumbnail Image */}
              <ImageWithFallback
                src={img.previewUrl || `https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800`}
                alt={img.altText || img.caption || 'Ghurabo Travel Photo'}
                fill
                preset="galleryThumbnail"
                priority={idx < 3}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                className="group-hover:scale-110 transition-transform duration-500"
              />

              {/* Cover Badge */}
              {img.isCover && (
                <div className="absolute top-2.5 left-2.5 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1 z-10">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Trip Cover</span>
                </div>
              )}

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-3.5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                {img.caption && (
                  <p className="text-xs font-bold text-white font-heading line-clamp-2 leading-snug drop-shadow-xs">
                    "{img.caption}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    {img.uploaderAvatar ? (
                      <img src={img.uploaderAvatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover shrink-0" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-brand-cyan" />
                    )}
                    <span className="truncate font-medium">{img.uploaderName || 'Traveler'}</span>
                  </div>

                  {img.destinationName && (
                    <span className="flex items-center gap-0.5 text-brand-cyan font-semibold shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span>{img.destinationName}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Batch Pagination Load More Control */}
      {visibleCount < filteredImages.length && (
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <span>Load More Photos ({filteredImages.length - visibleCount} remaining)</span>
            <ChevronDown className="w-4 h-4 text-brand-purple" />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        image={activeLightboxImage}
        imagesList={filteredImages}
        onClose={() => setActiveLightboxImage(null)}
        onNavigate={(newImg) => setActiveLightboxImage(newImg)}
      />
    </div>
  );
}
