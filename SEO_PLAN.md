# Jatrio — Programmatic SEO & Multilingual Search Strategy

This document outlines the programmatic search engine optimization (SEO) architecture for Jatrio, focusing on indexability, structured data, canonicalization, and bilingual search routing.

---

## 1. Dynamic Route Architecture

| Route Pattern | Example URL | Purpose |
| :--- | :--- | :--- |
| `/trips/[slug]` | `/trips/dhaka-to-sajek-valley-3-day-trip` | Individual user-published trip itinerary & budget report |
| `/destinations/[slug]` | `/destinations/sajek-valley` | Aggregated community insights, average costs, & trip feeds |
| `/destinations/[slug]/from/[city]` | `/destinations/sajek-valley/from/dhaka` | Route-specific programmatic landing page |
| `/budget-trips/under-[amount]` | `/budget-trips/under-5000` | Budget tier programmatic landing page |
| `/travel-styles/[slug]` | `/travel-styles/student-travel` | Category-specific travel styles page |
| `/questions/[slug]` | `/questions/how-to-visit-sajek-under-5000-taka` | Q&A SEO landing page |

---

## 2. Structured Data (JSON-LD Schemas)

1. **Trip / Article Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Dhaka to Sajek Valley 3-Day Trip Experience & Cost",
  "image": ["https://jatrio.app/images/sajek-cover.jpg"],
  "author": {
    "@type": "Person",
    "name": "Nafij Traveler"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Jatrio",
    "logo": { "@type": "ImageObject", "url": "https://jatrio.app/logo.png" }
  }
}
```

2. **FAQPage Schema for Q&A:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Can I visit Sajek Valley under ৳5,000?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, by taking a non-AC bus from Dhaka to Khagrachari (৳600 each way) and sharing a Chander Gari with 8–10 travelers..."
    }
  }]
}
```

---

## 3. Multilingual SEO & Alternate Links

- HTML `<link rel="alternate" hreflang="en" href="https://jatrio.app/en/trips/sajek" />`
- HTML `<link rel="alternate" hreflang="bn" href="https://jatrio.app/bn/trips/sajek" />`
- Dynamic meta title tags, descriptions, and OpenGraph tags in both English and Bangla.
