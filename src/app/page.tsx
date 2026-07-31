'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { TripCard } from '@/components/trips/TripCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { JsonLd } from '@/components/seo/JsonLd';
import { ScrollFadeUp } from '@/components/animations/ScrollFadeUp';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { generateWebSiteSchema, generateOrganizationSchema } from '@/lib/seo/schemaGenerator';
import {
  MOCK_TRIPS,
  MOCK_DESTINATIONS,
  MOCK_TRAVEL_STYLES,
  MOCK_QUESTIONS,
  PUBLIC_IMAGES
} from '@/lib/data/mockData';
import {
  Search,
  Compass,
  ArrowRight,
  HelpCircle,
  PlusCircle,
  Camera,
  Bus
} from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Search state
  const [destination, setDestination] = useState('');
  const [startingCity, setStartingCity] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (destination) query.set('destination', destination);
    if (startingCity) query.set('startingCity', startingCity);
    if (maxBudget) query.set('maxBudget', maxBudget);
    if (travelStyle) query.set('style', travelStyle);
    router.push(`/trips?${query.toString()}`);
  };

  // 4 Featured Hero Images
  const HERO_IMAGES = [
    { title: 'Sajek Valley', district: 'Rangamati', costText: '৳5,200 / person', src: '/images/sajek_cloud_valley.png' },
    { title: 'Cox\'s Bazar', district: 'Beach', costText: '৳6,000 / person', src: '/images/coxs_bazar_beach.png' },
    { title: 'Sreemangal', district: 'Sylhet', costText: '৳4,000 / person', src: '/images/sreemangal_tea_garden.png' },
    { title: 'Saint Martin\'s', district: 'Island', costText: '৳4,500 / person', src: '/images/saint_martins_island.png' }
  ];

  return (
    <>
      <JsonLd data={[generateWebSiteSchema(), generateOrganizationSchema()]} />

      <div className="space-y-16 pb-16">
        {/* HERO SECTION */}
        <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline */}
            <ScrollFadeUp className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-brand-purple text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 text-brand-purple" />
                <span>Real Trips · Real Costs · Real Experiences</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-heading">
                {locale === 'bn' ? (
                  <>Ghurabo — বাস্তব ভ্রমণকারীদের <span className="text-brand-purple">অভিজ্ঞতা থেকে</span> ট্রিপ প্ল্যান করুন</>
                ) : (
                  <>Ghurabo — Plan Better with <span className="text-brand-purple">Real Travel Experiences</span></>
                )}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Discover actual Bangladesh travel routes, itemized cost breakdowns, hotel reviews, and practical advice shared by real travelers in Bangladesh.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/trips"
                  className="px-6 py-3 rounded-lg bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Explore Real Trips</span>
                  <ArrowRight className="w-4 h-4 text-brand-cyan" />
                </Link>

                <Link
                  href="/trips/create"
                  className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-slate-500" />
                  <span>Share Your Trip</span>
                </Link>
              </div>
            </ScrollFadeUp>

            {/* Right Column: 4 Featured Collage Cards */}
            <div className="lg:col-span-5">
              <StaggerContainer className="grid grid-cols-2 gap-3">
                {HERO_IMAGES.map((item, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <ImageWithFallback
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                      <span className="text-[9px] font-semibold uppercase text-brand-cyan">{item.district}</span>
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </div>

          {/* HERO SEARCH BAR */}
          <ScrollFadeUp delay={0.2} className="mt-10 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 max-w-5xl mx-auto">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Sajek, Cox's Bazar"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting From</label>
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="Dhaka, Chittagong"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Budget (৳)</label>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
                >
                  <option value="">All Styles</option>
                  {MOCK_TRAVEL_STYLES.map((s) => (
                    <option key={s.id} value={s.slug}>
                      {locale === 'bn' ? s.nameBn : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </ScrollFadeUp>
        </section>

        {/* POPULAR TRIPS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeUp className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Popular Real Trips in Bangladesh</h2>
              <p className="text-xs text-slate-500 mt-0.5">Crowd-sourced trips with verified cost breakdowns</p>
            </div>
            <Link href="/trips" className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1">
              <span>View All Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </StaggerContainer>
        </section>

        {/* POPULAR TRAVEL ROUTES (SEO SECTION) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <Bus className="w-5 h-5 text-brand-purple" />
                <span>Popular Travel Routes & Bus Guides</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Community-reported transport options, fares, and travel durations</p>
            </div>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/routes/dhaka-to-sajek-valley" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-purple shadow-sm transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900">Dhaka to Sajek Valley</div>
              <div className="text-xs text-slate-500">10–11 Hrs · Non-AC / AC Bus + Chander Gari</div>
              <div className="text-xs font-semibold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>

            <Link href="/routes/dhaka-to-coxs-bazar" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-purple shadow-sm transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900">Dhaka to Cox's Bazar</div>
              <div className="text-xs text-slate-500">8–9 Hrs · Desh Travels, Green Line, Hanif</div>
              <div className="text-xs font-semibold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>

            <Link href="/routes/dhaka-to-sreemangal" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-purple shadow-sm transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900">Dhaka to Sreemangal</div>
              <div className="text-xs text-slate-500">4.5 Hrs · Kalni Express Train / Bus</div>
              <div className="text-xs font-semibold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>
          </StaggerContainer>
        </section>

        {/* GALLERY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-700" />
                <span>Travel Photo Gallery</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Authentic moments captured by community members</p>
            </div>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PUBLIC_IMAGES.slice(0, 12).map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                <ImageWithFallback
                  src={img}
                  alt={`Bangladesh travel photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </StaggerContainer>
        </section>

        {/* TRENDING DESTINATIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Trending Destinations in Bangladesh</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top visited spots in Bangladesh</p>
            </div>
            <Link href="/destinations" className="text-xs font-semibold text-brand-purple hover:underline">
              All Destinations →
            </Link>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_DESTINATIONS.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-slate-200 shadow-sm hover:shadow-md transition-all bg-slate-100"
              >
                <ImageWithFallback
                  src={dest.coverImage}
                  alt={`${dest.nameEn} travel guide and real trip cost`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[9px] font-bold uppercase text-brand-cyan">{dest.district}</span>
                  <h3 className="text-base font-bold text-white font-heading">
                    {locale === 'bn' ? dest.nameBn : dest.nameEn}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10 mt-1">
                    <span>{dest.tripCount} Trips</span>
                    <span className="font-semibold text-brand-sand">Avg ৳{dest.avgCostPerPerson.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </StaggerContainer>
        </section>

        {/* COMMUNITY Q&A */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Recent Community Questions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Get travel answers directly from experienced travelers</p>
            </div>
            <Link href="/questions" className="text-xs font-semibold text-brand-purple hover:underline">
              All Questions →
            </Link>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_QUESTIONS.map((q) => (
              <Link
                key={q.id}
                href={`/questions/${q.slug}`}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>{q.destinationName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{q.budgetRange}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 hover:text-brand-purple transition-colors font-heading">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{q.details}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Asked by @{q.author.username}</span>
                  <span className="font-semibold text-brand-purple">{q.answerCount} Answers</span>
                </div>
              </Link>
            ))}
          </StaggerContainer>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeUp className="bg-slate-900 rounded-2xl p-8 text-white text-center space-y-4">
            <h2 className="text-2xl font-bold font-heading">Have a Travel Experience to Share on Ghurabo?</h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Help thousands of travelers plan better by contributing your real costs, routes, and hotel reviews.
            </p>
            <div>
              <Link
                href="/trips/create"
                className="px-6 py-3 rounded-lg bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-brand-cyan" />
                <span>Publish Your Trip Report</span>
              </Link>
            </div>
          </ScrollFadeUp>
        </section>
      </div>
    </>
  );
}
