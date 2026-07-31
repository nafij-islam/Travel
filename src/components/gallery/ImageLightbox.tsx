'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  User,
  Share2,
  Bookmark,
  ExternalLink,
  Flag,
  Check,
  AlertTriangle
} from 'lucide-react';
import { TripImage } from '@/lib/types';

interface ImageLightboxProps {
  image: TripImage | null;
  imagesList?: TripImage[];
  onClose: () => void;
  onNavigate?: (newImage: TripImage) => void;
}

export function ImageLightbox({
  image,
  imagesList = [],
  onClose,
  onNavigate
}: ImageLightboxProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const currentIndex = imagesList.findIndex((img) => img.id === image.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < imagesList.length - 1 && currentIndex !== -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev && onNavigate) {
      onNavigate(imagesList[currentIndex - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext && onNavigate) {
      onNavigate(imagesList[currentIndex + 1]);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: image.caption || image.tripTitle || 'Ghurabo Trip Photo',
      text: `${image.caption ? image.caption + ' — ' : ''}Real travel photo from ${image.destinationName || 'Bangladesh'} on Ghurabo`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportModal(false);
      setReportReason('');
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Actions */}
      <div
        className="flex items-center justify-between w-full text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-800">
            {image.uploaderAvatar ? (
              <img src={image.uploaderAvatar} alt={image.uploaderName || 'Traveler'} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white/60 m-2.5" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white font-heading">
              {image.uploaderName || 'Verified Traveler'}
            </div>
            {image.destinationName && (
              <div className="flex items-center gap-1 text-xs text-brand-cyan">
                <MapPin className="w-3 h-3" />
                <span>{image.destinationName}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xs"
          title="Close Lightbox (ESC)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Image Display with Nav Controls */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-xs transition-transform hover:scale-105"
            title="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={image.previewUrl || `https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800`}
          alt={image.altText || image.caption || 'Ghurabo Travel Photo'}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
        />

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-xs transition-transform hover:scale-105"
            title="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Metadata & Action Buttons */}
      <div
        className="bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 max-w-4xl mx-auto w-full text-white space-y-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-1 flex-1">
            {image.caption ? (
              <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-snug">
                "{image.caption}"
              </h3>
            ) : (
              <h3 className="text-sm font-semibold text-slate-300 italic">
                No caption provided
              </h3>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {image.tripTitle && (
                <span className="text-slate-300 font-medium">
                  Trip: <strong className="text-white">{image.tripTitle}</strong>
                </span>
              )}
              {image.tripDate && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{image.tripDate}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {image.tripSlug && (
              <Link
                href={`/trips/${image.tripSlug}`}
                className="px-3.5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>View Original Trip</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isSaved
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
              title="Report Inappropriate Photo"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 font-heading">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Report Inappropriate Photo</span>
              </div>
              <button onClick={() => setShowReportModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-xs space-y-1">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <span>Thank you! Your report has been submitted to Ghurabo moderators.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please let us know why this photo violates Ghurabo guidelines (e.g., misleading destination, offensive content, privacy violation).
                </p>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe reason for reporting..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
