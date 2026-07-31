'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trip } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ExpenseChart } from '@/components/trips/ExpenseChart';
import { PosterModal } from '@/components/trips/PosterModal';
import { CostConfirmation } from '@/components/trips/CostConfirmation';
import {
  Calendar,
  Users,
  MapPin,
  Bookmark,
  Share2,
  Copy,
  CheckCircle2,
  Bus,
  Hotel,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Send,
  Star
} from 'lucide-react';

interface TripDetailClientProps {
  trip: Trip;
}

export const TripDetailClient: React.FC<TripDetailClientProps> = ({ trip }) => {
  const { t, locale } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 'q-sub-1',
      author: 'Tanvir Hossain',
      text: 'Is it necessary to reserve Chander Gari in advance or can we book at Khagrachari counter?',
      answer: 'You can book right at Khagrachari counter at 7:00 AM. No advance booking needed!'
    }
  ]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      { id: Date.now().toString(), author: 'You', text: newQuestion, answer: '' }
    ]);
    setNewQuestion('');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. TOP HERO COVER & TITLE */}
      <div className="relative bg-navy-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src={trip.coverImagePath}
            alt={trip.title}
            fill
            sizes="100vw"
            className="object-cover blur-md"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/40" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="hover:text-brand-sky">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/trips" className="hover:text-brand-sky">Trips</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-cyan font-bold">{trip.destination.nameEn}</span>
          </div>

          {/* Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-brand-purple text-white text-xs font-black uppercase tracking-wider shadow-sm">
                {locale === 'bn' ? trip.travelStyle.nameBn : trip.travelStyle.nameEn}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium backdrop-blur-md border border-white/15">
                Published {trip.publishedAt.split('T')[0]}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-heading">
              {trip.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {trip.summary}
            </p>
          </div>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
            {/* Author Profile */}
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={trip.author.avatarUrl}
                alt={trip.author.fullName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full border-2 border-brand-sky"
              />
              <div>
                <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                  {trip.author.fullName}
                  {trip.author.isVerified && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
                </div>
                <div className="text-xs text-slate-400">@{trip.author.username} · Visited {trip.author.districtsVisitedCount} Districts</div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                  isSaved ? 'bg-brand-sand text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? t('trip.saved') : t('trip.saveTrip')}</span>
              </button>

              <button
                onClick={() => setIsPosterOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/15 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4 text-brand-sky" />
                <span>{t('trip.sharePoster')}</span>
              </button>

              <Link
                href={`/my-trips/${trip.id}/plan`}
                className="px-5 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-lg hover:bg-brand-purple/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-brand-cyan" />
                <span>{t('trip.copyTrip')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 -mt-8 relative z-20">
        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xl">
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-slate-400">{t('trip.startingFrom')}</div>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
              <span className="truncate">{trip.startLocationText}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-slate-400">{t('trip.duration')}</div>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-brand-purple shrink-0" />
              <span>{trip.durationDays} Days / {trip.durationDays - 1} Nights</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-slate-400">Travelers</div>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-1">
              <Users className="w-4 h-4 text-brand-purple shrink-0" />
              <span>{trip.travelerCount} Persons</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-brand-purple">{t('trip.costPerPerson')}</div>
            <div className="text-base font-black text-navy-900">
              ৳{trip.costPerPerson.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 2. COST BREAKDOWN CHART */}
        <ExpenseChart
          expenses={trip.expenses}
          totalCost={trip.totalCost}
          costPerPerson={trip.costPerPerson}
          travelerCount={trip.travelerCount}
        />

        {/* 3. ROUTE & TRANSPORT TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-navy-900 flex items-center gap-2 font-heading">
            <Bus className="w-5 h-5 text-brand-purple" />
            <span>{t('trip.routeTimeline')}</span>
          </h3>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-brand-sky/40">
            {trip.transportSegments.map((seg, idx) => (
              <div key={seg.id} className="relative pl-10 space-y-1">
                <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-brand-purple border-2 border-white ring-4 ring-brand-cyan/40" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-brand-cyan/20 transition-colors">
                  <div>
                    <div className="text-xs font-black text-brand-purple uppercase tracking-wider">
                      Segment {idx + 1}: {seg.transportType}
                    </div>
                    <div className="text-sm font-bold text-navy-900">
                      {seg.fromLocation} → {seg.toLocation}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Operator: <span className="font-semibold text-slate-700">{seg.operatorName}</span> ({seg.durationHours} hours)
                    </div>
                    {seg.notes && <div className="text-xs text-slate-400 italic mt-1">{seg.notes}</div>}
                  </div>
                  <div className="text-sm font-black text-navy-900 sm:text-right">
                    ৳{seg.cost.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACCOMMODATION DETAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-navy-900 flex items-center gap-2 font-heading">
            <Hotel className="w-5 h-5 text-brand-purple" />
            <span>{t('trip.accommodation')}</span>
          </h3>

          {trip.accommodations.map((acc) => (
            <div key={acc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-navy-900">{acc.propertyName}</h4>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {acc.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{acc.location} · {acc.nights} Nights</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-navy-900">৳{acc.totalCost.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">৳{acc.costPerNight.toLocaleString()} / night</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100">
                "{acc.experienceNotes}"
              </p>
            </div>
          ))}
        </div>

        {/* 5. DAILY ITINERARY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-navy-900 flex items-center gap-2 font-heading">
            <Calendar className="w-5 h-5 text-brand-purple" />
            <span>{t('trip.itinerary')}</span>
          </h3>

          <div className="space-y-6">
            {trip.itinerary.map((day) => (
              <div key={day.dayNumber} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-brand-purple text-white font-black text-xs">
                    Day {day.dayNumber}
                  </span>
                  <h4 className="text-base font-bold text-navy-900 font-heading">{day.title}</h4>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 pl-2">
                  {day.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-purple font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                {day.notes && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    💡 <strong>Traveler Note:</strong> {day.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. PROBLEMS & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2 text-rose-600 font-heading">
              <ShieldAlert className="w-5 h-5" />
              <span>{t('trip.problems')}</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {trip.problemsExperienced.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2 text-brand-purple font-heading">
              <Lightbulb className="w-5 h-5 text-brand-sky" />
              <span>{t('trip.recommendations')}</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-800 block mb-1">Cost Saving Tips:</strong>
                <ul className="space-y-1 list-disc pl-4 text-slate-600">
                  {trip.recommendations.costSavingTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-800 block mb-1">What to Carry:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {trip.recommendations.whatToCarry.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-cyan/40 text-slate-800 font-semibold text-[11px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. COMMUNITY COST ACCURACY VOTING */}
        <CostConfirmation stats={trip.costConfirmations} />

        {/* 8. QUESTIONS & ANSWERS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-navy-900 flex items-center gap-2 font-heading">
            <MessageSquare className="w-5 h-5 text-brand-purple" />
            <span>Ask the Traveler</span>
          </h3>

          <form onSubmit={handleAskQuestion} className="space-y-3">
            <textarea
              rows={3}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={`Ask @${trip.author.username} a question about transport, hotel, or costs...`}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-md hover:bg-brand-purple/90 active:scale-95 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Post Question</span>
            </button>
          </form>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {questions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="font-bold text-navy-900">Q: {q.text}</div>
                <div className="text-slate-400">Asked by {q.author}</div>
                {q.answer && (
                  <div className="mt-2 p-3 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-slate-700">
                    <strong className="text-brand-purple block mb-0.5">Answer by Author:</strong>
                    {q.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Poster Modal */}
      <PosterModal
        trip={trip}
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />
    </div>
  );
};
