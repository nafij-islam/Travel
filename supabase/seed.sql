-- Jatrio Seed Data Script

-- Initial Travel Styles
INSERT INTO public.travel_styles (id, name_en, name_bn, slug, icon, description_en) VALUES
(uuid_generate_v4(), 'Student Budget', 'স্টুডেন্ট বাজেট', 'student-budget', 'GraduationCap', 'Low cost trips optimized for students'),
(uuid_generate_v4(), 'Family Holiday', 'ফ্যামিলি ট্যুর', 'family-holiday', 'Users', 'Comfortable family vacation plans'),
(uuid_generate_v4(), 'Couple Getaway', 'কাপল ট্যুর', 'couple-getaway', 'Heart', 'Romantic & peaceful getaways'),
(uuid_generate_v4(), 'Solo Adventure', 'একলা ভ্রমণ', 'solo-adventure', 'User', 'Independent solo exploration'),
(uuid_generate_v4(), 'Friends Trip', 'বন্ধুদের ট্যুর', 'friends-trip', 'Smile', 'Group fun & adventure with friends'),
(uuid_generate_v4(), 'Weekend Escape', 'সাপ্তাহিক ট্রিপ', 'weekend-escape', 'Calendar', 'Short 1-2 day trips'),
(uuid_generate_v4(), 'Adventure', 'এডভেঞ্চার', 'adventure', 'Compass', 'Trekking, hiking & thrill seeking'),
(uuid_generate_v4(), 'Nature & Wildlife', 'প্রকৃতি ও বন্যপ্রাণী', 'nature-wildlife', 'TreePine', 'Forests, rivers & eco-tourism'),
(uuid_generate_v4(), 'Food Trail', 'ফুড ট্রেল', 'food-trail', 'Utensils', 'Culinary & street food exploration'),
(uuid_generate_v4(), 'Road Trip', 'রোড ট্রিপ', 'road-trip', 'Car', 'Scenic highway driving trips')
ON CONFLICT (slug) DO NOTHING;

-- Initial Destinations
INSERT INTO public.destinations (id, name_en, name_bn, slug, district, division, cover_image, trip_count, avg_total_cost, avg_cost_per_person, avg_duration_days) VALUES
(uuid_generate_v4(), 'Sajek Valley', 'সাজেক ভ্যালি', 'sajek-valley', 'Rangamati', 'Chittagong', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 48, 20800, 5200, 3),
(uuid_generate_v4(), 'Cox''s Bazar', 'কক্সবাজার', 'coxs-bazar', 'Cox''s Bazar', 'Chittagong', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', 120, 24000, 6000, 4),
(uuid_generate_v4(), 'Sreemangal', 'শ্রীমঙ্গল', 'sreemangal', 'Moulvibazar', 'Sylhet', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800', 35, 12000, 4000, 2),
(uuid_generate_v4(), 'Sundarbans', 'সুন্দরবন', 'sundarbans', 'Bagerhat', 'Khulna', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 19, 32000, 8000, 3),
(uuid_generate_v4(), 'Saint Martin''s Island', 'সেন্টমার্টিন', 'saint-martins-island', 'Cox''s Bazar', 'Chittagong', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 64, 18000, 4500, 3)
ON CONFLICT (slug) DO NOTHING;
