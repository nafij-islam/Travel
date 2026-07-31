'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, User, Star, Filter, Image as ImageIcon } from 'lucide-react';
import { TripImage } from '@/lib/types';
import { ImageLightbox } from './ImageLightbox';

interface GalleryGridProps {
  images: TripImage[];
  initialDestination?: string;
  initialStyle?: string;
}

export function GalleryGrid({
  images,
  initialDestination = 'all',
  initialStyle = 'all'
}: GalleryGridProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestination);
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyle);
  const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'styles'>('all');
  const [activeLightboxImage, setActiveLightboxImage] = useState<TripImage | null>(null);

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
        // Public & Approved filters
        if (img.visibility !== 'public' || img.moderationStatus !== 'approved') return false;

        // Destination Filter
        if (selectedDestination !== 'all' && img.destinationName !== selectedDestination) {
          return false;
        }

        // Travel Style Filter
        if (selectedStyle !== 'all' && img.travelStyleSlug !== selectedStyle) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Cover photos appear first
        if (a.isCover && !b.isCover) return -1;
        if (!a.isCover && b.isCover) return 1;
        return a.sortOrder - b.sortOrder;
      });
  }, [images, selectedDestination, selectedStyle]);

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedDestination('all');
              setSelectedStyle('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all touch-target ${
              activeTab === 'all' && selectedDestination === 'all' && selectedStyle === 'all'
                ? 'bg-brand-purple text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all touch-target ${
                selectedDestination === dest
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📍 {dest}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-purple"
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
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-heading">No Travel Photos Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your destination or travel style filters to view crowd-sourced photos from Bangladesh.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveLightboxImage(img)}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden aspect-4/3 cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300 border border-slate-200/60"
            >
              {/* Image */}
              <img
                src={img.previewUrl || `https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800`}
                alt={img.altText || img.caption || 'Ghurabo Travel Photo'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-95 group-hover:opacity-100"
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
