import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generateProfileSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TripCard } from '@/components/trips/TripCard';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { MOCK_USERS, MOCK_TRIPS } from '@/lib/data/mockData';
import { CheckCircle2 } from 'lucide-react';

interface TravelerPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: TravelerPageProps): Promise<Metadata> {
  const user = MOCK_USERS.find((u) => u.username === params.username) || MOCK_USERS[0];
  if (!user) {
    return { title: 'Traveler Not Found | Ghurabo' };
  }

  const title = `${user.fullName} (@${user.username}) — Trips, Costs & Travel Experiences | Ghurabo`;
  const description = `${user.fullName} is a traveler on Ghurabo based in ${user.homeCity}. Explore ${user.fullName}'s published trip reports, itemized cost breakdowns, and travel advice.`;
  const url = `${SITE_CONFIG.domain}/travelers/${user.username}`;

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
      images: [{ url: user.avatarUrl, width: 400, height: 400, alt: user.fullName }],
    },
  };
}

export function generateStaticParams() {
  return MOCK_USERS.map((user) => ({ username: user.username }));
}

export default function TravelerProfilePage({ params }: TravelerPageProps) {
  const user = MOCK_USERS.find((u) => u.username === params.username) || MOCK_USERS[0];
  if (!user) notFound();

  const userTrips = MOCK_TRIPS.filter((t) => t.author.username === user.username || t.authorId === user.id);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travelers', url: '/travelers' },
    { name: user.fullName, url: `/travelers/${user.username}` },
  ];

  return (
    <>
      <JsonLd data={[generateProfileSchema(user), generateBreadcrumbSchema(breadcrumbs)]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ImageWithFallback
              src={user.avatarUrl}
              alt={user.fullName}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-brand-purple shadow-sm shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2 font-heading">
                {user.fullName}
                {user.isVerified && <CheckCircle2 className="w-5 h-5 text-brand-green" />}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">@{user.username} · Based in {user.homeCity}</p>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{user.bio}</p>

              <div className="flex flex-wrap gap-2 pt-1">
                {user.badges.map((b, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-brand-cyan/40 text-slate-800 font-bold text-[10px] border border-brand-cyan/60">
                    🏆 {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs">
            <div>
              <div className="text-xl font-black text-slate-900">{user.tripsCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Trips Shared</div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{user.districtsVisitedCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Districts Visited</div>
            </div>
            <div>
              <div className="text-xl font-black text-brand-purple">{user.helpfulVotesCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Helpful Votes</div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{user.followersCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Followers</div>
            </div>
          </div>
        </div>

        {/* User's Published Trips */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 font-heading">Published Trips by {user.fullName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(userTrips.length > 0 ? userTrips : MOCK_TRIPS).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
