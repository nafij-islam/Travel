import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { getPublishedTrips, getPopularDestinations } from '@/lib/supabase/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date().toISOString();

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/trips`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/budget-trips`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/questions`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/challenges`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Fetch Published Quality-Gated Trips from Supabase
  let tripRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedTrips = await getPublishedTrips();
    tripRoutes = publishedTrips.map((trip) => ({
      url: `${baseUrl}/trips/${trip.slug}`,
      lastModified: trip.publishedAt || now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error generating trip sitemap routes:', err);
  }

  // Destination Guides from Supabase
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const destinations = await getPopularDestinations();
    destinationRoutes = destinations.map((dest) => ({
      url: `${baseUrl}/destinations/${dest.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (err) {
    console.error('Error generating destination sitemap routes:', err);
  }

  // Curated Origin-to-Destination Routes
  const routeSlugs = [
    'dhaka-to-sajek-valley',
    'dhaka-to-coxs-bazar',
    'dhaka-to-sreemangal',
    'chittagong-to-coxs-bazar',
  ];
  const originRouteEntries: MetadataRoute.Sitemap = routeSlugs.map((slug) => ({
    url: `${baseUrl}/routes/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Curated Budget Landing Pages
  const budgetSlugs = ['under-2000', 'under-5000', 'under-10000', 'under-20000'];
  const budgetRoutes: MetadataRoute.Sitemap = budgetSlugs.map((slug) => ({
    url: `${baseUrl}/budget-trips/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...tripRoutes,
    ...destinationRoutes,
    ...originRouteEntries,
    ...budgetRoutes
  ];
}
