'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, DEFAULT_BLUR_PLACEHOLDER } from '@/lib/utils/imageUrlOptimizer';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  preset?: 'galleryThumbnail' | 'destinationCard' | 'tripCoverCard' | 'lightboxPreview';
  transparentBg?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  alt = 'Ghurabo Travel Photo',
  className = '',
  fill = false,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 75,
  preset,
  transparentBg = false
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src) return fallbackSrc;
    if (preset === 'galleryThumbnail') {
      return getOptimizedImageUrl(src, { width: 400, height: 400, quality });
    }
    if (preset === 'destinationCard') {
      return getOptimizedImageUrl(src, { width: 640, height: 420, quality });
    }
    if (preset === 'tripCoverCard') {
      return getOptimizedImageUrl(src, { width: 600, height: 400, quality });
    }
    if (preset === 'lightboxPreview') {
      return getOptimizedImageUrl(src, { width: 1600, quality: 85 });
    }
    if (width || height) {
      return getOptimizedImageUrl(src, { width, height, quality });
    }
    return src;
  });

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const isUnsplashOrSupabase =
    imgSrc.includes('images.unsplash.com') ||
    imgSrc.includes('.supabase.co') ||
    imgSrc.startsWith('/') ||
    imgSrc.startsWith('data:');

  if (!isUnsplashOrSupabase || transparentBg) {
    // Fallback standard img for unconfigured domains or transparent logos
    return (
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        className={`object-contain transform-gpu ${className}`}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${fill ? 'w-full h-full' : ''}`}>
      {/* Lightweight Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-10" />
      )}

      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width || 400 : undefined}
        height={!fill ? height || 300 : undefined}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={DEFAULT_BLUR_PLACEHOLDER}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
        className={`object-cover transform-gpu transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
      />
    </div>
  );
};
