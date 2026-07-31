# Ghurabo — Structured Data (JSON-LD) Architecture Plan

Ghurabo implements Schema.org JSON-LD structured data to earn Google Rich Results (Breadcrumbs, Articles, Q&A snippets, Sitelinks Search Box, Profile Cards, and Place Guides).

---

## 1. Schema Specifications by Page Type

### 1.1 Homepage (`/`)
- **`WebSite`**: Includes `name`, `url: 'https://ghurabo.app'`, and `potentialAction` (`SearchAction`) for Sitelinks Search Box.
- **`Organization`**: Brand name **Ghurabo**, logo URL (`https://ghurabo.app/images/logo.png`), tagline, and official links.
- **`WebPage`**: Primary entry point metadata.

### 1.2 Trip Detail Page (`/trips/[slug]`)
- **`Article` / `BlogPosting`**:
  - `headline`: Trip title
  - `description`: Summary of itinerary and costs
  - `image`: Cover image URL
  - `author`: `Person` object (`name`, `url`)
  - `publisher`: `Organization` (Ghurabo)
  - `datePublished`: `publishedAt` timestamp
  - `dateModified`: `lastCostUpdatedAt` / `updatedAt` timestamp
  - `mainEntityOfPage`: Canonical URL
- **`BreadcrumbList`**: Home → Trips → `{Destination}` → `{Trip Title}`

### 1.3 Destination Guide Page (`/destinations/[slug]`)
- **`Place`**:
  - `name`: Destination name (e.g. Sajek Valley)
  - `description`: Tourist destination overview & travel guide
  - `image`: Cover image URL
  - `containedInPlace`: District / Division name
- **`ItemList`**: Carousel list of top community trip reports for this destination.
- **`BreadcrumbList`**: Home → Destinations → `{Destination}`

### 1.4 Community Question Detail Page (`/questions/[slug]`)
- **`QAPage`**:
  - `mainEntity`: `Question`
    - `name`: Question title
    - `text`: Detailed inquiry
    - `answerCount`: Number of answers
    - `author`: `Person`
    - `dateCreated`: `createdAt` timestamp
    - `suggestedAnswer`: Array of community traveler answers

### 1.5 Traveler Public Profile Page (`/travelers/[username]`)
- **`ProfilePage`**:
  - `mainEntity`: `Person`
    - `name`: Traveler full name
    - `alternateName`: `@username`
    - `description`: Bio
    - `image`: Avatar URL
    - `homeLocation`: Home city
    - `knowsAbout`: Visited districts count and travel styles

---

## 2. Validation & Compliance Rule

- **Strict Content Alignment:** All schema properties (costs, dates, authors, ratings, answer counts) **must strictly match visible page content**.
- **No Invented Ratings:** If a trip has no aggregate user reviews, `aggregateRating` is omitted to comply with Google Rich Results guidelines.
