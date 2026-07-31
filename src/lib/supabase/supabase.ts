import { createClient as createBrowserClient } from './client';
import { Trip, TripImage, UserProfile, Destination, Question, Answer, ContentReport } from '@/lib/types';
import { MOCK_TRIPS, MOCK_DESTINATIONS, MOCK_USERS, MOCK_QUESTIONS } from '@/lib/data/mockData';

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
 * Fetch published trips from Supabase with fallback to mock data if empty.
 */
export async function getPublishedTrips(): Promise<Trip[]> {
  if (!supabase) return MOCK_TRIPS;

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

    if (error || !data || data.length === 0) {
      return MOCK_TRIPS;
    }

    return data.map((t: any) => ({
      id: t.id,
      authorId: t.author_id,
      author: t.author ? {
        id: t.author.id,
        fullName: t.author.full_name,
        username: t.author.username,
        avatarUrl: t.author.avatar_url,
        bio: t.author.bio,
        homeCity: t.author.home_city,
        preferredLanguage: t.author.preferred_language,
        districtsVisitedCount: t.author.districts_visited_count,
        tripsCount: t.author.trips_count,
        helpfulVotesCount: t.author.helpful_votes_count,
        followersCount: t.author.followers_count,
        followingCount: t.author.following_count,
        isVerified: t.author.is_verified,
        createdAt: t.author.created_at
      } : MOCK_USERS[0],
      title: t.title,
      slug: t.slug,
      summary: t.summary || '',
      contentLanguage: t.content_language || 'en',
      startLocationText: t.start_location_text,
      destination: t.destination ? {
        id: t.destination.id,
        nameEn: t.destination.name_en,
        nameBn: t.destination.name_bn,
        slug: t.destination.slug,
        district: t.destination.district,
        division: t.destination.division,
        coverImage: t.destination.cover_image,
        tripCount: t.destination.trip_count,
        avgTotalCost: t.destination.avg_total_cost,
        avgCostPerPerson: t.destination.avg_cost_per_person,
        avgDurationDays: t.destination.avg_duration_days,
        isVerified: t.destination.is_verified
      } : MOCK_DESTINATIONS[0],
      startDate: t.start_date,
      endDate: t.end_date,
      durationDays: t.duration_days,
      travelerCount: t.traveler_count,
      travelStyle: {
        id: 'style-1',
        nameEn: t.travel_style_slug ? t.travel_style_slug.replace('-', ' ') : 'Student Budget',
        nameBn: 'বাজেট',
        slug: t.travel_style_slug || 'student-budget',
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
        bestTime: 'October to March',
        costSavingTips: []
      },
      costConfirmations: {
        stillAccurate: 12,
        slightlyHigher: 2,
        muchHigher: 0,
        lowerPossible: 1,
        lastConfirmedDate: '2026-07-20'
      },
      visibility: t.visibility,
      publicationStatus: t.publication_status,
      verificationStatus: t.verification_status,
      publishedAt: t.published_at,
      lastCostUpdatedAt: t.last_cost_updated_at,
      viewCount: t.view_count || 0,
      saveCount: t.save_count || 0,
      copyCount: t.copy_count || 0,
      questionCount: t.question_count || 0
    }));
  } catch (err) {
    console.error('Error fetching trips from Supabase:', err);
    return MOCK_TRIPS;
  }
}

/**
 * Persist new trip post to Supabase database.
 */
export async function createTripInSupabase(
  tripData: any,
  authorId: string,
  uploadedImageItems: any[] = []
): Promise<{ success: boolean; tripId?: string; error?: string }> {
  if (!supabase) {
    return { success: true, tripId: `mock_${Date.now()}` };
  }

  try {
    const slug = `${tripData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    const destSlug = tripData.destinationSlug || 'custom-destination';
    const destName = tripData.destinationInputText || tripData.destinationSlug || 'Custom Location';

    // 0. Dynamic Destination Verification / Creation
    let destId = null;
    const { data: existingDest } = await supabase
      .from('destinations')
      .select('id')
      .eq('slug', destSlug)
      .single();

    if (existingDest) {
      destId = existingDest.id;
    } else {
      // Create new pending destination entry
      const { data: newDest } = await supabase
        .from('destinations')
        .insert({
          name_en: destName,
          slug: destSlug,
          district: 'Bangladesh',
          division: 'Bangladesh',
          is_verified: false
        })
        .select('id')
        .single();
      if (newDest) destId = newDest.id;
    }

    // 1. Insert main trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        author_id: authorId,
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
          uploaded_by: authorId,
          storage_path: img.previewUrl || `trip-images/${authorId}/${tripId}/${img.originalFilename}`,
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
