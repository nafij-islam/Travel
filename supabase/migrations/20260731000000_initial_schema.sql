-- Jatrio Supabase Database Migration
-- Version: 1.0.0
-- Initial Schema, Extensions, Tables, Indexes, Triggers, and Row Level Security (RLS)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
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

-- 3. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL DEFAULT 'traveler',
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 4. Travel Styles Table
CREATE TABLE IF NOT EXISTS public.travel_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_bn TEXT,
  slug TEXT UNIQUE NOT NULL,
  district TEXT NOT NULL,
  division TEXT NOT NULL,
  cover_image TEXT,
  trip_count INT DEFAULT 0,
  avg_total_cost NUMERIC DEFAULT 0,
  avg_cost_per_person NUMERIC DEFAULT 0,
  avg_duration_days NUMERIC DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content_language VARCHAR(5) DEFAULT 'en',
  start_location_text TEXT NOT NULL,
  primary_destination_id UUID REFERENCES public.destinations(id),
  start_date DATE,
  end_date DATE,
  duration_days INT NOT NULL DEFAULT 1,
  traveler_count INT NOT NULL DEFAULT 1,
  travel_style_id UUID REFERENCES public.travel_styles(id),
  total_cost NUMERIC NOT NULL DEFAULT 0,
  cost_per_person NUMERIC NOT NULL DEFAULT 0,
  currency VARCHAR(5) DEFAULT 'BDT',
  cover_image_path TEXT,
  visibility VARCHAR(20) DEFAULT 'public',
  publication_status VARCHAR(20) DEFAULT 'published',
  verification_status VARCHAR(20) DEFAULT 'unverified',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  last_cost_updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  copy_count INT DEFAULT 0,
  question_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Transport Segments Table
CREATE TABLE IF NOT EXISTS public.trip_transport_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  transport_type VARCHAR(50) NOT NULL,
  operator_name TEXT,
  duration_hours NUMERIC,
  cost NUMERIC DEFAULT 0,
  notes TEXT,
  sort_order INT DEFAULT 0
);

-- 8. Accommodations Table
CREATE TABLE IF NOT EXISTS public.trip_accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  property_name TEXT NOT NULL,
  location TEXT,
  accommodation_type VARCHAR(50),
  nights INT DEFAULT 1,
  total_cost NUMERIC DEFAULT 0,
  cost_per_night NUMERIC DEFAULT 0,
  rating NUMERIC(2,1),
  experience_notes TEXT,
  booking_url TEXT
);

-- 9. Trip Expenses Table
CREATE TABLE IF NOT EXISTS public.trip_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  quantity INT DEFAULT 1
);

-- 10. Trip Days Table
CREATE TABLE IF NOT EXISTS public.trip_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT,
  activities TEXT,
  notes TEXT
);

-- 11. Trip Images Table
CREATE TABLE IF NOT EXISTS public.trip_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- 12. Trip Cost Confirmations
CREATE TABLE IF NOT EXISTS public.trip_cost_confirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- 13. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  details TEXT,
  destination_id UUID REFERENCES public.destinations(id),
  travel_style_id UUID REFERENCES public.travel_styles(id),
  content_language VARCHAR(5) DEFAULT 'en',
  helpful_votes INT DEFAULT 0,
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Answers Table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  helpful_votes INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_transport_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- 16. RLS Policies
-- Profiles: Public read, private update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trips: Public read published trips, author manage own
CREATE POLICY "Published trips are viewable by everyone" ON public.trips FOR SELECT USING (publication_status = 'published' AND visibility = 'public');
CREATE POLICY "Users can create own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = author_id);

-- Questions & Answers: Public read, authenticated create
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Users can create questions" ON public.questions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Answers are viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Users can create answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = author_id);
