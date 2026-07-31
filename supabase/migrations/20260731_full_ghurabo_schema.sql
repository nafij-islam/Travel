-- ====================================================================
-- Ghurabo Travel Platform — Comprehensive 22-Table Schema & Security Migration
-- Date: 2026-07-31
-- ====================================================================

-- 1. PROFILES TABLE (Extends auth.users)
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
    role VARCHAR(30) NOT NULL CHECK (role IN ('traveler', 'verified_traveler', 'creator', 'operator', 'resort_owner', 'moderator', 'super_admin')),
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

-- 4. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_bn TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL,
    division TEXT NOT NULL,
    cover_image TEXT DEFAULT '',
    trip_count INT DEFAULT 0,
    avg_total_cost NUMERIC DEFAULT 0,
    avg_cost_per_person NUMERIC DEFAULT 0,
    avg_duration_days NUMERIC DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRAVEL STYLES TABLE
CREATE TABLE IF NOT EXISTS public.travel_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_bn TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Compass',
    description_en TEXT DEFAULT ''
);

-- 6. TRIPS TABLE
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
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    publication_status VARCHAR(20) DEFAULT 'pending_review' CHECK (publication_status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
    verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    last_cost_updated_at TIMESTAMPTZ DEFAULT NOW(),
    view_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    copy_count INT DEFAULT 0,
    question_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRIP IMAGES TABLE
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
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    file_size INT DEFAULT 0,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRIP TRANSPORT SEGMENTS
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

-- 9. TRIP ACCOMMODATIONS
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

-- 10. TRIP DAYS
CREATE TABLE IF NOT EXISTS public.trip_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title TEXT DEFAULT '',
    activities TEXT DEFAULT '',
    notes TEXT DEFAULT ''
);

-- 11. TRIP DAY ITEMS
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

-- 12. TRIP EXPENSES
CREATE TABLE IF NOT EXISTS public.trip_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    quantity INT DEFAULT 1
);

-- 13. TRIP TIPS
CREATE TABLE IF NOT EXISTS public.trip_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('what_went_well', 'problems_experienced', 'cost_saving_tips', 'what_to_carry')),
    tip_text TEXT NOT NULL
);

-- 14. TRIP SAVES
CREATE TABLE IF NOT EXISTS public.trip_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, trip_id)
);

-- 15. TRIP COPIES
CREATE TABLE IF NOT EXISTS public.trip_copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. QUESTIONS TABLE
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    helpful_votes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('trip', 'question', 'answer')),
    target_id UUID NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. USER FOLLOWS
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 20. NOTIFICATIONS
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

-- 21. CONTENT REPORTS
CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type VARCHAR(30) NOT NULL CHECK (content_type IN ('trip', 'trip_image', 'question', 'answer', 'comment')),
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. MODERATION ACTIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- ====================================================================
-- AUTOMATIC SIGNUP TRIGGER: Create Profile & Assign 'traveler' Role
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles
    INSERT INTO public.profiles (id, full_name, username, avatar_url, home_city, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Ghurabo Traveler'),
        COALESCE(NEW.raw_user_meta_data->>'username', 'traveler_' || SUBSTRING(NEW.id::text FROM 1 FOR 8)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
        COALESCE(NEW.raw_user_meta_data->>'home_city', 'Dhaka'),
        'en'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Assign default 'traveler' role (Never super_admin)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'traveler')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES ON ALL TABLES
-- ====================================================================

-- Enable RLS on all 22 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_transport_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_day_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check super_admin role
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_uuid AND role IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public read, owner update
CREATE POLICY "Profiles readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User Roles: Public read own roles, Super Admin manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admins manage all user roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- Destinations & Styles: Public read, Super Admin write
CREATE POLICY "Destinations readable by everyone" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Travel styles readable by everyone" ON public.travel_styles FOR SELECT USING (true);
CREATE POLICY "Super Admins manage destinations" ON public.destinations FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- Trips: Public read published & public, Authors read/update own, Super Admin manage all
CREATE POLICY "Public published trips viewable by everyone" ON public.trips FOR SELECT USING (publication_status = 'published' AND visibility = 'public');
CREATE POLICY "Authors view own trips" ON public.trips FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Logged in users insert trips" ON public.trips FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own trips" ON public.trips FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own trips" ON public.trips FOR DELETE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Super Admins manage all trips" ON public.trips FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- Trip Images: Public read approved & public, Owners insert/manage
CREATE POLICY "Approved public trip images readable by everyone" ON public.trip_images FOR SELECT USING (visibility = 'public' AND moderation_status = 'approved');
CREATE POLICY "Users view own trip images" ON public.trip_images FOR SELECT TO authenticated USING (auth.uid() = uploaded_by);
CREATE POLICY "Users insert own trip images" ON public.trip_images FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users manage own trip images" ON public.trip_images FOR UPDATE TO authenticated USING (auth.uid() = uploaded_by);
CREATE POLICY "Users delete own trip images" ON public.trip_images FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);
CREATE POLICY "Super Admins manage all trip images" ON public.trip_images FOR ALL TO authenticated USING (public.is_super_admin(auth.uid()));

-- Sub-tables (Segments, Accommodations, Days, Expenses, Tips): Inherit trip access
CREATE POLICY "Public read trip segments" ON public.trip_transport_segments FOR SELECT USING (true);
CREATE POLICY "Authors manage trip segments" ON public.trip_transport_segments FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.author_id = auth.uid()));

CREATE POLICY "Public read trip accommodations" ON public.trip_accommodations FOR SELECT USING (true);
CREATE POLICY "Authors manage trip accommodations" ON public.trip_accommodations FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.author_id = auth.uid()));

CREATE POLICY "Public read trip days" ON public.trip_days FOR SELECT USING (true);
CREATE POLICY "Authors manage trip days" ON public.trip_days FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.author_id = auth.uid()));

CREATE POLICY "Public read trip expenses" ON public.trip_expenses FOR SELECT USING (true);
CREATE POLICY "Authors manage trip expenses" ON public.trip_expenses FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.author_id = auth.uid()));

CREATE POLICY "Public read trip tips" ON public.trip_tips FOR SELECT USING (true);
CREATE POLICY "Authors manage trip tips" ON public.trip_tips FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.author_id = auth.uid()));

-- Saves & Copies
CREATE POLICY "Users manage own saves" ON public.trip_saves FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users manage own copies" ON public.trip_copies FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Questions & Answers
CREATE POLICY "Questions readable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Logged in users ask questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Answers readable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Logged in users submit answers" ON public.answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- Follows, Notifications, Reports, Audits
CREATE POLICY "Users manage own follows" ON public.user_follows FOR ALL TO authenticated USING (auth.uid() = follower_id);
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users submit content reports" ON public.content_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Super Admins view content reports" ON public.content_reports FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admins view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));
