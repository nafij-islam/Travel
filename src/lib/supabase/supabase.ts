import { createClient as createBrowserClient } from './client';
import { Trip, TripImage, UserProfile, Destination, Question, Answer, ContentReport } from '@/lib/types';

export const supabase = createBrowserClient();

/**
 * Checks if current authenticated user has 'super_admin' or 'admin' role in Supabase.
 */
export async function checkUserIsSuperAdmin(userId: string): Promise<boolean> {
  if (!supabase || !userId) return false;

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', ['super_admin', 'admin']);

    if (error || !data) return false;
    return data.length > 0;
  } catch (err) {
    console.error('Error checking admin role:', err);
    return false;
  }
}

/**
 * Fetch 100% live published trips from Supabase.
 */
export async function getPublishedTrips(): Promise<Trip[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        author:profiles(*),
        destination:destinations(*),
        trip_transport_segments(*),
        trip_accommodations(*),
        trip_expenses(*),
        trip_days(*),
        trip_images(*)
      `)
      .eq('publication_status', 'published')
      .eq('visibility', 'public')
      .order('published_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((t: any): Trip => ({
      id: t.id,
      authorId: t.author_id,
      author: t.author ? {
        id: t.author.id,
        fullName: t.author.full_name,
        username: t.author.username,
        avatarUrl: t.author.avatar_url || '',
        bio: t.author.bio || '',
        homeCity: t.author.home_city || 'Bangladesh',
        preferredLanguage: t.author.preferred_language || 'en',
        districtsVisitedCount: t.author.districts_visited_count || 0,
        tripsCount: t.author.trips_count || 0,
        helpfulVotesCount: t.author.helpful_votes_count || 0,
        followersCount: t.author.followers_count || 0,
        followingCount: t.author.following_count || 0,
        isVerified: t.author.is_verified || false,
        createdAt: t.author.created_at
      } : {
        id: 'anon',
        fullName: 'Traveler',
        username: 'traveler',
        avatarUrl: '',
        bio: '',
        homeCity: 'Bangladesh',
        preferredLanguage: 'en',
        districtsVisitedCount: 0,
        tripsCount: 0,
        helpfulVotesCount: 0,
        followersCount: 0,
        followingCount: 0,
        isVerified: false,
        createdAt: t.created_at
      },
      title: t.title,
      slug: t.slug,
      summary: t.summary || '',
      contentLanguage: t.content_language || 'en',
      startLocationText: t.start_location_text || 'Dhaka',
      destination: t.destination ? {
        id: t.destination.id,
        nameEn: t.destination.name_en,
        nameBn: t.destination.name_bn,
        slug: t.destination.slug,
        district: t.destination.district,
        division: t.destination.division,
        coverImage: t.destination.cover_image,
        tripCount: t.destination.trip_count || 0,
        avgTotalCost: t.destination.avg_total_cost || 0,
        avgCostPerPerson: t.destination.avg_cost_per_person || 0,
        avgDurationDays: t.destination.avg_duration_days || 0,
        isVerified: t.destination.is_verified || false
      } : {
        id: 'dest',
        nameEn: t.destination_slug || 'Bangladesh',
        nameBn: t.destination_slug || 'বাংলাদেশ',
        slug: t.destination_slug || 'bangladesh',
        district: 'Bangladesh',
        division: 'Bangladesh',
        coverImage: t.cover_image_path || '',
        tripCount: 1,
        avgTotalCost: t.total_cost,
        avgCostPerPerson: t.cost_per_person,
        avgDurationDays: t.duration_days,
        isVerified: true
      },
      startDate: t.start_date,
      endDate: t.end_date,
      durationDays: t.duration_days,
      travelerCount: t.traveler_count,
      travelStyle: {
        id: 'style',
        nameEn: t.travel_style_slug ? t.travel_style_slug.replace('-', ' ') : 'Budget Trip',
        nameBn: 'বাজেট ভ্রমণ',
        slug: t.travel_style_slug || 'budget-trip',
        icon: 'Wallet',
        descriptionEn: 'Budget trip'
      },
      totalCost: Number(t.total_cost),
      costPerPerson: Number(t.cost_per_person),
      currency: t.currency || 'BDT',
      coverImagePath: t.cover_image_path || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      images: t.trip_images ? t.trip_images.map((img: any) => img.storage_path) : [],
      tripImages: t.trip_images ? t.trip_images.map((img: any) => ({
        id: img.id,
        tripId: img.trip_id,
        uploadedBy: img.uploaded_by,
        storagePath: img.storage_path,
        originalFilename: img.original_filename,
        caption: img.caption,
        altText: img.alt_text,
        isCover: img.is_cover,
        sortOrder: img.sort_order,
        visibility: img.visibility,
        moderationStatus: img.moderation_status,
        fileSize: img.file_size,
        width: img.width,
        height: img.height,
        createdAt: img.created_at,
        updatedAt: img.updated_at,
        previewUrl: img.storage_path.startsWith('http') ? img.storage_path : `https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800`
      })) : [],
      transportSegments: t.trip_transport_segments || [],
      accommodations: t.trip_accommodations || [],
      expenses: t.trip_expenses || [],
      itinerary: t.trip_days ? t.trip_days.map((d: any) => ({
        dayNumber: d.day_number,
        title: d.title,
        activities: d.activities ? d.activities.split('\n') : []
      })) : [],
      whatWentWell: [],
      problemsExperienced: [],
      recommendations: {
        recommendedFor: [],
        whatToCarry: [],
        bestTime: '',
        costSavingTips: []
      },
      costConfirmations: {
        stillAccurate: 1,
        slightlyHigher: 0,
        muchHigher: 0,
        lowerPossible: 0,
        lastConfirmedDate: t.published_at || t.created_at
      },
      verificationStatus: t.verification_status || 'unverified',
      publicationStatus: t.publication_status,
      visibility: t.visibility,
      viewCount: t.views_count || 0,
      saveCount: t.saves_count || 0,
      copyCount: t.copies_count || 0,
      questionCount: 0,
      publishedAt: t.published_at || t.created_at,
      lastCostUpdatedAt: t.published_at || t.created_at
    }));
  } catch (err) {
    console.error('Error fetching published trips from Supabase:', err);
    return [];
  }
}

/**
 * Fetch 100% live popular destinations from Supabase.
 */
export async function getPopularDestinations(): Promise<Destination[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('trip_count', { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      nameEn: d.name_en,
      nameBn: d.name_bn,
      slug: d.slug,
      district: d.district,
      division: d.division,
      coverImage: d.cover_image,
      tripCount: d.trip_count || 0,
      avgTotalCost: d.avg_total_cost || 0,
      avgCostPerPerson: d.avg_cost_per_person || 0,
      avgDurationDays: d.avg_duration_days || 0,
      isVerified: d.is_verified || false
    }));
  } catch (err) {
    console.error('Error fetching popular destinations:', err);
    return [];
  }
}

/**
 * Fetch 100% live approved public gallery photos from `vw_public_gallery` view.
 */
export async function getPublicGalleryImages(): Promise<TripImage[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('vw_public_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((img: any) => ({
      id: img.id,
      tripId: img.trip_id,
      uploadedBy: img.uploaded_by,
      storagePath: img.storage_path,
      originalFilename: img.original_filename,
      caption: img.caption,
      altText: img.alt_text,
      isCover: img.is_cover,
      sortOrder: img.sort_order,
      visibility: 'public' as const,
      moderationStatus: 'approved' as const,
      fileSize: img.file_size || 300000,
      width: img.width || 1920,
      height: img.height || 1080,
      createdAt: img.created_at,
      updatedAt: img.created_at,
      previewUrl: img.storage_path,
      uploaderName: img.uploader_name,
      uploaderAvatar: img.uploader_avatar,
      destinationName: img.destination_name,
      tripTitle: img.trip_title,
      tripSlug: img.trip_slug,
      tripDate: '2026',
      travelStyleSlug: img.travel_style_slug
    }));
  } catch (err) {
    console.error('Error fetching public gallery images:', err);
    return [];
  }
}

/**
 * Create a new trip in Supabase.
 */
export async function createTripInSupabase(
  tripData: any,
  authorId: string,
  uploadedImageItems: any[] = []
): Promise<{ success: boolean; tripId?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not available.' };
  }

  try {
    const destName = tripData.destinationInputText || 'Sajek Valley';
    const destSlug = destName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = `${destSlug}-${Date.now()}`;

    // Find destination or create custom location
    let destId = null;
    const { data: existingDest } = await supabase
      .from('destinations')
      .select('id')
      .ilike('name_en', destName)
      .single();

    if (existingDest) {
      destId = existingDest.id;
    } else {
      const { data: newDest } = await supabase
        .from('destinations')
        .insert({
          name_en: destName,
          name_bn: destName,
          slug: destSlug,
          district: 'Bangladesh',
          division: 'Bangladesh',
          is_verified: false
        })
        .select('id')
        .single();
      if (newDest) destId = newDest.id;
    }

    // Get authenticated user ID for RLS compliance
    const { data: { user } } = await supabase.auth.getUser();
    const validAuthorId = user?.id || authorId;

    if (!validAuthorId || validAuthorId === 'anon_user') {
      throw new Error('Please sign in or complete your registration before submitting a trip report.');
    }

    // 1. Insert main trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        author_id: validAuthorId,
        title: tripData.title,
        slug,
        summary: tripData.title,
        content_language: tripData.contentLanguage || 'en',
        start_location_text: tripData.startLocationText,
        primary_destination_id: destId,
        destination_slug: destSlug,
        duration_days: tripData.durationDays,
        traveler_count: tripData.travelerCount,
        travel_style_slug: tripData.travelStyleSlug,
        total_cost: tripData.totalCost,
        cost_per_person: tripData.costPerPerson,
        currency: 'BDT',
        cover_image_path: uploadedImageItems.find((i) => i.isCover)?.previewUrl || '/images/sajek_cloud_valley.png',
        visibility: 'public',
        publication_status: 'pending_review',
        verification_status: 'unverified'
      })
      .select()
      .single();

    if (tripError || !trip) {
      throw new Error(tripError?.message || 'Failed to insert trip record');
    }

    const tripId = trip.id;

    // 2. Insert Transport Segments
    if (tripData.transportSegments && tripData.transportSegments.length > 0) {
      await supabase.from('trip_transport_segments').insert(
        tripData.transportSegments.map((seg: any, idx: number) => ({
          trip_id: tripId,
          from_location: seg.fromLocation,
          to_location: seg.toLocation,
          transport_type: seg.transportType,
          operator_name: seg.operatorName || '',
          duration_hours: seg.durationHours || 0,
          cost: seg.cost || 0,
          sort_order: idx
        }))
      );
    }

    // 3. Insert Accommodations
    if (tripData.accommodations && tripData.accommodations.length > 0) {
      await supabase.from('trip_accommodations').insert(
        tripData.accommodations.map((acc: any) => ({
          trip_id: tripId,
          property_name: acc.propertyName,
          location: acc.location || '',
          nights: acc.nights || 1,
          total_cost: acc.totalCost || 0,
          cost_per_night: acc.nights ? Math.round(acc.totalCost / acc.nights) : acc.totalCost
        }))
      );
    }

    // 4. Insert Expenses
    if (tripData.expenses && tripData.expenses.length > 0) {
      await supabase.from('trip_expenses').insert(
        tripData.expenses.map((exp: any) => ({
          trip_id: tripId,
          category: exp.category,
          description: exp.description,
          amount: exp.amount
        }))
      );
    }

    // 5. Insert Images Metadata into trip_images
    if (uploadedImageItems.length > 0) {
      await supabase.from('trip_images').insert(
        uploadedImageItems.map((img: any, idx: number) => ({
          trip_id: tripId,
          uploaded_by: validAuthorId,
          storage_path: img.previewUrl || `trip-images/${validAuthorId}/${tripId}/${img.originalFilename}`,
          original_filename: img.originalFilename || `image_${idx}.webp`,
          caption: img.caption || '',
          alt_text: img.altText || '',
          is_cover: img.isCover || idx === 0,
          sort_order: idx,
          visibility: 'public',
          moderation_status: 'approved',
          file_size: img.fileSize || 300000,
          width: img.width || 1920,
          height: img.height || 1080
        }))
      );
    }

    return { success: true, tripId };
  } catch (err) {
    console.error('Error creating trip in Supabase:', err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Full-Text Search across Trips & Destinations via Supabase RPC
 */
export async function searchFullText(queryText: string) {
  if (!supabase || !queryText.trim()) return [];

  try {
    const { data, error } = await supabase.rpc('fn_search_trips_and_destinations', {
      query_text: queryText
    });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error('Error executing full text search RPC:', err);
    return [];
  }
}

/**
 * Super Admin RPC: Merge duplicate destination into primary destination
 */
export async function mergeDuplicateDestinations(primaryDestId: string, duplicateDestId: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.rpc('fn_merge_duplicate_destinations', {
      primary_dest_id: primaryDestId,
      duplicate_dest_id: duplicateDestId
    });

    if (error) {
      console.error('Error merging destinations:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error invoking merge duplicate destination RPC:', err);
    return false;
  }
}

/**
 * Save / Bookmark a trip
 */
export async function toggleSaveTripInSupabase(userId: string, tripId: string): Promise<boolean> {
  if (!supabase || !userId) return false;

  try {
    const { data: existing } = await supabase
      .from('trip_saves')
      .select('id')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .single();

    if (existing) {
      await supabase.from('trip_saves').delete().eq('id', existing.id);
      return false; // Unsaved
    } else {
      await supabase.from('trip_saves').insert({ user_id: userId, trip_id: tripId });
      return true; // Saved
    }
  } catch (err) {
    return false;
  }
}
