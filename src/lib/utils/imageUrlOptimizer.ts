/**
 * Ghurabo CDN & Image URL Optimization Utility
 * Appends width, height, format, and quality parameters for Unsplash and Supabase CDN URLs.
 */

export interface ImageVariantOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg';
  fit?: 'crop' | 'max' | 'fill';
}

// Default Blur SVG Placeholder (Data URL) for layout shift prevention
export const DEFAULT_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDMiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=';

/**
 * Returns an optimized CDN URL with appropriate width, quality, and format constraints.
 */
export function getOptimizedImageUrl(
  url: string,
  options: ImageVariantOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';

  const { width, height, quality = 75, format = 'webp', fit = 'crop' } = options;

  try {
    // 1. Unsplash Optimization
    if (url.includes('images.unsplash.com')) {
      const parsedUrl = new URL(url);
      if (width) parsedUrl.searchParams.set('w', width.toString());
      if (height) parsedUrl.searchParams.set('h', height.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', fit);
      return parsedUrl.toString();
    }

    // 2. Supabase Storage Transformation API
    if (url.includes('.supabase.co/storage/v1/object/public/')) {
      // Convert /object/public/ to /render/image/public/ for transformation API
      let renderUrl = url.replace(
        '/storage/v1/object/public/',
        '/storage/v1/render/image/public/'
      );

      const parsedUrl = new URL(renderUrl);
      if (width) parsedUrl.searchParams.set('width', width.toString());
      if (height) parsedUrl.searchParams.set('height', height.toString());
      parsedUrl.searchParams.set('quality', quality.toString());
      parsedUrl.searchParams.set('format', format);
      parsedUrl.searchParams.set('resize', 'cover');
      return parsedUrl.toString();
    }

    return url;
  } catch (e) {
    return url;
  }
}

/**
 * Recommended Preset Sizes
 */
export const IMAGE_PRESETS = {
  galleryThumbnail: { width: 400, height: 400, quality: 75 },
  destinationCard: { width: 640, height: 420, quality: 75 },
  tripCoverCard: { width: 600, height: 400, quality: 75 },
  lightboxPreview: { width: 1600, quality: 85 }
};
