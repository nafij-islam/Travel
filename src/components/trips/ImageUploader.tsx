'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle2,
  FileImage,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  validateImageFiles,
  processAndOptimizeImage,
  MAX_IMAGES_PER_TRIP,
  MAX_FILE_SIZE_BYTES,
  ValidationError
} from '@/lib/utils/imageCompressor';
import { TripImage } from '@/lib/types';

export interface UploadItem {
  tempId: string;
  originalFilename: string;
  fileSize: number;
  previewUrl: string;
  caption: string;
  altText: string;
  isCover: boolean;
  sortOrder: number;
  width?: number;
  height?: number;
  status: 'idle' | 'compressing' | 'uploading' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
  fileObj?: File;
}

interface ImageUploaderProps {
  images: UploadItem[];
  onChange: (updatedImages: UploadItem[]) => void;
  userId?: string;
  tripId?: string;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file dialog
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process incoming files
  const handleFilesAdded = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setValidationErrors([]);
    setIsProcessing(true);

    const existingItems = images.map((img) => ({
      originalFilename: img.originalFilename,
      fileSize: img.fileSize
    }));

    const { validFiles, errors } = validateImageFiles(fileArray, existingItems);

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    if (validFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newUploadItems: UploadItem[] = [];

    for (let index = 0; index < validFiles.length; index++) {
      const file = validFiles[index];
      const tempId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isFirst = images.length === 0 && index === 0;

      try {
        const processed = await processAndOptimizeImage(file);
        newUploadItems.push({
          tempId,
          originalFilename: processed.originalFilename,
          fileSize: processed.fileSize,
          previewUrl: processed.previewUrl,
          caption: '',
          altText: processed.originalFilename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          isCover: isFirst,
          sortOrder: images.length + index,
          width: processed.width,
          height: processed.height,
          status: 'completed',
          progress: 100,
          fileObj: processed.file
        });
      } catch (err) {
        newUploadItems.push({
          tempId,
          originalFilename: file.name,
          fileSize: file.size,
          previewUrl: URL.createObjectURL(file),
          caption: '',
          altText: file.name,
          isCover: false,
          sortOrder: images.length + index,
          status: 'error',
          progress: 0,
          errorMessage: (err as Error).message || 'Failed to process image'
        });
      }
    }

    const merged = [...images, ...newUploadItems];
    // Ensure exactly one cover image if items exist
    if (merged.length > 0 && !merged.some((m) => m.isCover)) {
      merged[0].isCover = true;
    }

    onChange(merged);
    setIsProcessing(false);
  };

  // Drag and drop listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Set cover image toggle
  const handleSetCover = (tempId: string) => {
    const updated = images.map((img) => ({
      ...img,
      isCover: img.tempId === tempId
    }));
    onChange(updated);
  };

  // Reorder items
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Update sortOrder
    const reordered = copy.map((item, idx) => ({
      ...item,
      sortOrder: idx
    }));

    onChange(reordered);
  };

  // Update caption
  const handleCaptionChange = (tempId: string, caption: string) => {
    const updated = images.map((img) =>
      img.tempId === tempId ? { ...img, caption } : img
    );
    onChange(updated);
  };

  // Remove item
  const handleRemove = (tempId: string) => {
    const filtered = images.filter((img) => img.tempId !== tempId);
    // If cover was removed, assign cover to first item
    if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
      filtered[0].isCover = true;
    }
    const reordered = filtered.map((item, idx) => ({ ...item, sortOrder: idx }));
    onChange(reordered);
  };

  const coverImage = images.find((i) => i.isCover) || images[0];

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-purple bg-brand-purple/5 scale-[1.01]'
            : 'border-slate-300 hover:border-brand-purple/60 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 font-heading">
              Drag & Drop trip photos here, or <span className="text-brand-purple underline underline-offset-2">browse files</span>
            </h4>
            <p className="text-xs text-slate-500">
              Upload up to <span className="font-bold text-slate-700">{MAX_IMAGES_PER_TRIP} photos</span> per trip (Max 8 MB per file). JPG, PNG, WebP supported.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> WebP Auto-Compression
            </span>
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> EXIF Metadata Stripped
            </span>
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Drag to Reorder
            </span>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center space-y-2 z-10">
            <RefreshCw className="w-6 h-6 text-brand-purple animate-spin" />
            <span className="text-xs font-bold text-slate-700">Optimizing & converting photos to WebP...</span>
          </div>
        )}
      </div>

      {/* Validation Warnings */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-800">
          <div className="flex items-center gap-2 font-bold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Some files could not be added:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            {validationErrors.map((err, idx) => (
              <li key={idx}>
                <span className="font-semibold">{err.filename}:</span> {err.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Image Count & Status Bar */}
      {images.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-brand-purple" />
            <span className="font-bold text-slate-800">
              {images.length} / {MAX_IMAGES_PER_TRIP} Photos Added
            </span>
            {coverImage && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                ★ Cover Selected
              </span>
            )}
          </div>
          <div className="text-slate-500 text-[11px]">
            Click <span className="font-semibold text-slate-700">★ Set Cover</span> to choose main card photo.
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((item, idx) => (
            <div
              key={item.tempId}
              className={`group relative bg-white rounded-xl border transition-all duration-200 shadow-2xs overflow-hidden flex flex-col ${
                item.isCover
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.previewUrl}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Cover Badge */}
                {item.isCover && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Trip Cover</span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.tempId)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-10"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2.5 flex items-center justify-between text-white z-10">
                  <button
                    type="button"
                    onClick={() => handleSetCover(item.tempId)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                      item.isCover
                        ? 'bg-amber-500 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${item.isCover ? 'fill-white' : ''}`} />
                    <span>{item.isCover ? 'Cover' : 'Set Cover'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="w-6 h-6 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="w-6 h-6 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Caption & Metadata Input */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => handleCaptionChange(item.tempId, e.target.value)}
                    placeholder="Add caption (e.g. Sunset view from Kanglak Hill)"
                    className="w-full text-xs font-medium p-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{(item.fileSize / 1024).toFixed(0)} KB WebP</span>
                  {item.width && item.height && (
                    <span>{item.width} × {item.height}px</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
