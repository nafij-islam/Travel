import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generatePlaceSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TripCard } from '@/components/trips/TripCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MOCK_DESTINATIONS, MOCK_TRIPS } from '@/lib/data/mockData';
import { Bus, MapPin, Calendar, Wallet } from 'lucide-react';

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const dest = MOCK_DESTINATIONS.find((d) => d.slug === params.slug) || MOCK_DESTINATIONS[0];
  if (!dest) {
    return { title: 'Destination Not Found | Ghurabo' };
  }

  const titleEn = `${dest.nameEn} Travel Guide, Real Trip Costs & Plans | Ghurabo`;
  const description = `Explore real traveler trip reports, total costs, hotel reviews, and transport routes for ${dest.nameEn}, ${dest.district}.`;
  const url = `${SITE_CONFIG.domain}/destinations/${dest.slug}`;
  const imageUrl = dest.coverImage.startsWith('http')
    ? dest.coverImage
    : `${SITE_CONFIG.domain}${dest.coverImage}`;

  return {
    title: titleEn,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${url}?lang=en`,
        bn: `${url}?lang=bn`,
        'x-default': url,
      },
    },
    openGraph: {
      title: titleEn,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: dest.nameEn }],
    },
  };
}

export function generateStaticParams() {
  return MOCK_DESTINATIONS.map((dest) => ({ slug: dest.slug }));
}

export default function DestinationDetailPage({ params }: DestinationPageProps) {
  const dest = MOCK_DESTINATIONS.find((d) => d.slug === params.slug) || MOCK_DESTINATIONS[0];
  if (!dest) notFound();

  const relatedTrips = MOCK_TRIPS.filter((t) => t.destination.slug === dest.slug || t.destination.id === dest.id);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Destinations', url: '/destinations' },
    { name: dest.nameEn, url: `/destinations/${dest.slug}` },
  ];

  return (
    <>
      <JsonLd data={[generatePlaceSchema(dest), generateBreadcrumbSchema(breadcrumbs)]} />

      <div className="space-y-12 pb-16">
        {/* Destination Hero */}
        <div className="relative bg-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <ImageWithFallback src={dest.coverImage} alt={dest.nameEn} fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent" />

          <div className="relative z-10 max-w-5xl mx-auto space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-brand-purple text-white font-bold text-xs uppercase tracking-wider">
              {dest.district} District · {dest.division} Division
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-white font-heading">
              {dest.nameEn} ({dest.nameBn})
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Community-generated destination insights automatically compiled from {dest.tripCount} real trip reports.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold uppercase text-slate-300">Shared Trips</div>
                <div className="text-lg font-black text-white">{dest.tripCount} Reports</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold uppercase text-slate-300">Avg Cost / Person</div>
                <div className="text-lg font-black text-brand-sand">৳{dest.avgCostPerPerson.toLocaleString()}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold uppercase text-slate-300">Avg Duration</div>
                <div className="text-lg font-black text-white">{dest.avgDurationDays} Days</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold uppercase text-slate-300">Avg Total Cost</div>
                <div className="text-lg font-black text-white">৳{dest.avgTotalCost.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trips for this Destination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 font-heading">
            Real Traveler Trips for {dest.nameEn}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(relatedTrips.length > 0 ? relatedTrips : MOCK_TRIPS).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
