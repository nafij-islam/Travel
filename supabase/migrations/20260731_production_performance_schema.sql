-- ====================================================================
-- Ghurabo Production Database Migration: Scalable 33-Table Schema,
-- Full-Text Search, Views, Triggers, RPC Functions & RLS Policies
-- Date: 2026-07-31
-- ====================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. POSTGRESQL ENUMS & CONSTRAINED STATUS VALUES
-- --------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE public.user_role_enum AS ENUM (
        'traveler', 'verified_traveler', 'creator', 'operator', 'resort_owner', 'moderator', 'super_admin'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.trip_publication_status_enum AS ENUM (
        'draft', 'pending_review', 'published', 'rejected', 'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.trip_visibility_enum AS ENUM (
        'public', 'unlisted', 'private'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_status_enum AS ENUM (
        'unverified', 'pending_review', 'verified'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.content_type_enum AS ENUM (
        'trip', 'trip_image', 'question', 'answer', 'comment'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- --------------------------------------------------------------------
-- 2. CORE RELATIONAL TABLES
-- --------------------------------------------------------------------

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    home_city TEXT DEFAULT 'Dhaka',
    preferred_language VARCHAR(5) DEFAULT 'en',
    districts_visited_count INT DEFAULT 0,
    trips_count INT DEFAULT 0,
    helpful_votes_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.user_role_enum NOT NULL DEFAULT 'traveler',
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    default_currency VARCHAR(5) DEFAULT 'BDT',
    language VARCHAR(5) DEFAULT 'en',
    theme VARCHAR(10) DEFAULT 'light',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 5. USER BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- 6. DESTINATIONS TABLE (with Full-Text Vector)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_bn TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL DEFAULT 'Bangladesh',
    division TEXT NOT NULL DEFAULT 'Bangladesh',
    cover_image TEXT DEFAULT '',
    trip_count INT DEFAULT 0,
    avg_total_cost NUMERIC DEFAULT 0,
    avg_cost_per_person NUMERIC DEFAULT 0,
    avg_duration_days NUMERIC DEFAULT 0,
    verification_status public.verification_status_enum DEFAULT 'verified',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    fts TSVECTOR
);

-- 7. DESTINATION ALIASES TABLE (For typos & synonyms)
CREATE TABLE IF NOT EXISTS public.destination_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    alias TEXT NOT NULL UNIQUE,
    language VARCHAR(5) DEFAULT 'en'
);

-- 8. TRAVEL STYLES TABLE
CREATE TABLE IF NOT EXISTS public.travel_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_bn TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Compass',
    description_en TEXT DEFAULT ''
);

-- 9. TRIPS TABLE (with Full-Text Vector)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT DEFAULT '',
    content_language VARCHAR(5) DEFAULT 'en',
    start_location_text TEXT NOT NULL,
    primary_destination_id UUID REFERENCES public.destinations(id),
    destination_slug TEXT DEFAULT '',
    start_date DATE,
    end_date DATE,
    duration_days INT NOT NULL DEFAULT 1,
    traveler_count INT NOT NULL DEFAULT 1,
    travel_style_id UUID REFERENCES public.travel_styles(id),
    travel_style_slug TEXT DEFAULT '',
    total_cost NUMERIC NOT NULL DEFAULT 0,
    cost_per_person NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(5) DEFAULT 'BDT',
    cover_image_path TEXT DEFAULT '',
    visibility public.trip_visibility_enum DEFAULT 'public',
    publication_status public.trip_publication_status_enum DEFAULT 'pending_review',
    verification_status public.verification_status_enum DEFAULT 'unverified',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    last_cost_updated_at TIMESTAMPTZ DEFAULT NOW(),
    view_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    copy_count INT DEFAULT 0,
    question_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    fts TSVECTOR
);

-- 10. TRIP IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.trip_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    caption TEXT DEFAULT '',
    alt_text TEXT DEFAULT '',
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    visibility public.trip_visibility_enum DEFAULT 'public',
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    file_size INT DEFAULT 0,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TRIP TRANSPORT SEGMENTS
CREATE TABLE IF NOT EXISTS public.trip_transport_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    transport_type VARCHAR(50) NOT NULL,
    operator_name TEXT DEFAULT '',
    duration_hours NUMERIC DEFAULT 0,
    cost NUMERIC DEFAULT 0,
    notes TEXT DEFAULT '',
    sort_order INT DEFAULT 0
);

-- 12. TRIP ACCOMMODATIONS
CREATE TABLE IF NOT EXISTS public.trip_accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    property_name TEXT NOT NULL,
    location TEXT DEFAULT '',
    accommodation_type VARCHAR(50) DEFAULT 'Resort',
    nights INT DEFAULT 1,
    total_cost NUMERIC DEFAULT 0,
    cost_per_night NUMERIC DEFAULT 0,
    rating NUMERIC(2,1) DEFAULT 4.5,
    experience_notes TEXT DEFAULT '',
    booking_url TEXT DEFAULT ''
);

-- 13. TRIP DAYS
CREATE TABLE IF NOT EXISTS public.trip_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title TEXT DEFAULT '',
    activities TEXT DEFAULT '',
    notes TEXT DEFAULT ''
);

-- 14. TRIP DAY ITEMS
CREATE TABLE IF NOT EXISTS public.trip_day_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time_of_day VARCHAR(20) DEFAULT 'morning',
    cost NUMERIC DEFAULT 0,
    location TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    sort_order INT DEFAULT 0
);

-- 15. TRIP EXPENSES
CREATE TABLE IF NOT EXISTS public.trip_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    quantity INT DEFAULT 1
);

-- 16. TRIP TIPS
CREATE TABLE IF NOT EXISTS public.trip_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    tip_text TEXT NOT NULL
);

-- 17. TRIP SAVES
CREATE TABLE IF NOT EXISTS public.trip_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, trip_id)
);

-- 18. TRIP COPIES
CREATE TABLE IF NOT EXISTS public.trip_copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TRIP VIEWS
CREATE TABLE IF NOT EXISTS public.trip_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip_hash TEXT DEFAULT '',
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. TRIP COST CONFIRMATIONS
CREATE TABLE IF NOT EXISTS public.trip_cost_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, user_id)
);

-- 21. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    details TEXT DEFAULT '',
    destination_name TEXT DEFAULT '',
    travel_style_slug TEXT DEFAULT '',
    budget_range TEXT DEFAULT '',
    content_language VARCHAR(5) DEFAULT 'en',
    helpful_votes INT DEFAULT 0,
    answer_count INT DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    fts TSVECTOR
);

-- 22. ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    helpful_votes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type public.content_type_enum NOT NULL DEFAULT 'trip',
    target_id UUID NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. GROUP TRIP PLANS
CREATE TABLE IF NOT EXISTS public.group_trip_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    target_budget NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planning',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. GROUP TRIP MEMBERS
CREATE TABLE IF NOT EXISTS public.group_trip_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_plan_id UUID NOT NULL REFERENCES public.group_trip_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_plan_id, user_id)
);

-- 26. GROUP EXPENSES
CREATE TABLE IF NOT EXISTS public.group_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_plan_id UUID NOT NULL REFERENCES public.group_trip_plans(id) ON DELETE CASCADE,
    paid_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    amount NUMERIC NOT NULL DEFAULT 0,
    split_type VARCHAR(20) DEFAULT 'equally',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. GROUP PACKING ITEMS
CREATE TABLE IF NOT EXISTS public.group_packing_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_plan_id UUID NOT NULL REFERENCES public.group_trip_plans(id) ON DELETE CASCADE,
    assigned_to_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category VARCHAR(50) DEFAULT 'essential',
    item_name TEXT NOT NULL,
    is_packed BOOLEAN DEFAULT FALSE
);

-- 28. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    description_bn TEXT DEFAULT '',
    badge_icon TEXT DEFAULT 'Trophy',
    category VARCHAR(50) DEFAULT 'general',
    target_count INT DEFAULT 1
);

-- 29. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    progress INT DEFAULT 0,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,
    UNIQUE(user_id, challenge_id)
);

-- 30. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT DEFAULT '',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. CONTENT REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type public.content_type_enum NOT NULL,
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. MODERATION ACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. HIGH-PERFORMANCE INDEXES
-- --------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_trips_fts ON public.trips USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_destinations_fts ON public.destinations USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_questions_fts ON public.questions USING GIN(fts);

CREATE INDEX IF NOT EXISTS idx_trips_public_published ON public.trips(publication_status, visibility, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_dest_budget ON public.trips(primary_destination_id, publication_status, total_cost);
CREATE INDEX IF NOT EXISTS idx_trip_images_gallery ON public.trip_images(visibility, moderation_status, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

-- --------------------------------------------------------------------
-- 4. DATABASE VIEWS & RPC FUNCTIONS
-- --------------------------------------------------------------------

-- View: Destination Statistics
CREATE OR REPLACE VIEW public.vw_destination_stats AS
SELECT 
    d.id,
    d.name_en,
    d.name_bn,
    d.slug,
    d.district,
    d.division,
    d.cover_image,
    d.is_verified,
    COUNT(t.id) AS real_trip_count,
    COALESCE(AVG(t.total_cost), 0) AS avg_total_cost,
    COALESCE(AVG(t.cost_per_person), 0) AS avg_cost_per_person,
    COALESCE(AVG(t.duration_days), 0) AS avg_duration_days
FROM public.destinations d
LEFT JOIN public.trips t ON t.primary_destination_id = d.id AND t.publication_status = 'published' AND t.visibility = 'public'
GROUP BY d.id;

-- View: Public Gallery Stream
CREATE OR REPLACE VIEW public.vw_public_gallery AS
SELECT 
    img.id,
    img.trip_id,
    img.uploaded_by,
    img.storage_path,
    img.original_filename,
    img.caption,
    img.alt_text,
    img.is_cover,
    img.sort_order,
    img.file_size,
    img.width,
    img.height,
    img.created_at,
    p.full_name AS uploader_name,
    p.avatar_url AS uploader_avatar,
    t.title AS trip_title,
    t.slug AS trip_slug,
    d.name_en AS destination_name,
    t.travel_style_slug
FROM public.trip_images img
JOIN public.trips t ON t.id = img.trip_id AND t.publication_status = 'published' AND t.visibility = 'public'
JOIN public.profiles p ON p.id = img.uploaded_by
LEFT JOIN public.destinations d ON d.id = t.primary_destination_id
WHERE img.visibility = 'public' AND img.moderation_status = 'approved';

-- RPC Function: Full-Text Search
CREATE OR REPLACE FUNCTION public.fn_search_trips_and_destinations(query_text TEXT)
RETURNS TABLE (
    result_type TEXT,
    id UUID,
    title TEXT,
    slug TEXT,
    subtitle TEXT,
    cover_image TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'trip'::TEXT AS result_type,
        t.id,
        t.title,
        t.slug,
        'Trip · ৳' || t.cost_per_person::TEXT || '/person' AS subtitle,
        t.cover_image_path AS cover_image
    FROM public.trips t
    WHERE t.fts @@ plainto_tsquery('english', query_text)
       OR t.title ILIKE '%' || query_text || '%'
    
    UNION ALL
    
    SELECT 
        'destination'::TEXT AS result_type,
        d.id,
        d.name_en AS title,
        d.slug,
        'Destination · ' || d.district AS subtitle,
        d.cover_image
    FROM public.destinations d
    WHERE d.fts @@ plainto_tsquery('english', query_text)
       OR d.name_en ILIKE '%' || query_text || '%'
       OR d.name_bn ILIKE '%' || query_text || '%';
END;
$$ LANGUAGE plpgsql STABLE;

-- RPC Function: Merge Duplicate Destinations
CREATE OR REPLACE FUNCTION public.fn_merge_duplicate_destinations(
    primary_dest_id UUID,
    duplicate_dest_id UUID
)
RETURNS VOID AS $$
DECLARE
    duplicate_record RECORD;
BEGIN
    SELECT * INTO duplicate_record FROM public.destinations WHERE id = duplicate_dest_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Duplicate destination not found';
    END IF;

    INSERT INTO public.destination_aliases (destination_id, alias)
    VALUES (primary_dest_id, duplicate_record.name_en)
    ON CONFLICT (alias) DO NOTHING;

    UPDATE public.trips
    SET primary_destination_id = primary_dest_id
    WHERE primary_destination_id = duplicate_dest_id;

    DELETE FROM public.destinations WHERE id = duplicate_dest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 5. AUTOMATED SIGNUP & PROFILE TRIGGER
-- --------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Insert Profile
    INSERT INTO public.profiles (id, full_name, username, home_city)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Traveler'),
        COALESCE(NEW.raw_user_meta_data->>'username', 'traveler_' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'home_city', 'Dhaka')
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insert Default Traveler Role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'traveler')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- 3. Insert User Settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- --------------------------------------------------------------------
-- 6. SEED INITIAL TRAVEL STYLES & DESTINATIONS
-- --------------------------------------------------------------------

INSERT INTO public.travel_styles (id, name_en, name_bn, slug, icon, description_en) VALUES
(uuid_generate_v4(), 'Student Budget', 'স্টুডেন্ট বাজেট', 'student-budget', 'GraduationCap', 'Low cost trips optimized for students'),
(uuid_generate_v4(), 'Family Holiday', 'ফ্যামিলি ট্যুর', 'family-holiday', 'Users', 'Comfortable family vacation plans'),
(uuid_generate_v4(), 'Couple Getaway', 'কাপল ট্যুর', 'couple-getaway', 'Heart', 'Romantic & peaceful getaways'),
(uuid_generate_v4(), 'Solo Adventure', 'একলা ভ্রমণ', 'solo-adventure', 'User', 'Independent solo exploration'),
(uuid_generate_v4(), 'Friends Trip', 'বন্ধুদের ট্যুর', 'friends-trip', 'Smile', 'Group fun & adventure with friends')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.destinations (id, name_en, name_bn, slug, district, division, cover_image, trip_count, avg_total_cost, avg_cost_per_person, avg_duration_days) VALUES
(uuid_generate_v4(), 'Sajek Valley', 'সাজেক ভ্যালি', 'sajek-valley', 'Rangamati', 'Chittagong', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 48, 20800, 5200, 3),
(uuid_generate_v4(), 'Cox''s Bazar', 'কক্সবাজার', 'coxs-bazar', 'Cox''s Bazar', 'Chittagong', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', 120, 24000, 6000, 4),
(uuid_generate_v4(), 'Sreemangal', 'শ্রীমঙ্গল', 'sreemangal', 'Moulvibazar', 'Sylhet', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800', 35, 12000, 4000, 2),
(uuid_generate_v4(), 'Sundarbans', 'সুন্দরবন', 'sundarbans', 'Bagerhat', 'Khulna', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 19, 32000, 8000, 3),
(uuid_generate_v4(), 'Saint Martin''s Island', 'সেন্টমার্টিন', 'saint-martins-island', 'Cox''s Bazar', 'Chittagong', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 64, 18000, 4500, 3)
ON CONFLICT (slug) DO NOTHING;
