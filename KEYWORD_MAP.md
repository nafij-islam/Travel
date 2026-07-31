# Ghurabo — Keyword Architecture & Target URL Map

This map defines the strategic keyword distribution across **Ghurabo**, covering core English search queries, core Bangla queries, and dynamic user-generated content templates.

---

## 1. Core Platform Keyword Map

| Primary Keyword (EN) | Primary Keyword (BN) | Target Route URL | Target H1 Heading | Target Meta Title |
| :--- | :--- | :--- | :--- | :--- |
| Bangladesh travel guide | বাংলাদেশ ভ্রমণ গাইড | `/` | Plan Better with Real Travel Experiences | Ghurabo — Real Trip Costs & Travel Experiences in Bangladesh |
| Bangladesh trip cost | ভ্রমণ খরচ | `/trips` | All Community Travel Reports & Real Costs | Real Travel Experiences & Itemized Costs | Ghurabo |
| Places to visit in Bangladesh | বাংলাদেশে দর্শনীয় স্থান | `/destinations` | Trending Travel Destinations | Popular Travel Destinations & Cost Guides \| Ghurabo |
| Budget travel Bangladesh | কম খরচে ভ্রমণ | `/budget-trips` | Search Trips by Budget Tiers | Bangladesh Budget Travel Guides & Cost Plans \| Ghurabo |
| Student budget trips Bangladesh | ছাত্রদের বাজেট ট্যুর | `/budget-trips/under-5000` | Trips Under ৳5,000 | ৳5,000-এর মধ্যে বাংলাদেশে ভ্রমণ খরচ ও ট্রিপ প্ল্যান \| Ghurabo |
| Couple trips in Bangladesh | কাপল ট্যুর বাংলাদেশ | `/trips?style=couple-getaway` | Romantic Couple Getaways | Romantic Couple Trips in Bangladesh: Real Costs & Plans \| Ghurabo |
| Family trips in Bangladesh | ফ্যামিলি ট্যুর বাংলাদেশ | `/trips?style=family-holiday` | Family Holiday Plans | Family Trips in Bangladesh: Real Costs & Plans \| Ghurabo |
| Weekend trips from Dhaka | ঢাকা থেকে কম খরচে ভ্রমণ | `/routes/dhaka-to-sreemangal` | Dhaka to Sreemangal Route | Dhaka to Sreemangal: Route, Real Costs & Trip Plans \| Ghurabo |

---

## 2. Dynamic Destination Keyword Patterns

For every destination (e.g. Sajek Valley, Cox's Bazar, Sreemangal, Saint Martin's, Bandarban, Sundarbans):

### English Patterns (`/destinations/[slug]`)
- `{destination} travel guide`
- `{destination} trip cost`
- `{destination} tour plan`
- `How to go to {destination}`
- `Dhaka to {destination} travel cost`
- `{destination} budget trip`
- `{destination} cost per person`

### Bangla Patterns (`/destinations/[slug]`)
- `{destination} ভ্রমণ`
- `{destination} ভ্রমণ খরচ`
- `{destination} ভ্রমণ গাইড`
- `{destination} কীভাবে যাবেন`
- `{destination} কোথায় থাকবেন`
- `{destination} ১ দিনের ট্যুর / ২ দিনের ট্যুর প্ল্যান`
- `{destination} কম খরচে ভ্রমণ`

---

## 3. Dynamic Route Keyword Patterns (`/routes/[origin]-to-[destination]`)

- `Dhaka to Sajek Valley travel cost` -> `/routes/dhaka-to-sajek-valley`
- `Dhaka to Cox's Bazar bus fare & trip cost` -> `/routes/dhaka-to-coxs-bazar`
- `Chittagong to Cox's Bazar route plan` -> `/routes/chittagong-to-coxs-bazar`

---

## 4. Curated Budget Keyword Patterns (`/budget-trips/[tier]`)

- `৳2,000-এর নিচে একদিনের ভ্রমণ` -> `/budget-trips/under-2000`
- `৳5,000-এর নিচে ছাত্রদের বাজেট ট্যুর` -> `/budget-trips/under-5000`
- `৳10,000-এর নিচে কাপল ও ফ্যামিলি ট্যুর` -> `/budget-trips/under-10000`
- `৳20,000-এর নিচে সেন্টমার্টিন ও লাক্সারি ট্যুর` -> `/budget-trips/under-20000`
