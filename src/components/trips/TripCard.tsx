'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trip } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Calendar, Users, MapPin, Eye, Bookmark, Copy, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { t, locale } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
        <Link href={`/trips/${trip.slug}`}>
          <ImageWithFallback
            src={trip.coverImagePath}
            alt={trip.title}
            fill
            className="group-hover:scale-102 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Category & Bookmark */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide uppercase border border-white/10">
            {locale === 'bn' ? trip.travelStyle.nameBn : trip.travelStyle.nameEn}
          </span>
          <button
            onClick={toggleSave}
            aria-label="Save Trip"
            className={`p-2 rounded-lg backdrop-blur-sm transition-all touch-target ${
              isSaved
                ? 'bg-brand-sand text-white shadow-sm'
                : 'bg-white/90 hover:bg-white text-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10">
          <div className="flex items-center gap-1 text-xs font-medium text-brand-cyan">
            <MapPin className="w-3.5 h-3.5 text-brand-sky shrink-0" />
            <span className="truncate">{trip.startLocationText.split(' ')[0]} → {locale === 'bn' ? trip.destination.nameBn : trip.destination.nameEn}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <Link href={`/trips/${trip.slug}`} className="group/title flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 group-hover/title:text-brand-purple transition-colors line-clamp-2 leading-snug font-heading">
              {trip.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/title:text-brand-purple transition-colors shrink-0 mt-0.5" />
          </Link>

          {/* Duration & Travelers */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-medium text-[11px]">
              <Calendar className="w-3 h-3 text-slate-400" />
              {trip.durationDays} Days
            </span>
            <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-medium text-[11px]">
              <Users className="w-3 h-3 text-slate-400" />
              {trip.travelerCount} Persons
            </span>
          </div>
        </div>

        {/* Cost Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Per Person
            </div>
            <div className="text-base font-bold text-slate-900">
              ৳{trip.costPerPerson.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Spent
            </div>
            <div className="text-xs font-semibold text-brand-sand">
              ৳{trip.totalCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Author Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100">
              <ImageWithFallback
                src={trip.author.avatarUrl}
                alt={trip.author.fullName}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium text-slate-700 truncate flex items-center gap-1">
              <span className="truncate">{trip.author.fullName}</span>
              {trip.author.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 fill-brand-green/20" />
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-400 shrink-0">
            <span className="flex items-center gap-1" title="Copies">
              <Copy className="w-3 h-3 text-slate-400" />
              {trip.copyCount}
            </span>
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3 h-3 text-slate-400" />
              {trip.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
