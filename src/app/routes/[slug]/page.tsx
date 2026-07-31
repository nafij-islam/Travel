import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TripCard } from '@/components/trips/TripCard';
import { MOCK_TRIPS, MOCK_DESTINATIONS } from '@/lib/data/mockData';
import { MapPin, Bus, Calendar, Users, Wallet, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface RoutePageProps {
  params: {
    slug: string;
  };
}

const ROUTE_DATA: Record<string, { origin: string; destinationSlug: string; destinationName: string; duration: string; fareRange: string; busOperators: string[] }> = {
  'dhaka-to-sajek-valley': {
    origin: 'Dhaka',
    destinationSlug: 'sajek-valley',
    destinationName: 'Sajek Valley',
    duration: '10–11 Hours',
    fareRange: '৳700 – ৳1,200 (Bus) + ৳4,500 (Chander Gari Jeep)',
    busOperators: ['Shanti Paribahan', 'Ena Transport', 'Shyamoli NR Travels'],
  },
  'dhaka-to-coxs-bazar': {
    origin: 'Dhaka',
    destinationSlug: 'coxs-bazar',
    destinationName: "Cox's Bazar",
    duration: '8–9 Hours',
    fareRange: '৳800 – ৳2,000 (Non-AC / AC Bus)',
    busOperators: ['Desh Travels', 'Green Line', 'Hanif Enterprise', 'Saudia'],
  },
  'dhaka-to-sreemangal': {
    origin: 'Dhaka',
    destinationSlug: 'sreemangal',
    destinationName: 'Sreemangal',
    duration: '4.5 Hours',
    fareRange: '৳250 – ৳800 (Train / Bus)',
    busOperators: ['Kalni Express (Train)', 'Parabat Express', 'Hanif Bus'],
  },
  'chittagong-to-coxs-bazar': {
    origin: 'Chittagong',
    destinationSlug: 'coxs-bazar',
    destinationName: "Cox's Bazar",
    duration: '3.5–4 Hours',
    fareRange: '৳350 – ৳800 (AC / Non-AC Bus)',
    busOperators: ['Desh Travels', 'S.Alam Paribahan'],
  },
};

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const route = ROUTE_DATA[params.slug];
  if (!route) {
    return {
      title: 'Route Not Found | Ghurabo',
    };
  }

  const title = `${route.origin} to ${route.destinationName}: Route, Real Costs & Trip Plans | Ghurabo`;
  const description = `Discover community-reported travel fares, bus operators, average trip costs, and itineraries for traveling from ${route.origin} to ${route.destinationName}.`;
  const url = `${SITE_CONFIG.domain}/routes/${params.slug}`;

  return {
    title,
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
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.domain}/images/sajek_cloud_valley.png`,
          width: 1200,
          height: 630,
          alt: `${route.origin} to ${route.destinationName} Travel Route`,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(ROUTE_DATA).map((slug) => ({ slug }));
}

export default function RoutePage({ params }: RoutePageProps) {
  const route = ROUTE_DATA[params.slug];
  if (!route) notFound();

  const matchingTrips = MOCK_TRIPS.filter(
    (t) => t.destination.slug === route.destinationSlug
  );

  const destinationObj = MOCK_DESTINATIONS.find(
    (d) => d.slug === route.destinationSlug
  );

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Routes', url: '/routes' },
    { name: `${route.origin} to ${route.destinationName}`, url: `/routes/${params.slug}` },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-purple">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{route.origin} to {route.destinationName}</span>
        </nav>

        {/* Route Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-cyan/30 text-brand-purple text-xs font-semibold">
            <Bus className="w-3.5 h-3.5" />
            <span>Community Travel Route</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {route.origin} to {route.destinationName}: Route & Real Costs
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Community-reported transit guide, bus options, travel duration, and itemized trip cost reports for traveling from {route.origin} to {route.destinationName}.
          </p>

          {/* Community Disclaimer Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 max-w-2xl">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Community Disclaimer:</strong> All fare estimates and total costs are based on published traveler experiences on Ghurabo. Ticket fares and hotel prices may vary seasonally.
            </div>
          </div>
        </div>

        {/* Route Metrics Summary Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Published Reports</div>
            <div className="text-2xl font-black text-slate-900 font-heading">{matchingTrips.length} Trips</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Avg Travel Duration</div>
            <div className="text-2xl font-black text-slate-900 font-heading">{route.duration}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Bus Fare</div>
            <div className="text-sm font-bold text-brand-purple">{route.fareRange}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Avg Cost Per Person</div>
            <div className="text-2xl font-black text-brand-sand font-heading">
              ৳{destinationObj ? destinationObj.avgCostPerPerson.toLocaleString() : '5,000'}
            </div>
          </div>
        </div>

        {/* Bus Operators & Transport Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-brand-purple" />
            <span>Popular Transport Operators on this Route</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {route.busOperators.map((op, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                {op}
              </span>
            ))}
          </div>
        </div>

        {/* Real Trips on this Route */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Community Trip Reports</h2>
            <Link href={`/trips?destination=${route.destinationSlug}`} className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        {/* Route FAQ */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-sky" />
            <span>Frequently Asked Questions: {route.origin} to {route.destinationName}</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-brand-cyan text-sm">How long does it take from {route.origin} to {route.destinationName}?</div>
              <div className="text-slate-300">The journey usually takes around {route.duration} depending on road conditions and vehicle type.</div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-brand-cyan text-sm">What is the average trip cost per person?</div>
              <div className="text-slate-300">Based on published traveler reports, the average cost per person ranges around ৳{destinationObj ? destinationObj.avgCostPerPerson.toLocaleString() : '5,000'} for a 2-3 day trip.</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
