# Ghurabo — Contextual Internal Linking Architecture Plan

Internal linking is crucial for programmatic SEO, page rank distribution, and user engagement across Ghurabo.

---

## 1. Contextual Link Mapping Matrix

```
[Trip Page (/trips/sajek-valley-3-days)]
  ├── Links to Destination Page (/destinations/sajek-valley)
  ├── Links to Origin Route (/routes/dhaka-to-sajek-valley)
  ├── Links to Budget Category (/budget-trips/under-5000)
  ├── Links to Author Profile (/travelers/nafij_travels)
  └── Links to Related Trips & Questions

[Destination Page (/destinations/sajek-valley)]
  ├── Links to Recent Community Trips (/trips?destination=sajek-valley)
  ├── Links to Origin Routes (/routes/dhaka-to-sajek-valley)
  ├── Links to Related Questions (/questions?destination=sajek-valley)
  └── Links to Nearby Destinations (Bandarban, Rangamati)

[Route Page (/routes/dhaka-to-sajek-valley)]
  ├── Links to Destination Guide (/destinations/sajek-valley)
  ├── Links to Budget Alternatives (/budget-trips/under-5000)
  └── Links to Trip Reports on this Route
```

---

## 2. Descriptive Anchor Text Rules

1. **Descriptive & Keyword-Rich Anchors:**
   - ✅ Good: `Sajek Valley travel guide & real costs`
   - ✅ Good: `Dhaka to Cox's Bazar bus fare & trip plan`
   - ✅ Good: `Student budget trips under ৳5,000`
   - ❌ Bad: `Click here`, `Read more`, `Link`

2. **Breadcrumb Trails:** Every sub-page includes structured breadcrumbs with exact keyword targets (`Home > Destinations > Sajek Valley > Trip Report`).
