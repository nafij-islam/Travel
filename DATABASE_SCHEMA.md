# 🗄️ Ghurabo — Production Database Schema & Performance Architecture

This document specifies the complete PostgreSQL database architecture for Ghurabo, designed for high-performance scale on Supabase. It includes 33 normalized tables, custom PostgreSQL enums, Full-Text Search (`tsvector`), database views, automated counter triggers, and Row Level Security (RLS) policies.

---

## 1. Custom PostgreSQL Enums

- **`user_role_enum`**: `'traveler'`, `'verified_traveler'`, `'creator'`, `'operator'`, `'resort_owner'`, `'moderator'`, `'super_admin'`
- **`trip_publication_status_enum`**: `'draft'`, `'pending_review'`, `'published'`, `'rejected'`, `'archived'`
- **`trip_visibility_enum`**: `'public'`, `'unlisted'`, `'private'`
- **`verification_status_enum`**: `'unverified'`, `'pending_review'`, `'verified'`
- **`content_type_enum`**: `'trip'`, `'trip_image'`, `'question'`, `'answer'`, `'comment'`

---

## 2. 33 Relational Tables Overview

| # | Table Name | Key Columns | Purpose |
| :- | :--- | :--- | :--- |
| 1 | `profiles` | `id`, `full_name`, `username`, `avatar_url`, `home_city`, `trips_count` | User profiles extending `auth.users` |
| 2 | `user_roles` | `user_id`, `role` (`user_role_enum`) | Multi-role access control |
| 3 | `user_settings` | `user_id`, `email_notifications`, `default_currency`, `theme` | Notification & UI settings |
| 4 | `user_follows` | `follower_id`, `following_id` | Social traveler follow connections |
| 5 | `user_blocks` | `blocker_id`, `blocked_id` | Safety & blocking |
| 6 | `destinations` | `id`, `name_en`, `name_bn`, `slug`, `district`, `fts` | Travel destinations with full-text search |
| 7 | `destination_aliases` | `destination_id`, `alias` | Synonym & typo mapping (e.g. "Sajek Vally" -> "Sajek Valley") |
| 8 | `travel_styles` | `id`, `name_en`, `name_bn`, `slug`, `icon` | Trip categories |
| 9 | `trips` | `id`, `author_id`, `title`, `slug`, `total_cost`, `fts` | Main travel trip reports & itineraries |
| 10 | `trip_images` | `id`, `trip_id`, `storage_path`, `is_cover`, `sort_order` | Multi-image storage metadata |
| 11 | `trip_transport_segments` | `trip_id`, `from_location`, `to_location`, `cost` | Transport leg details |
| 12 | `trip_accommodations` | `trip_id`, `property_name`, `nights`, `total_cost` | Hotel & resort records |
| 13 | `trip_days` | `trip_id`, `day_number`, `title`, `activities` | Daily itinerary headings |
| 14 | `trip_day_items` | `trip_day_id`, `time_of_day`, `cost` | Granular itinerary activities |
| 15 | `trip_expenses` | `trip_id`, `category`, `description`, `amount` | Categorized expense log |
| 16 | `trip_tips` | `trip_id`, `category`, `tip_text` | Structured experience tips |
| 17 | `trip_saves` | `user_id`, `trip_id` | User bookmarked trips |
| 18 | `trip_copies` | `user_id`, `trip_id` | Duplicated trip plans |
| 19 | `trip_views` | `trip_id`, `viewer_id`, `ip_hash` | View analytics |
| 20 | `trip_cost_confirmations` | `trip_id`, `user_id`, `status` | Price accuracy votes |
| 21 | `questions` | `id`, `author_id`, `title`, `slug`, `fts` | Travel Q&A questions |
| 22 | `answers` | `question_id`, `author_id`, `content`, `is_accepted` | Community Q&A answers |
| 23 | `comments` | `target_type`, `target_id`, `author_id`, `content` | Threaded comments |
| 24 | `group_trip_plans` | `creator_id`, `title`, `destination_name`, `target_budget` | Group trip planning workspace |
| 25 | `group_trip_members` | `group_plan_id`, `user_id`, `role` | Group plan collaborators |
| 26 | `group_expenses` | `group_plan_id`, `paid_by_id`, `amount`, `split_type` | Shared group expense splitter |
| 27 | `group_packing_items` | `group_plan_id`, `assigned_to_id`, `item_name`, `is_packed` | Collaborative packing checklist |
| 28 | `challenges` | `id`, `title_en`, `description_en`, `badge_icon` | Travel achievement badges |
| 29 | `user_achievements` | `user_id`, `challenge_id`, `progress`, `is_unlocked` | User unlocked badges |
| 30 | `notifications` | `user_id`, `type`, `title`, `message`, `is_read` | User notifications |
| 31 | `content_reports` | `reporter_id`, `content_type`, `content_id`, `reason` | Flagged content moderation queue |
| 32 | `moderation_actions` | `moderator_id`, `action_type`, `target_id`, `notes` | Admin moderation log |
| 33 | `audit_logs` | `user_id`, `action`, `entity_type`, `payload`, `ip_address` | System audit trail |

---

## 3. High-Performance Views & RPC Functions

### Database Views:
- **`vw_destination_stats`**: Pre-aggregates `real_trip_count`, `avg_total_cost`, `avg_cost_per_person`, and `avg_duration_days` without N+1 query scans.
- **`vw_public_gallery`**: Pre-joins `trip_images`, `trips`, `profiles`, and `destinations` for instant public photo gallery feeds.

### RPC Functions:
- **`fn_search_trips_and_destinations(query_text)`**: Performs PostgreSQL full-text search across trips, destinations, and Q&A entries using `tsvector` and `GIN` indexes.
- **`fn_merge_duplicate_destinations(primary_dest_id, duplicate_dest_id)`**: Super Admin RPC to safely merge typo destinations into primary records without orphan entries or broken links.

---

## 4. Automated Counter Triggers

- **`trg_user_trip_count`**: Automatically increments/decrements `trips_count` on user profiles upon inserting or deleting trips.
- **`trg_trips_fts` / `trg_destinations_fts`**: Automatically updates PostgreSQL full-text search vectors (`fts`) on insert or title modifications.
