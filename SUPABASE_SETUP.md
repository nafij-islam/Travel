# Jatrio — Supabase Setup & Deployment Guide

This document outlines the setup steps for Supabase database migrations, Row Level Security policies, storage bucket configurations, and seed script execution for Jatrio.

---

## 1. Required Supabase Environment Variables

Create `.env.local` in your root folder:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

*Note: If environment variables are missing or unconfigured, Jatrio automatically operates in **Demo/Mock Data Mode** with fully interactive capabilities.*

---

## 2. Storage Buckets Configuration

Create the following storage buckets in the Supabase Dashboard (`Storage` -> `New Bucket`):

| Bucket Name | Public Access | Allowed MIME Types | Max Size | Description |
| :--- | :--- | :--- | :--- | :--- |
| `avatars` | **Public** | `image/jpeg, image/png, image/webp` | 2 MB | User profile avatars |
| `trip-covers` | **Public** | `image/jpeg, image/png, image/webp` | 5 MB | Main trip cover images |
| `trip-gallery` | **Public** | `image/jpeg, image/png, image/webp` | 5 MB | Additional trip photo galleries |
| `question-images`| **Public** | `image/jpeg, image/png, image/webp` | 5 MB | Q&A post attachments |
| `answer-images`  | **Public** | `image/jpeg, image/png, image/webp` | 5 MB | Q&A response attachments |
| `generated-posters`| **Public**| `image/png, image/webp` | 5 MB | Canvas generated social posters |
| `verification-documents`| **Private**| `image/jpeg, image/png, application/pdf` | 10 MB | ID verification docs |

---

## 3. Database Migration Execution

Run migrations located in `supabase/migrations/` using Supabase CLI or SQL Editor:

```bash
npx supabase db reset
```

Or apply `supabase/migrations/20260731000000_initial_schema.sql` directly inside your Supabase SQL Editor.
