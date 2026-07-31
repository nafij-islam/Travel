'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, User, Check, AlertCircle } from 'lucide-react';
import { processAndOptimizeImage } from '@/lib/utils/imageCompressor';
import { createClient } from '@/lib/supabase/client';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  userId?: string;
  onAvatarChange: (newUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUploader({
  currentAvatarUrl = '',
  userId = 'guest',
  onAvatarChange,
  size = 'md'
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dimensionClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }[size];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5 MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      // 1. Compress Image to WebP
      const compressed = await processAndOptimizeImage(file, 500, 500, 0.85);
      setUploadProgress(60);

      // 2. Local Preview
      const localPreviewUrl = URL.createObjectURL(compressed.file);
      setPreview(localPreviewUrl);

      // 3. Upload to Supabase Storage `avatars` bucket
      const supabase = createClient();
      if (supabase && userId && userId !== 'guest') {
        const fileExt = 'webp';
        const fileName = `avatar_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${userId}/${fileName}`;

        const { data, error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(filePath, compressed.file, { upsert: true, contentType: 'image/webp' });

        if (uploadErr) {
          console.warn('Supabase avatar upload failed, using local preview:', uploadErr.message);
          onAvatarChange(localPreviewUrl);
        } else {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          const finalUrl = publicUrlData?.publicUrl || localPreviewUrl;
          onAvatarChange(finalUrl);
        }
      } else {
        onAvatarChange(localPreviewUrl);
      }

      setUploadProgress(100);
    } catch (err) {
      console.error('Error processing avatar:', err);
      setError('Failed to process avatar image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onAvatarChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div
          className={`${dimensionClasses} rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative transition-transform group-hover:scale-105`}
        >
          {preview ? (
            <img src={preview} alt="Profile Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-1/2 h-1/2 text-slate-400 dark:text-slate-500" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2">
              <RefreshCw className="w-5 h-5 animate-spin mb-1" />
              <span className="text-[10px] font-bold">{uploadProgress}%</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white shadow-lg transition-transform hover:scale-110"
          title="Upload or Change Avatar"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
        >
          {preview ? 'Change Photo' : 'Upload Photo'}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
            title="Remove Photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
