'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_TRAVEL_STYLES, MOCK_DESTINATIONS } from '@/lib/data/mockData';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Wallet,
  Bus,
  Hotel,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { createTripInSupabase } from '@/lib/supabase/supabase';
import { createClient } from '@/lib/supabase/client';
import { ImageUploader, UploadItem } from '@/components/trips/ImageUploader';
import { DestinationSearchInput } from '@/components/trips/DestinationSearchInput';

export default function ShareTripPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    startLocationText: 'Dhaka',
    destinationSlug: 'sajek-valley',
    destinationInputText: 'Sajek Valley',
    durationDays: 3,
    travelerCount: 4,
    travelStyleSlug: 'student-budget',
    contentLanguage: 'en',

    // Route segments
    transportSegments: [
      { fromLocation: 'Dhaka', toLocation: 'Khagrachari', transportType: 'Bus', operatorName: 'Shanti Paribahan', durationHours: 7, cost: 2800 }
    ],

    // Accommodations
    accommodations: [
      { propertyName: 'Meghmachang Resort', location: 'Ruilui Para', nights: 2, totalCost: 7000, rating: 4.5, experienceNotes: 'Great sea of clouds view!' }
    ],

    // Categorized Expenses
    expenses: [
      { category: 'transport', description: 'Bus & Chander Gari', amount: 10100 },
      { category: 'accommodation', description: 'Resort stay', amount: 7000 },
      { category: 'food', description: 'Meals & Tea', amount: 3200 },
      { category: 'activities', description: 'Entry fees & guide', amount: 500 }
    ],

    // Itinerary Days
    itinerary: [
      { dayNumber: 1, title: 'Arrival & Helipad Sunset', activities: 'Bus journey from Dhaka, check in resort, sunset view.' },
      { dayNumber: 2, title: 'Kanglak Hill Trek', activities: 'Morning cloud watching, Kanglak hill trek, traditional dinner.' }
    ],

    // Advice
    whatWentWell: 'Beautiful morning cloud view and hospitable local villagers.',
    problemsExperienced: 'Weak mobile network signal in Ruilui para.',
    costSavingTips: 'Share Chander Gari at Khagrachari bus stand to split ৳4,500 cost.',
    whatToCarry: 'Power bank, Cash, Odomos insect repellent',

    // Photos state (Drag & Drop Uploader)
    uploadedImages: [] as UploadItem[]
  });

  // Calculate totals
  const totalCost = formData.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const costPerPerson = formData.travelerCount > 0 ? Math.round(totalCost / formData.travelerCount) : totalCost;

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: sessionData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    const authorId = sessionData?.session?.user?.id || 'anon_user';

    const payload = {
      ...formData,
      totalCost,
      costPerPerson
    };

    const res = await createTripInSupabase(payload, authorId, formData.uploadedImages);

    setIsSubmitting(false);
    if (res.success) {
      alert('Congratulations! Your trip report & photos have been submitted for moderation on Ghurabo.');
      router.push('/trips');
    } else {
      alert(`Error submitting trip: ${res.error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-brand-purple font-bold text-xs inline-block">
          8-Step Publishing Wizard
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('create.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          {t('create.subtitle')}
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="flex items-center justify-between overflow-x-auto py-2 border-b border-slate-200 gap-1.5 scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all touch-target ${
              currentStep === step
                ? 'bg-brand-purple text-white font-bold shadow-sm'
                : currentStep > step
                ? 'bg-slate-100 text-slate-800'
                : 'text-slate-400 bg-slate-50'
            }`}
          >
            <span>Step {step}</span>
          </button>
        ))}
      </div>

      {/* STEP FORM CONTENT */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Step 1: Basic Trip Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trip Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dhaka to Sajek Valley: 3 Days Friends Trip under ৳5,200"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Starting Location</label>
                  <input
                    type="text"
                    value={formData.startLocationText}
                    onChange={(e) => setFormData({ ...formData, startLocationText: e.target.value })}
                    placeholder="e.g. Dhaka (Kalabagan)"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <DestinationSearchInput
                    value={formData.destinationSlug || formData.destinationInputText}
                    onChange={(selected) => {
                      setFormData({
                        ...formData,
                        destinationSlug: selected.slug,
                        destinationInputText: selected.nameEn
                      });
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value, 10) })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Number of Travelers</label>
                  <input
                    type="number"
                    value={formData.travelerCount}
                    onChange={(e) => setFormData({ ...formData, travelerCount: parseInt(e.target.value, 10) })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travel Style</label>
                  <select
                    value={formData.travelStyleSlug}
                    onChange={(e) => setFormData({ ...formData, travelStyleSlug: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  >
                    {MOCK_TRAVEL_STYLES.map((s) => (
                      <option key={s.id} value={s.slug}>{s.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ROUTES & TRANSPORT */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Bus className="w-5 h-5 text-brand-purple" />
              <span>Step 2: Transport & Routes</span>
            </h3>

            {formData.transportSegments.map((seg, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="From"
                    value={seg.fromLocation}
                    onChange={(e) => {
                      const updated = [...formData.transportSegments];
                      updated[idx].fromLocation = e.target.value;
                      setFormData({ ...formData, transportSegments: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={seg.toLocation}
                    onChange={(e) => {
                      const updated = [...formData.transportSegments];
                      updated[idx].toLocation = e.target.value;
                      setFormData({ ...formData, transportSegments: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <select
                    value={seg.transportType}
                    onChange={(e) => {
                      const updated = [...formData.transportSegments];
                      updated[idx].transportType = e.target.value;
                      setFormData({ ...formData, transportSegments: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Flight">Flight</option>
                    <option value="CNG">CNG</option>
                    <option value="Jeep">Chander Gari / Jeep</option>
                    <option value="Boat">Boat / Launch</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Cost (৳)"
                    value={seg.cost}
                    onChange={(e) => {
                      const updated = [...formData.transportSegments];
                      updated[idx].cost = Number(e.target.value);
                      setFormData({ ...formData, transportSegments: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: ACCOMMODATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Hotel className="w-5 h-5 text-brand-purple" />
              <span>Step 3: Accommodation Details</span>
            </h3>

            {formData.accommodations.map((acc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Property Name"
                    value={acc.propertyName}
                    onChange={(e) => {
                      const updated = [...formData.accommodations];
                      updated[idx].propertyName = e.target.value;
                      setFormData({ ...formData, accommodations: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={acc.location}
                    onChange={(e) => {
                      const updated = [...formData.accommodations];
                      updated[idx].location = e.target.value;
                      setFormData({ ...formData, accommodations: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Total Cost (৳)"
                    value={acc.totalCost}
                    onChange={(e) => {
                      const updated = [...formData.accommodations];
                      updated[idx].totalCost = Number(e.target.value);
                      setFormData({ ...formData, accommodations: updated });
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 4: EXPENSE BREAKDOWN */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-purple" />
              <span>Step 4: Categorized Expenses</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-brand-purple">Calculated Cost Per Person</div>
                <div className="text-2xl font-black text-slate-900 font-heading">৳{costPerPerson.toLocaleString()}</div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs font-bold text-slate-500">Group Total Spent</div>
                <div className="text-base font-black text-brand-sand font-heading">৳{totalCost.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-3">
              {formData.expenses.map((exp, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 capitalize min-w-[100px]">{exp.category}</span>
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...formData.expenses];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, expenses: updated });
                    }}
                    className="flex-1 p-2 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                  />
                  <input
                    type="number"
                    value={exp.amount}
                    onChange={(e) => {
                      const updated = [...formData.expenses];
                      updated[idx].amount = Number(e.target.value);
                      setFormData({ ...formData, expenses: updated });
                    }}
                    className="w-full sm:w-28 p-2 rounded-lg bg-white border border-slate-200 font-bold text-slate-900 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: DAILY ITINERARY */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Step 5: Daily Itinerary</h3>
            {formData.itinerary.map((day, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-xs text-brand-purple">Day {day.dayNumber} Title</div>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                />
                <textarea
                  rows={2}
                  value={day.activities}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[idx].activities = e.target.value;
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                />
              </div>
            ))}
          </div>
        )}

        {/* STEP 6: TIPS & ADVICE */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Step 6: Experience & Advice</h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">What Went Well</label>
              <textarea
                rows={2}
                value={formData.whatWentWell}
                onChange={(e) => setFormData({ ...formData, whatWentWell: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Problems Experienced</label>
              <textarea
                rows={2}
                value={formData.problemsExperienced}
                onChange={(e) => setFormData({ ...formData, problemsExperienced: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 7: PHOTOS & MULTI-IMAGE UPLOADER */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-purple" />
                <span>Step 7: Upload Trip Photos</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Drag and drop high-quality trip photos. Selected cover photo will be displayed as the main card thumbnail in public galleries.
            </p>
            <ImageUploader
              images={formData.uploadedImages}
              onChange={(updatedImages) => setFormData({ ...formData, uploadedImages: updatedImages })}
            />
          </div>
        )}

        {/* STEP 8: REVIEW & PUBLISH */}
        {currentStep === 8 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Ready to Publish Your Trip!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your post will help thousands of travelers plan authentic budget trips with real cost reports.
            </p>
          </div>
        )}

        {/* Navigation Buttons (Max 2 per mobile row) */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 flex items-center justify-center gap-1 hover:bg-slate-50 touch-target"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('create.prev')}</span>
          </button>

          {currentStep < 8 ? (
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1 hover:bg-brand-purple/90 touch-target"
            >
              <span>{t('create.next')}</span>
              <ChevronRight className="w-4 h-4 text-brand-cyan" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 touch-target"
            >
              {t('create.publish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
