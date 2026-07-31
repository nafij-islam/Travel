# Ghurabo — URL Indexation & Crawl Governance Plan

This document outlines the URL indexation guidelines for **Ghurabo** to prevent crawl waste, eliminate duplicate content indexing, and maximize Googlebot efficiency.

---

## 1. Indexable Public URLs (`index, follow`)

The following URLs are intentionally curated and optimized for search engines:

1. **Homepage:** `https://ghurabo.app/`
2. **Trips Catalog:** `https://ghurabo.app/trips`
3. **Published Public Trip Reports:** `https://ghurabo.app/trips/[slug]` (Quality gated: title, costs, itinerary present)
4. **Destinations Index & Detail Pages:** `https://ghurabo.app/destinations`, `https://ghurabo.app/destinations/[slug]`
5. **Origin-to-Destination Route Landing Pages:** `https://ghurabo.app/routes/[slug]` (Quality gated: >= 1 trip report)
6. **Curated Budget Landing Pages:** `https://ghurabo.app/budget-trips/[slug]` (`under-2000`, `under-5000`, `under-10000`, `under-20000`)
7. **Community Q&A Index & Question Detail Pages:** `https://ghurabo.app/questions`, `https://ghurabo.app/questions/[slug]`
8. **Public Traveler Profiles:** `https://ghurabo.app/travelers/[username]` (Quality gated: >= 1 trip published)
9. **Achievements & Badges Directory:** `https://ghurabo.app/challenges`

---

## 2. Non-Indexable Private & Utility URLs (`noindex, follow` / `noindex, nofollow`)

The following paths are excluded from search engine indexation to protect user privacy and prevent duplicate thin content:

1. **User Authentication & Dashboard:** `/dashboard`, `/trips/create`, `/my-trips/*` (`noindex, follow`)
2. **Administrative & SEO Control Panels:** `/admin`, `/admin/seo` (`noindex, nofollow`)
3. **Internal API Routes:** `/api/*` (`noindex, nofollow`)
4. **Draft / Pending / Private Trips:** Any trip with `publication_status !== 'published'` or `is_indexable === false` (`noindex, follow`)
5. **Arbitrary Filter & Sort Parameters:** Any URL containing `?sort=`, `?view=`, `?page=2`, `?search=` (`canonical` points to clean base URL)

---

## 3. Robots.txt Configuration (`app/robots.ts`)

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',
          '/trips/create',
          '/trips/*/edit',
          '/api/*',
          '/auth/*',
          '/*?*sort=*',
          '/*?*view=*'
        ],
      },
    ],
    sitemap: 'https://ghurabo.app/sitemap.xml',
    host: 'https://ghurabo.app',
  };
}
```
