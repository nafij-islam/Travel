'use client';

import React, { useRef, useState } from 'react';
import { Trip } from '@/lib/types';
import { X, Download, Share2, Compass, QrCode, Check } from 'lucide-react';

interface PosterModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ trip, isOpen, onClose }) => {
  const [aspectFormat, setAspectFormat] = useState<'square' | 'story' | 'landscape'>('square');
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    alert(`Poster generated for ${trip.title}! Simulated PNG downloaded.`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Shareable Trip Poster</h3>
            <p className="text-xs text-slate-500">Generate social media graphics for Instagram, Facebook, & Stories</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setAspectFormat('square')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              aspectFormat === 'square' ? 'bg-white shadow-sm text-brand-purple' : 'text-slate-600'
            }`}
          >
            Square (1:1)
          </button>
          <button
            onClick={() => setAspectFormat('story')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              aspectFormat === 'story' ? 'bg-white shadow-sm text-brand-purple' : 'text-slate-600'
            }`}
          >
            Story (9:16)
          </button>
          <button
            onClick={() => setAspectFormat('landscape')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              aspectFormat === 'landscape' ? 'bg-white shadow-sm text-brand-purple' : 'text-slate-600'
            }`}
          >
            Landscape (16:9)
          </button>
        </div>

        {/* Poster Canvas Preview */}
        <div className="flex justify-center bg-slate-100 p-4 rounded-2xl">
          <div
            ref={posterRef}
            className={`bg-navy-900 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 w-full ${
              aspectFormat === 'square'
                ? 'max-w-sm aspect-square'
                : aspectFormat === 'story'
                ? 'max-w-xs aspect-[9/16]'
                : 'max-w-md aspect-[16/9]'
            }`}
          >
            {/* Background Graphic */}
            <div className="absolute inset-0 bg-brand-gradient opacity-25 pointer-events-none" />

            {/* Poster Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5 text-brand-cyan" />
                </div>
                <span className="text-xl font-black tracking-tight">
                  Jatrio<span className="text-brand-cyan">.</span>
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-brand-sky">
                Real Trip & Cost Report
              </span>
            </div>

            {/* Poster Details */}
            <div className="relative z-10 my-4 space-y-2">
              <div className="text-xs font-semibold text-brand-cyan uppercase tracking-widest">
                {trip.startLocationText.split(' ')[0]} → {trip.destination.nameEn}
              </div>
              <h2 className="text-lg font-black leading-tight text-white line-clamp-2">
                {trip.title}
              </h2>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-xl bg-brand-purple/40 text-brand-cyan border border-brand-purple/50 text-xs font-bold">
                  {trip.durationDays} Days · {trip.travelerCount} Travelers
                </span>
              </div>
            </div>

            {/* Cost Hero Box */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Cost Per Person</div>
                <div className="text-2xl font-black text-brand-sand">৳{trip.costPerPerson.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-300 uppercase">Total Trip Spent</div>
                <div className="text-sm font-bold text-white">৳{trip.totalCost.toLocaleString()}</div>
              </div>
            </div>

            {/* Poster Footer */}
            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden border border-brand-sky">
                  <img src={trip.author.avatarUrl} alt={trip.author.fullName} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-white">@{trip.author.username}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-brand-sky">
                <QrCode className="w-4 h-4" />
                <span>Scan or visit jatrio.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-2xl bg-brand-purple text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-brand-cyan" />
            <span>Download Poster Image</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-brand-green" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
