import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/siteConfig';
import { MOCK_TRIPS, MOCK_DESTINATIONS, MOCK_QUESTIONS, MOCK_USERS } from '@/lib/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date().toISOString();

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/trips`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/budget-trips`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/questions`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/challenges`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Published Quality-Gated Trips
  const tripRoutes: MetadataRoute.Sitemap = MOCK_TRIPS.filter(
    (t) => t.publicationStatus === 'published' && t.visibility === 'public'
  ).map((trip) => ({
    url: `${baseUrl}/trips/${trip.slug}`,
    lastModified: trip.lastCostUpdatedAt || trip.publishedAt || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Destination Guides
  const destinationRoutes: MetadataRoute.Sitemap = MOCK_DESTINATIONS.map((dest) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

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

  // Community Questions
  const questionRoutes: MetadataRoute.Sitemap = MOCK_QUESTIONS.map((q) => ({
    url: `${baseUrl}/questions/${q.slug}`,
    lastModified: q.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Public Traveler Profiles
  const profileRoutes: MetadataRoute.Sitemap = MOCK_USERS.map((user) => ({
    url: `${baseUrl}/travelers/${user.username}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...tripRoutes,
    ...destinationRoutes,
    ...originRouteEntries,
    ...budgetRoutes,
    ...questionRoutes,
    ...profileRoutes,
  ];
}
