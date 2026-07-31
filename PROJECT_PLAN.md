# Jatrio — Project Plan & Requirements Specification

## 1. Executive Summary
**Jatrio** is a bilingual (English & Bangla), user-generated travel experience and trip-cost-sharing platform targeting real travelers, budget planners, and travel communities. Starting with Bangladesh as its launch market, Jatrio provides crowd-sourced, authentic travel itineraries, actual cost breakdowns, transport routes, accommodation reviews, and real-time community Q&A.

**Taglines:**
- Primary: *Real Trips. Real Costs. Real Stories.*
- Secondary: *Plan better with real travel experiences shared by real travelers.*
- Bangla: *বাস্তব ট্রিপ, বাস্তব খরচ, বাস্তব অভিজ্ঞতা।*

---

## 2. Core Functional Requirements

### 2.1 Bilingual Core (English & Bangla)
- Complete UI translation using locale dictionaries (`en.json`, `bn.json`).
- Language switcher available in Desktop Header, Mobile Navigation Drawer, User Dashboard Settings, and Footer.
- Content language tracking (`content_language`: `en` | `bn`) for user-submitted posts.

### 2.2 Trip Sharing Workflow
- Multi-step trip publishing form:
  1. **Basic Info:** Title, start location, primary destination, dates, duration, travelers count, travel style, content language.
  2. **Route & Transport:** Multi-segment transport routes (Bus, Train, Flight, CNG, Boat, etc.), costs, duration, operator names.
  3. **Accommodation:** Property name, check-in/out, cost per night, total cost, rating, experience, booking link.
  4. **Expense Breakdown:** Categorized expenses (Transport, Stay, Food, Activities, Tickets, Shopping, Guide, Other) with instant per-person and daily calculations.
  5. **Daily Itinerary:** Detailed day-by-day activities, places, transport, and notes.
  6. **Experience & Advice:** What went well, problems experienced, cost-saving tips, recommendations, suitable traveler types.
  7. **Gallery:** Cover photo selection, multi-photo gallery upload, captions.
  8. **Review & Publish:** Preview and state management (Draft, Pending, Published).

### 2.3 Trip Exploration & Search
- Global multi-parameter filter: Budget range (Under ৳2k, ৳5k, ৳10k, ৳20k), Starting City, Destination, Duration, Travelers, Travel Style, Transport, Verified Travelers.
- Dynamic URL parameter reflection for link sharing (`/trips?style=student&maxCost=5000`).

### 2.4 Trip Planning, Copying & Group Expenses
- **Copy This Trip:** Duplicate any published itinerary into a private editable trip plan.
- **Group Planning:** Invite trip members, member roles (Owner, Organizer, Member, Viewer).
- **Expense Tracking & Splitting:** Log trip expenses on the go, split equal/exact/percentage, calculate balances ("who owes whom").
- **Packing Checklist:** Dynamic items grouped by category with completed state checkboxes.

### 2.5 Dynamic Destination Engine
- Automatic aggregation of destination stats based on user-submitted trips.
- Calculates average cost, average cost per person, common travel styles, and top starting cities without manual admin entry.

### 2.6 Community Q&A & Trust Signals
- Q&A system for destination, budget, transport, and safety queries.
- Cost accuracy confirmation voting on trips (*Still accurate*, *Slightly higher now*, *Much higher now*, *Lower cost possible*).
- Verification badges for verified travelers and creators.

### 2.7 Shareable Trip Poster Generator
- Client-side Canvas generator producing social media artwork (Square 1:1, Story 9:16, Landscape 16:9) featuring destination, duration, cost per person, author handle, and custom QR/branding.

---

## 3. Technical Roadmap & Milestone Checklist

- [x] Phase 1: Architecture & Technical Documentation (`PROJECT_PLAN.md`, `DATABASE_SCHEMA.md`, etc.)
- [ ] Phase 2: Next.js Foundation & Design System Setup (`tailwind.config.js`, `globals.css`, i18n system, UI components)
- [ ] Phase 3: Supabase & Mock Data System Integration (Database models, seed data, storage structure)
- [ ] Phase 4: Public Core Pages (Homepage, Explore Trips, Trip Details, Destinations, Travel Styles, Q&A)
- [ ] Phase 5: Interactive Workflows (Share a Trip Wizard, Copy Trip, Trip Poster Generator)
- [ ] Phase 6: User Dashboard & Group Trip Management (Trip Planner, Expense Splitter, Packing Checklist)
- [ ] Phase 7: Admin Dashboard & Moderation System (Content review, duplicate destination merger, analytics)
- [ ] Phase 8: E2E Verification, Accessibility, SEO Audit, & Testing
