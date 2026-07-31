-- Ghurabo Travel Platform Migration: trip_images Table & Supabase Storage Policies
-- Date: 2026-07-31

-- 1. Create trip_images table
CREATE TABLE IF NOT EXISTS public.trip_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    caption TEXT DEFAULT '',
    alt_text TEXT DEFAULT '',
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    moderation_status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    file_size INT NOT NULL DEFAULT 0,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast query filtering
CREATE INDEX IF NOT EXISTS idx_trip_images_trip_id ON public.trip_images(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_images_uploaded_by ON public.trip_images(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_trip_images_moderation ON public.trip_images(moderation_status);
CREATE INDEX IF NOT EXISTS idx_trip_images_visibility ON public.trip_images(visibility);
CREATE INDEX IF NOT EXISTS idx_trip_images_is_cover ON public.trip_images(is_cover);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.trip_images ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for trip_images table
-- Public Policy: Anyone can read approved public images from published trips
CREATE POLICY "Public approved images are viewable by everyone" 
ON public.trip_images 
FOR SELECT 
USING (
    visibility = 'public' 
    AND moderation_status = 'approved'
);

-- Owner Policy: Authenticated users can select their own images regardless of status
CREATE POLICY "Users can view their own uploaded images" 
ON public.trip_images 
FOR SELECT 
TO authenticated 
USING (auth.uid() = uploaded_by);

-- Insert Policy: Logged-in travelers can insert images for their own trips
CREATE POLICY "Users can insert images for their own trips" 
ON public.trip_images 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = uploaded_by);

-- Update Policy: Users can update captions, cover status, or sort order of their images
CREATE POLICY "Users can update their own trip images" 
ON public.trip_images 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = uploaded_by);

-- Delete Policy: Users can delete their own trip images
CREATE POLICY "Users can delete their own trip images" 
ON public.trip_images 
FOR DELETE 
TO authenticated 
USING (auth.uid() = uploaded_by);

-- Admin Moderation Policy: Admins/Moderators can select and update all images
CREATE POLICY "Admins and moderators can manage all trip images" 
ON public.trip_images 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- 5. Supabase Storage Bucket Configuration Instructions
-- Bucket name: trip-images (Public)
-- Path format: trip-images/{user_id}/{trip_id}/{filename}

-- Storage Policy: Insert allowed for authenticated uploaders
-- CREATE POLICY "Authenticated travelers can upload trip photos"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'trip-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage Policy: Public read for trip images bucket
-- CREATE POLICY "Public read for trip images"
-- ON storage.objects FOR SELECT TO public
-- USING (bucket_id = 'trip-images');
