'use client';

import React, { useState } from 'react';

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
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  alt = 'Travel image',
  className = '',
  fill,
  width,
  height,
  priority = false
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        className={`absolute inset-0 w-full h-full object-cover transform-gpu ${className}`}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      className={`object-cover transform-gpu ${className}`}
    />
  );
};
