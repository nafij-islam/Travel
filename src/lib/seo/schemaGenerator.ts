import { Trip, Destination, Question, UserProfile } from '@/lib/types';
import { SITE_CONFIG } from './siteConfig';

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    description: SITE_CONFIG.description.en,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: `${SITE_CONFIG.domain}/images/logo.png`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.domain}/trips?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/images/logo.png`,
    slogan: SITE_CONFIG.tagline.en,
    sameAs: ['https://facebook.com', 'https://instagram.com'],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.domain}${item.url}`,
    })),
  };
}

export function generateArticleSchema(trip: Trip) {
  const imageUrl = trip.coverImagePath.startsWith('http')
    ? trip.coverImagePath
    : `${SITE_CONFIG.domain}${trip.coverImagePath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: trip.title,
    description: trip.summary,
    image: [imageUrl],
    datePublished: trip.publishedAt || '2026-01-01T00:00:00Z',
    dateModified: trip.lastCostUpdatedAt || trip.publishedAt || '2026-01-01T00:00:00Z',
    author: {
      '@type': 'Person',
      name: trip.author.fullName,
      url: `${SITE_CONFIG.domain}/travelers/${trip.author.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}/trips/${trip.slug}`,
    },
  };
}

export function generatePlaceSchema(destination: Destination) {
  const imageUrl = destination.coverImage.startsWith('http')
    ? destination.coverImage
    : `${SITE_CONFIG.domain}${destination.coverImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: destination.nameEn,
    alternateName: destination.nameBn,
    description: `Complete travel guide, trip plans, and real costs for ${destination.nameEn}, ${destination.district}.`,
    image: imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: destination.district,
      addressRegion: destination.division,
      addressCountry: 'BD',
    },
  };
}

export function generateQAPageSchema(question: Question) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.details,
      answerCount: question.answerCount,
      upvoteCount: question.helpfulVotes,
      dateCreated: question.createdAt,
      author: {
        '@type': 'Person',
        name: question.author.fullName,
      },
    },
  };
}

export function generateProfileSchema(user: UserProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: user.fullName,
      alternateName: `@${user.username}`,
      description: user.bio,
      image: user.avatarUrl,
      homeLocation: user.homeCity,
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WriteAction',
          userInteractionCount: user.tripsCount,
        },
      ],
    },
  };
}
