'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { TripCard } from '@/components/trips/TripCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { JsonLd } from '@/components/seo/JsonLd';
import { ScrollFadeUp } from '@/components/animations/ScrollFadeUp';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { generateWebSiteSchema, generateOrganizationSchema } from '@/lib/seo/schemaGenerator';
import { MOCK_TRAVEL_STYLES } from '@/lib/data/mockData';
import { getPublishedTrips, getPopularDestinations, getPublicGalleryImages } from '@/lib/supabase/supabase';
import { Trip, Destination, TripImage } from '@/lib/types';
import {
  Search,
  Compass,
  ArrowRight,
  HelpCircle,
  PlusCircle,
  Camera,
  Bus,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Search state
  const [destination, setDestination] = useState('');
  const [startingCity, setStartingCity] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');

  // Live Supabase States
  const [publishedTrips, setPublishedTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [galleryImages, setGalleryImages] = useState<TripImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [tripsData, destsData, galleryData] = await Promise.all([
          getPublishedTrips(),
          getPopularDestinations(),
          getPublicGalleryImages()
        ]);
        setPublishedTrips(tripsData);
        setDestinations(destsData);
        setGalleryImages(galleryData);
      } catch (err) {
        console.error('Error loading homepage live data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (destination) query.set('destination', destination);
    if (startingCity) query.set('startingCity', startingCity);
    if (maxBudget) query.set('maxBudget', maxBudget);
    if (travelStyle) query.set('style', travelStyle);
    router.push(`/trips?${query.toString()}`);
  };

  // Static Visual Banners for Category Explorer
  const HERO_IMAGES = [
    { title: 'Sajek Valley', district: 'Rangamati', costText: 'Cloud Valley', src: '/images/sajek_cloud_valley.png' },
    { title: 'Cox\'s Bazar', district: 'Beach', costText: 'Sea Beach', src: '/images/coxs_bazar_beach.png' },
    { title: 'Sreemangal', district: 'Sylhet', costText: 'Tea Gardens', src: '/images/sreemangal_tea_garden.png' },
    { title: 'Saint Martin\'s', district: 'Island', costText: 'Coral Island', src: '/images/saint_martins_island.png' }
  ];

  return (
    <>
      <JsonLd data={[generateWebSiteSchema(), generateOrganizationSchema()]} />

      <div className="space-y-16 pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-16 lg:py-24">
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <ScrollFadeUp className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-brand-cyan text-xs font-bold border border-white/15">
                <Compass className="w-3.5 h-3.5" />
                <span>Real Trips · Real Costs · Real Experiences</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-heading leading-tight">
                {locale === 'bn' ? (
                  <>বাংলাদেশের <span className="text-brand-cyan">আসল ভ্রমণের খরচ</span> ও অভিজ্ঞতা</>
                ) : (
                  <>Real Travel Costs & <span className="text-brand-cyan">Authentic Experiences</span> in Bangladesh</>
                )}
              </h1>

              <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                {locale === 'bn'
                  ? 'অন্যান্য ভ্রমণকারীদের শেয়ার করা আসল ট্রিপ রিপোর্ট, পরিবহন ভাড়া, হোটেল খরচ এবং বাস্তব অভিজ্ঞতা দেখে আপনার ট্রিপ প্ল্যান করুন।'
                  : 'Explore verified trip breakdowns, bus fares, hotel costs, and day-by-day itineraries shared by real travelers across Bangladesh.'}
              </p>
            </ScrollFadeUp>

            {/* 4 Feature Visual Banners */}
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {HERO_IMAGES.map((hero, idx) => (
                <div key={idx} className="relative group aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-800">
                  <ImageWithFallback
                    src={hero.src}
                    alt={hero.title}
                    fill
                    priority={idx < 2}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[9px] font-bold uppercase text-brand-cyan">{hero.district}</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-heading">{hero.title}</span>
                    <span className="text-[10px] text-slate-300 font-semibold">{hero.costText}</span>
                  </div>
                </div>
              ))}
            </StaggerContainer>

            {/* Search Filter Box */}
            <ScrollFadeUp className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-4xl mx-auto">
              <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Sajek, Cox's Bazar..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting City</label>
                  <input
                    type="text"
                    value={startingCity}
                    onChange={(e) => setStartingCity(e.target.value)}
                    placeholder="Dhaka, Chittagong..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Budget (৳)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="5000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Travel Style</label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
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
                    className="w-full py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </ScrollFadeUp>
          </div>
        </section>

        {/* POPULAR TRIPS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeUp className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                Popular Real Trips in Bangladesh
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Crowd-sourced travel reports with verified cost breakdowns
              </p>
            </div>
            <Link href="/trips" className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1">
              <span>View All Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollFadeUp>

          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading published trip reports...</div>
          ) : publishedTrips.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </StaggerContainer>
          ) : (
            /* Professional Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Travel Reports Published Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Be the first traveler to share an authentic trip cost report and help thousands of travelers plan better trips across Bangladesh!
              </p>
              <Link
                href="/trips/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-brand-cyan" />
                <span>Share First Trip Report</span>
              </Link>
            </div>
          )}
        </section>

        {/* POPULAR TRAVEL ROUTES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Bus className="w-5 h-5 text-brand-purple" />
                <span>Popular Travel Routes & Bus Fares</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Community-reported transport options, fares, and travel durations</p>
            </div>
          </ScrollFadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/routes/dhaka-to-sajek-valley" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-purple shadow-2xs transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">Dhaka to Sajek Valley</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">10–11 Hrs · Non-AC / AC Bus + Chander Gari</div>
              <div className="text-xs font-bold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>

            <Link href="/routes/dhaka-to-coxs-bazar" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-purple shadow-2xs transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">Dhaka to Cox's Bazar</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">8–9 Hrs · Desh Travels, Green Line, Hanif</div>
              <div className="text-xs font-bold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>

            <Link href="/routes/dhaka-to-sreemangal" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-purple shadow-2xs transition-all space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white font-heading">Dhaka to Sreemangal</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">4.5 Hrs · Kalni Express Train / Bus</div>
              <div className="text-xs font-bold text-brand-purple pt-1">View Fare & Route Guide →</div>
            </Link>
          </StaggerContainer>
        </section>

        {/* PHOTO GALLERY SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-purple" />
                <span>Travel Photo Gallery</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Authentic moments captured by community members</p>
            </div>
            <Link href="/gallery" className="text-xs font-semibold text-brand-purple hover:underline">
              All Photos →
            </Link>
          </ScrollFadeUp>

          {galleryImages.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 transform-gpu">
              {galleryImages.slice(0, 12).map((img, idx) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-100 dark:bg-slate-800 transform-gpu">
                  <ImageWithFallback
                    src={img.previewUrl || img.storagePath}
                    alt={img.altText || 'Ghurabo Travel Photo'}
                    fill
                    preset="galleryThumbnail"
                    priority={idx < 2}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 transform-gpu"
                  />
                </div>
              ))}
            </StaggerContainer>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Camera className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-800 dark:text-white font-heading">No Travel Photos Available Yet</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Photos will automatically appear here once travelers upload images with their trip reports.</p>
            </div>
          )}
        </section>

        {/* TRENDING DESTINATIONS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ScrollFadeUp className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Trending Destinations in Bangladesh</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top visited spots in Bangladesh</p>
            </div>
            <Link href="/destinations" className="text-xs font-semibold text-brand-purple hover:underline">
              All Destinations →
            </Link>
          </ScrollFadeUp>

          {destinations.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transform-gpu">
              {destinations.slice(0, 4).map((dest, idx) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all bg-slate-100 dark:bg-slate-800 transform-gpu"
                >
                  <ImageWithFallback
                    src={dest.coverImage}
                    alt={`${dest.nameEn} travel guide`}
                    fill
                    preset="destinationCard"
                    priority={idx < 2}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 transform-gpu"
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
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-800 dark:text-white font-heading">No Active Destinations Listed</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Run the Supabase SQL migration script to populate initial Bangladesh destinations.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
