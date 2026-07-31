# Jatrio — Security & Privacy Architecture

This document specifies data security measures, authentication policies, rate limiting, and content moderation rules for Jatrio.

---

## 1. Data Security & RLS Policies
- **Strict Tenant Separation:** Private trip plans and group expense splits are constrained via PostgreSQL Row Level Security (RLS) so only verified members can read/write data.
- **Service Role Key Protection:** The `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to server-side context and never bundled into client Next.js output.
- **Sanitization:** All markdown, user comments, advice tips, and question entries pass through HTML sanitization to prevent XSS.

---

## 2. Privacy & PII Safeguards
- **Sensitive Fields Redaction:** User phone numbers, exact residential street addresses, personal emails, and payment transaction references are strictly private and excluded from public APIs and profile views.
- **Exif Data Stripping:** Client-side image upload utility strips GPS metadata from photos before uploading to storage buckets unless explicitly tagged for location pins by the traveler.
- **Verification Storage Isolation:** Verification documents (National ID / Passport scans for Verified Traveler status) are placed in the private `verification-documents` bucket accessible only by authorized admin functions.

---

## 3. Anti-Spam & Moderation Controls
- **Content Moderation Queue:** New trip posts with external web links or high-frequency automated posts enter `pending_review` state before public indexing.
- **Report & Block System:** Users can flag inappropriate posts, stolen images, or fake budget reports. Flagged content triggers automated moderator notifications.
- **Rate Limiting:** Form submissions and Q&A entries are throttled per user session.
