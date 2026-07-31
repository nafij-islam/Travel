# Ghurabo — Comprehensive SEO Audit Report

**Brand Name:** Ghurabo  
**English Tagline:** Real Trips. Real Costs. Real Experiences.  
**Bangla Tagline:** বাস্তব ট্রিপ, বাস্তব খরচ, বাস্তব অভিজ্ঞতা।  
**Domain / Target Base URL:** `https://ghurabo.app`  

---

## 1. Executive Summary & Audit Scope

This document provides a full Technical, Content, Programmatic, and Structural SEO Audit for **Ghurabo**, a bilingual travel community platform in Bangladesh. 

Ghurabo enables real travelers to log itemized trip costs, transport routes, stay ratings, and authentic itineraries. This audit identifies indexation gaps, structured data opportunities, performance optimizations, and programmatic keyword strategies across all public and private routes.

---

## 2. Route-by-Route Indexation & Technical Status Audit

| Route Pattern | Target Page Type | Current Index Status | Recommended Robots Directive | Canonical Strategy | Structured Data (JSON-LD) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage | Public / Indexable | `index, follow` | Self-canonical `https://ghurabo.app/` | `WebSite`, `Organization`, `WebPage` |
| `/trips` | Trips Catalog | Public / Indexable | `index, follow` | `https://ghurabo.app/trips` | `ItemList`, `BreadcrumbList` |
| `/trips/[slug]` | Trip Detail Page | Public (Quality Gated) | `index, follow` (if complete) | Self-canonical `/trips/[slug]` | `Article`, `Person`, `BreadcrumbList` |
| `/destinations` | Destinations Index | Public / Indexable | `index, follow` | `https://ghurabo.app/destinations` | `ItemList`, `BreadcrumbList` |
| `/destinations/[slug]` | Destination Guide | Public / Indexable | `index, follow` | Self-canonical `/destinations/[slug]` | `Place`, `ItemList`, `BreadcrumbList` |
| `/routes/[slug]` | Origin-to-Dest Route | Public (Quality Gated) | `index, follow` (>= 1 trip) | Self-canonical `/routes/[slug]` | `TravelAction`, `BreadcrumbList` |
| `/budget-trips` | Budget Index | Public / Indexable | `index, follow` | `https://ghurabo.app/budget-trips` | `ItemList`, `BreadcrumbList` |
| `/budget-trips/[slug]` | Curated Budget Tier | Public / Indexable | `index, follow` | Self-canonical `/budget-trips/[slug]` | `ItemList`, `BreadcrumbList` |
| `/questions` | Q&A Forum Catalog | Public / Indexable | `index, follow` | `https://ghurabo.app/questions` | `ItemList`, `BreadcrumbList` |
| `/questions/[slug]` | Question Detail | Public / Indexable | `index, follow` | Self-canonical `/questions/[slug]` | `QAPage`, `BreadcrumbList` |
| `/travelers/[username]` | Public Profile | Public (Quality Gated) | `index, follow` (if >0 trips) | Self-canonical `/travelers/[username]` | `ProfilePage`, `Person` |
| `/challenges` | Achievements | Public / Indexable | `index, follow` | `https://ghurabo.app/challenges` | `WebPage`, `BreadcrumbList` |
| `/trips/create` | Share Wizard | Private / Utility | `noindex, follow` | `https://ghurabo.app/trips/create` | None |
| `/dashboard` | User Dashboard | Private / Auth | `noindex, follow` | `https://ghurabo.app/dashboard` | None |
| `/admin` | Admin Portal | Private / Auth | `noindex, nofollow` | `https://ghurabo.app/admin` | None |
| `/admin/seo` | SEO Dashboard | Private / Auth | `noindex, nofollow` | `https://ghurabo.app/admin/seo` | None |

---

## 3. Technical SEO Findings & Audit Highlights

### 3.1 Metadata & Title Hygiene
- **Issue:** Previously hardcoded default Next.js titles lacking brand identity ("Jatrio").
- **Fix Implemented:** Rebranded entire platform to **Ghurabo** with strict title and description templates for both English and Bangla. Set `metadataBase: new URL('https://ghurabo.app')`.

### 3.2 Dynamic Routing & Faceted Navigation Crawl Waste
- **Issue:** Query parameters (e.g. `?style=family-holiday&maxBudget=5000&sort=popular`) could trigger infinite duplicate URL variations.
- **Fix Implemented:** Canonicalized faceted navigation filter pages back to primary category or target destination URLs (`/trips`). Programmatic routes only index curated paths (`/budget-trips/under-5000`, `/routes/dhaka-to-sajek-valley`).

### 3.3 Core Web Vitals & Image Optimization
- **Issue:** Dynamic cover images loaded without explicit aspect ratios or width/height hints causing layout shifts (CLS).
- **Fix Implemented:** Standardized `<ImageWithFallback>` using Next.js image loading, `unoptimized={true}` for local static assets, WebP fallbacks, and `priority={true}` for LCP hero banner image.

### 3.4 Bilingual Strategy & Hreflang Tags
- **Issue:** Lack of structured hreflang annotations for English (`/en`) and Bangla (`/bn`) content.
- **Fix Implemented:** Dynamic `alternates` metadata generating `hreflang="en"`, `hreflang="bn"`, and `hreflang="x-default"` links.

### 3.5 UGC Quality & Indexability Controls
- **Issue:** Thin, incomplete user-generated trip posts could degrade site-wide search quality.
- **Fix Implemented:** Introduced `is_indexable` logic requiring a trip to contain title, starting location, destination, total cost, expense breakdown, and duration before generating indexable metadata.
