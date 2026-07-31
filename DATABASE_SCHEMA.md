# Jatrio — Database Schema Documentation

This document specifies the PostgreSQL database schema for Jatrio, designed for Supabase with Row Level Security (RLS), custom functions, indexes, and full-text search.

---

## 1. Core Tables & Definitions

### `profiles`
Extends `auth.users`.
- `id` (UUID, Primary Key, references `auth.users.id` ON DELETE CASCADE)
- `full_name` (TEXT, NOT NULL)
- `username` (TEXT, UNIQUE, NOT NULL)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `home_city` (TEXT)
- `preferred_language` (VARCHAR(5) DEFAULT 'en')
- `districts_visited_count` (INT DEFAULT 0)
- `trips_count` (INT DEFAULT 0)
- `helpful_votes_count` (INT DEFAULT 0)
- `followers_count` (INT DEFAULT 0)
- `following_count` (INT DEFAULT 0)
- `is_verified` (BOOLEAN DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ DEFAULT NOW())

### `user_roles`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `user_id` (UUID, FK -> `profiles.id`)
- `role` (VARCHAR(30) NOT NULL) -- 'traveler', 'verified_traveler', 'creator', 'operator', 'resort_owner', 'moderator', 'admin'
- `granted_at` (TIMESTAMPTZ DEFAULT NOW())
- UNIQUE(`user_id`, `role`)

### `destinations`
Created automatically from user trip submissions or admin verified entries.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `name_en` (TEXT, NOT NULL)
- `name_bn` (TEXT)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `district` (TEXT)
- `division` (TEXT)
- `cover_image` (TEXT)
- `trip_count` (INT DEFAULT 0)
- `avg_total_cost` (NUMERIC DEFAULT 0)
- `avg_cost_per_person` (NUMERIC DEFAULT 0)
- `avg_duration_days` (NUMERIC DEFAULT 0)
- `is_verified` (BOOLEAN DEFAULT FALSE)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())

### `destination_aliases`
Handles spelling variations and Bangla/English synonyms.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `destination_id` (UUID, FK -> `destinations.id`)
- `alias` (TEXT, NOT NULL)
- `language` (VARCHAR(5) DEFAULT 'en')

### `travel_styles`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `name_en` (TEXT, NOT NULL)
- `name_bn` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `icon` (TEXT)
- `description_en` (TEXT)

### `trips`
Main trip records.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `author_id` (UUID, FK -> `profiles.id` ON DELETE CASCADE)
- `title` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `summary` (TEXT)
- `content_language` (VARCHAR(5) DEFAULT 'en')
- `start_location_text` (TEXT, NOT NULL)
- `primary_destination_id` (UUID, FK -> `destinations.id`)
- `start_date` (DATE)
- `end_date` (DATE)
- `duration_days` (INT NOT NULL)
- `traveler_count` (INT NOT NULL DEFAULT 1)
- `travel_style_id` (UUID, FK -> `travel_styles.id`)
- `total_cost` (NUMERIC NOT NULL DEFAULT 0)
- `cost_per_person` (NUMERIC NOT NULL DEFAULT 0)
- `currency` (VARCHAR(5) DEFAULT 'BDT')
- `cover_image_path` (TEXT)
- `visibility` (VARCHAR(20) DEFAULT 'public') -- 'public', 'unlisted', 'private'
- `publication_status` (VARCHAR(20) DEFAULT 'published') -- 'draft', 'pending', 'published', 'rejected', 'archived'
- `verification_status` (VARCHAR(20) DEFAULT 'unverified')
- `published_at` (TIMESTAMPTZ DEFAULT NOW())
- `last_cost_updated_at` (TIMESTAMPTZ DEFAULT NOW())
- `view_count` (INT DEFAULT 0)
- `save_count` (INT DEFAULT 0)
- `copy_count` (INT DEFAULT 0)
- `question_count` (INT DEFAULT 0)
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ DEFAULT NOW())

### `trip_transport_segments`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `from_location` (TEXT, NOT NULL)
- `to_location` (TEXT, NOT NULL)
- `transport_type` (VARCHAR(50) NOT NULL) -- 'Bus', 'Train', 'Flight', 'Launch', 'CNG', 'Jeep', etc.
- `operator_name` (TEXT)
- `duration_hours` (NUMERIC)
- `cost` (NUMERIC DEFAULT 0)
- `notes` (TEXT)
- `sort_order` (INT DEFAULT 0)

### `trip_accommodations`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `property_name` (TEXT, NOT NULL)
- `location` (TEXT)
- `accommodation_type` (VARCHAR(50)) -- 'Hotel', 'Resort', 'Hostel', 'Homestay', 'Camping'
- `nights` (INT DEFAULT 1)
- `total_cost` (NUMERIC DEFAULT 0)
- `cost_per_night` (NUMERIC DEFAULT 0)
- `rating` (NUMERIC(2,1))
- `experience_notes` (TEXT)
- `booking_url` (TEXT)

### `trip_expenses`
Detailed itemized expense entries.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `category` (VARCHAR(50) NOT NULL) -- 'transport', 'accommodation', 'food', 'activities', 'tickets', 'shopping', 'guide', 'other'
- `description` (TEXT, NOT NULL)
- `amount` (NUMERIC NOT NULL DEFAULT 0)
- `quantity` (INT DEFAULT 1)

### `trip_days`
Itinerary breakdown.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `day_number` (INT NOT NULL)
- `title` (TEXT)
- `activities` (TEXT)
- `notes` (TEXT)

### `trip_images`
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `image_url` (TEXT, NOT NULL)
- `caption` (TEXT)
- `is_cover` (BOOLEAN DEFAULT FALSE)
- `sort_order` (INT DEFAULT 0)

### `trip_cost_confirmations`
Community votes on price accuracy.
- `id` (UUID, Primary Key DEFAULT gen_random_uuid())
- `trip_id` (UUID, FK -> `trips.id` ON DELETE CASCADE)
- `user_id` (UUID, FK -> `profiles.id`)
- `status` (VARCHAR(30) NOT NULL) -- 'still_accurate', 'slightly_higher', 'much_higher', 'lower_possible'
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- UNIQUE(`trip_id`, `user_id`)

### `questions` & `answers`
- `questions` table: `id`, `author_id`, `title`, `details`, `destination_id`, `travel_style_id`, `content_language`, `helpful_votes`, `is_answered`, `created_at`.
- `answers` table: `id`, `question_id`, `author_id`, `content`, `helpful_votes`, `is_accepted`, `created_at`.

---

## 2. Row Level Security (RLS) Policy Summary

1. **Trips:**
   - `SELECT`: Allowed for all if `publication_status = 'published'` and `visibility = 'public'`. Authors can read their own drafts/unlisted trips.
   - `INSERT`: Allowed for authenticated users.
   - `UPDATE/DELETE`: Allowed only if `auth.uid() = author_id` or user is `admin`/`moderator`.

2. **Trip Plans & Group Expenses:**
   - `SELECT/INSERT/UPDATE`: Allowed only to verified trip plan members (`auth.uid() IN (SELECT user_id FROM trip_plan_members WHERE trip_plan_id = id)`).

3. **Storage Policies:**
   - Public read for `avatars`, `trip-covers`, `trip-gallery`, `question-images`.
   - Strict authenticated write for own folder paths (`auth.uid()/*`).
