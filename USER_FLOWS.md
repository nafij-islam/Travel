# Jatrio — User Flows & Experience Architecture

This document defines core user flows, navigation hierarchies, permission matrix, and interaction design models for Jatrio.

---

## 1. Primary User Journeys

```
                    +-----------------------------+
                    |    Guest / New Traveler     |
                    +--------------+--------------+
                                   |
            +----------------------+----------------------+
            |                                             |
            v                                             v
  +------------------+                          +------------------+
  |  Browse & Search |                          | Sign Up / Log In |
  |  Real Trips &    |                          | (Email / Google) |
  |  Costs           |                          +--------+---------+
  +---------+--------+                                   |
            |                                            v
            v                                   +------------------+
  +------------------+                          | Onboarding Flow  |
  | Filter & View    |                          | Preferences &    |
  | Expense Details  |                          | Preferred City   |
  +---------+--------+                          +--------+---------+
            |                                            |
            +----------------------+---------------------+
                                   |
                                   v
                    +-----------------------------+
                    |    Authenticated Traveler   |
                    +--------------+--------------+
                                   |
       +-------------------+-------+-------+-------------------+
       |                   |               |                   |
       v                   v               v                   v
+--------------+   +---------------+ +------------+   +------------------+
| Share a Trip |   | Copy Trip &   | | Group Trip |   | Ask / Answer     |
| (8-Step Form)|   | Create Plan   | | & Expenses |   | Community Q&A    |
+--------------+   +---------------+ +------------+   +------------------+
```

---

## 2. Detailed Workflow Diagrams

### 2.1 Share a Trip Workflow (Multi-step Form)
1. **Entry Point:** Click "Share a Trip" button in Header or Dashboard.
2. **Step 1 — Basic Information:** Input title, starting location (e.g. Dhaka), destination (e.g. Sajek Valley), start date, duration, travelers count, travel style, content language.
3. **Step 2 — Transport & Routes:** Add transport segments (e.g. Dhaka -> Khagrachari by Bus, ৳600; Khagrachari -> Sajek by Chander Gari, ৳4,000). System computes total transport cost.
4. **Step 3 — Accommodation:** Add stay details (Resort name, nights, room cost, user experience rating, booking tip).
5. **Step 4 — Expense Breakdown:** Fill in food, activity, ticket, guide, and shopping costs. Live chart updates total cost and cost per person.
6. **Step 5 — Daily Itinerary:** Fill in Day 1, Day 2, Day 3 highlights, food spots, and transport.
7. **Step 6 — Advice & Warnings:** Share what went well, problems faced (e.g. bad road conditions, mobile network issues), budget tips, and recommended item lists.
8. **Step 7 — Photos & Gallery:** Upload cover photo and gallery images. Drag-and-drop ordering.
9. **Step 8 — Review & Publish:** Final summary preview. Save as Draft or Publish immediately. Generates shareable trip poster on success!

### 2.2 Copy Trip & Group Expense Flow
1. **Copy:** User views a public Sajek trip costing ৳5,200 per person -> clicks **"Copy This Trip"**.
2. **Personal Plan Created:** System generates private `/my-trips/[id]/plan` copying route, itinerary, and expense structure.
3. **Invite Members:** User generates an invite link for 3 friends.
4. **Group Expense Log:** As group travels, members record live expenses (e.g. "Dinner at Hill View Restaurant - ৳1,400 paid by Nafij").
5. **Settlement Calculator:** System calculates total spent, per-person equal share, and outputs net settlements ("Rahim owes Nafij ৳350").
