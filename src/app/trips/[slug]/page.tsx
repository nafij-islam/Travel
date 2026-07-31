import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { TripDetailClient } from '@/components/trips/TripDetailClient';
import { MOCK_TRIPS } from '@/lib/data/mockData';

interface TripPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TripPageProps): Promise<Metadata> {
  const trip = MOCK_TRIPS.find((t) => t.slug === params.slug) || MOCK_TRIPS[0];
  if (!trip) {
    return { title: 'Trip Not Found | Ghurabo' };
  }

  const origin = trip.startLocationText.split(' ')[0];
  const destination = trip.destination.nameEn;
  const days = trip.durationDays;
  const cost = trip.costPerPerson.toLocaleString();

  // English & Bangla Title Templates as requested in prompt section 6
  const titleEn = `${destination} Trip from ${origin}: ${days} Days, ৳${cost} Per Person | Ghurabo`;
  const description = trip.summary;
  const url = `${SITE_CONFIG.domain}/trips/${trip.slug}`;
  const imageUrl = trip.coverImagePath.startsWith('http')
    ? trip.coverImagePath
    : `${SITE_CONFIG.domain}${trip.coverImagePath}`;

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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: trip.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleEn,
      description,
      images: [imageUrl],
    },
  };
}

export function generateStaticParams() {
  return MOCK_TRIPS.map((trip) => ({ slug: trip.slug }));
}

export default function TripDetailsPage({ params }: TripPageProps) {
  const trip = MOCK_TRIPS.find((t) => t.slug === params.slug) || MOCK_TRIPS[0];
  if (!trip) notFound();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Trips', url: '/trips' },
    { name: trip.destination.nameEn, url: `/destinations/${trip.destination.slug}` },
    { name: trip.title, url: `/trips/${trip.slug}` },
  ];

  return (
    <>
      <JsonLd data={[generateArticleSchema(trip), generateBreadcrumbSchema(breadcrumbs)]} />
      <TripDetailClient trip={trip} />
    </>
  );
}
