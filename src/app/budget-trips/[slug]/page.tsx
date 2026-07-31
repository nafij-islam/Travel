import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TripCard } from '@/components/trips/TripCard';
import { MOCK_TRIPS, MOCK_DESTINATIONS } from '@/lib/data/mockData';
import { Wallet, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface BudgetTierPageProps {
  params: {
    slug: string;
  };
}

const BUDGET_TIERS: Record<string, { maxAmount: number; titleEn: string; titleBn: string; descEn: string; descBn: string }> = {
  'under-2000': {
    maxAmount: 2000,
    titleEn: 'Trips Under ৳2,000',
    titleBn: '২০২০ টাকার মধ্যে ভ্রমণ',
    descEn: 'Curated 1-day budget trips, local hiking trails, and heritage day tours under ৳2,000 per person.',
    descBn: 'জনপ্রতি ২,০০০ টাকার মধ্যে একদিনের ভ্রমণ, হাইকিং ও ঐতিহ্যবাহী স্থানের বাজেট ট্রিপ।',
  },
  'under-5000': {
    maxAmount: 5000,
    titleEn: 'Trips Under ৳5,000',
    titleBn: '৫০০০ টাকার মধ্যে ভ্রমণ',
    descEn: 'Student budget trips, 3-day Sajek Valley & Sreemangal tours under ৳5,000 per person.',
    descBn: 'জনপ্রতি ৫,০০০ টাকার মধ্যে সাজেক ভ্যালি, শ্রীমঙ্গল ও ছাত্রদের বাজেট ট্যুর প্ল্যান।',
  },
  'under-10000': {
    maxAmount: 10000,
    titleEn: 'Trips Under ৳10,000',
    titleBn: '১০০০০ টাকার মধ্যে ভ্রমণ',
    descEn: 'Comfortable family holidays, couple getaways, and resort stays under ৳10,000 per person.',
    descBn: 'জনপ্রতি ১০,০০০ টাকার মধ্যে কাপল ট্যুর, ফ্যামিলি রিসোর্ট ও উইকেন্ড ট্রিপ।',
  },
  'under-20000': {
    maxAmount: 20000,
    titleEn: 'Trips Under ৳20,000',
    titleBn: '২০০০০ টাকার মধ্যে ভ্রমণ',
    descEn: 'Premium island holidays, Saint Martin tours, and luxury staycation plans under ৳20,000 per person.',
    descBn: 'জনপ্রতি ২০,০০০ টাকার মধ্যে সেন্টমার্টিন দ্বীপ ও প্রিমিয়াম ভ্যাকেশন প্ল্যান।',
  },
};

export async function generateMetadata({ params }: BudgetTierPageProps): Promise<Metadata> {
  const tier = BUDGET_TIERS[params.slug];
  if (!tier) {
    return {
      title: 'Budget Tier Not Found | Ghurabo',
    };
  }

  const title = `৳${tier.maxAmount.toLocaleString()}-এর মধ্যে বাংলাদেশের সেরা বাস্তব ট্রিপ | Ghurabo`;
  const description = tier.descEn;
  const url = `${SITE_CONFIG.domain}/budget-trips/${params.slug}`;

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
    },
  };
}

export function generateStaticParams() {
  return Object.keys(BUDGET_TIERS).map((slug) => ({ slug }));
}

export default function BudgetTierPage({ params }: BudgetTierPageProps) {
  const tier = BUDGET_TIERS[params.slug];
  if (!tier) notFound();

  const matchingTrips = MOCK_TRIPS.filter(
    (t) => t.costPerPerson <= tier.maxAmount
  );

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Budget Trips', url: '/budget-trips' },
    { name: tier.titleEn, url: `/budget-trips/${params.slug}` },
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-purple">Home</Link>
          <span>/</span>
          <Link href="/budget-trips" className="hover:text-brand-purple">Budget Trips</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{tier.titleEn}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-cyan/30 text-brand-purple text-xs font-semibold">
            <Wallet className="w-3.5 h-3.5" />
            <span>Budget Category</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            {tier.titleBn} ({tier.titleEn})
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {tier.descEn} Real itemized budgets reported by community travelers on Ghurabo.
          </p>
        </div>

        {/* Trips Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Community Trip Reports ({matchingTrips.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        {/* Related Destinations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Top Destinations in this Budget Range</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_DESTINATIONS.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-purple text-slate-900 text-xs font-bold flex items-center justify-between"
              >
                <span>{d.nameEn}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-purple" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
