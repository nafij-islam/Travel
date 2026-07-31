export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRoleEnum =
  | 'traveler'
  | 'verified_traveler'
  | 'creator'
  | 'operator'
  | 'resort_owner'
  | 'moderator'
  | 'super_admin'

export type TripPublicationStatusEnum =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'archived'

export type TripVisibilityEnum = 'public' | 'unlisted' | 'private'

export type VerificationStatusEnum = 'unverified' | 'pending_review' | 'verified'

export type ContentTypeEnum = 'trip' | 'trip_image' | 'question' | 'answer' | 'comment'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          username: string
          avatar_url: string
          bio: string
          home_city: string
          preferred_language: string
          districts_visited_count: number
          trips_count: number
          helpful_votes_count: number
          followers_count: number
          following_count: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          username: string
          avatar_url?: string
          bio?: string
          home_city?: string
          preferred_language?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      destinations: {
        Row: {
          id: string
          name_en: string
          name_bn: string
          slug: string
          district: string
          division: string
          cover_image: string
          trip_count: number
          avg_total_cost: number
          avg_cost_per_person: number
          avg_duration_days: number
          verification_status: VerificationStatusEnum
          is_verified: boolean
          created_at: string
        }
        Insert: {
          name_en: string
          slug: string
          name_bn?: string
          district?: string
          division?: string
          cover_image?: string
          verification_status?: VerificationStatusEnum
          is_verified?: boolean
        }
        Update: Partial<Database['public']['Tables']['destinations']['Row']>
      }
      trips: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          summary: string
          content_language: string
          start_location_text: string
          primary_destination_id: string | null
          destination_slug: string
          start_date: string | null
          end_date: string | null
          duration_days: number
          traveler_count: number
          travel_style_id: string | null
          travel_style_slug: string
          total_cost: number
          cost_per_person: number
          currency: string
          cover_image_path: string
          visibility: TripVisibilityEnum
          publication_status: TripPublicationStatusEnum
          verification_status: VerificationStatusEnum
          published_at: string
          last_cost_updated_at: string
          view_count: number
          save_count: number
          copy_count: number
          question_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['trips']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count' | 'save_count' | 'copy_count' | 'question_count'>
        Update: Partial<Database['public']['Tables']['trips']['Row']>
      }
      trip_images: {
        Row: {
          id: string
          trip_id: string
          uploaded_by: string
          storage_path: string
          original_filename: string
          caption: string
          alt_text: string
          is_cover: boolean
          sort_order: number
          visibility: TripVisibilityEnum
          moderation_status: string
          file_size: number
          width: number | null
          height: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['trip_images']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['trip_images']['Row']>
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: UserRoleEnum
          granted_at: string
        }
        Insert: {
          user_id: string
          role: UserRoleEnum
        }
        Update: Partial<Database['public']['Tables']['user_roles']['Row']>
      }
    }
    Views: {
      vw_destination_stats: {
        Row: {
          id: string
          name_en: string
          name_bn: string
          slug: string
          district: string
          division: string
          cover_image: string
          is_verified: boolean
          real_trip_count: number
          avg_total_cost: number
          avg_cost_per_person: number
          avg_duration_days: number
        }
      }
      vw_public_gallery: {
        Row: {
          id: string
          trip_id: string
          uploaded_by: string
          storage_path: string
          original_filename: string
          caption: string
          alt_text: string
          is_cover: boolean
          sort_order: number
          file_size: number
          width: number | null
          height: number | null
          created_at: string
          uploader_name: string
          uploader_avatar: string
          trip_title: string
          trip_slug: string
          destination_name: string | null
          travel_style_slug: string | null
        }
      }
    }
    Functions: {
      fn_search_trips_and_destinations: {
        Args: { query_text: string }
        Returns: {
          result_type: string
          id: string
          title: string
          slug: string
          subtitle: string
          cover_image: string
        }[]
      }
      fn_merge_duplicate_destinations: {
        Args: { primary_dest_id: string; duplicate_dest_id: string }
        Returns: void
      }
    }
  }
}
