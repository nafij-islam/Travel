# Ghurabo — SEO Implementation & Quality Checklist

This checklist tracks technical execution for **Ghurabo**.

---

## 1. Technical & Infrastructure SEO Checklist
- [x] Configure brand metadata base: `https://ghurabo.app`
- [x] Rebrand header, title templates, and tags to **Ghurabo**
- [x] Implement Next.js App Router Metadata API with fallback values
- [x] Create `app/robots.ts` with disallow rules for `/admin`, `/dashboard`, `/trips/create`
- [x] Create `app/sitemap.ts` generating dynamic sitemaps for trips, destinations, routes, budget pages, questions, and profiles
- [x] Add dynamic Open Graph metadata and Twitter Cards across all public pages
- [x] Implement canonical URL generation and `hreflang` tags (`en`, `bn`, `x-default`)

---

## 2. Programmatic Route & Budget Landing Pages Checklist
- [x] Build origin-to-destination route landing pages (`/routes/[slug]`) with community cost aggregation
- [x] Build curated budget landing pages (`/budget-trips/[slug]`) for ৳2,000, ৳5,000, ৳10,000, ৳20,000 tiers
- [x] Ensure cost labels read "Based on community-reported traveler experiences"
- [x] Implement quality gating (`is_indexable`) so incomplete trips remain `noindex`

---

## 3. Structured Data (JSON-LD) Checklist
- [x] Implement `WebSite` & `Organization` schema on Homepage
- [x] Implement `Article` / `BlogPosting` schema on Trip detail pages
- [x] Implement `Place` & `ItemList` schema on Destination pages
- [x] Implement `QAPage` schema on Community Question pages
- [x] Implement `ProfilePage` & `Person` schema on Public Traveler Profile pages
- [x] Implement `BreadcrumbList` schema across all sub-pages

---

## 4. Performance & Core Web Vitals Checklist
- [x] Configure Google Fonts (`Manrope`, `Inter`, `Noto Sans Bengali`) using `next/font/google` for zero CLS
- [x] Apply standard `<ImageWithFallback>` with WebP image fallbacks and `unoptimized={true}`
- [x] Ensure zero hydration errors and clean production build

---

## 5. SEO Governance & Admin Dashboard Checklist
- [x] Build SEO Admin Dashboard (`/admin/seo`) displaying site indexability stats, sitemap health, and missing metadata warnings
- [x] Document Google Search Console and Bing Webmaster submission steps
