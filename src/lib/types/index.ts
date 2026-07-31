// Jatrio TypeScript Interfaces & Schema Definitions
export * from './database.types';

export type Locale = 'en' | 'bn';

export type UserRole =
  | 'guest'
  | 'traveler'
  | 'verified_traveler'
  | 'creator'
  | 'operator'
  | 'resort_owner'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  homeCity: string;
  preferredLanguage: Locale;
  districtsVisitedCount: number;
  tripsCount: number;
  helpfulVotesCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  badges?: string[];
  createdAt: string;
  roles?: UserRole[];
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultCurrency: string;
  language: Locale;
  theme: string;
  updatedAt: string;
}

export interface TravelStyle {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  icon: string;
  descriptionEn: string;
}

export interface Destination {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  district: string;
  division: string;
  coverImage: string;
  tripCount: number;
  avgTotalCost: number;
  avgCostPerPerson: number;
  avgDurationDays: number;
  isVerified: boolean;
}

export interface TransportSegment {
  id: string;
  fromLocation: string;
  toLocation: string;
  transportType: 'Bus' | 'Train' | 'Flight' | 'Launch' | 'CNG' | 'Jeep' | 'Car' | 'Boat' | 'Walking' | 'Other';
  operatorName?: string;
  durationHours: number;
  cost: number;
  notes?: string;
}

export interface AccommodationRecord {
  id: string;
  propertyName: string;
  location?: string;
  accommodationType: 'Hotel' | 'Resort' | 'Hostel' | 'Guest House' | 'Homestay' | 'Camping' | 'Friend/Family' | 'Other';
  nights: number;
  totalCost: number;
  costPerNight: number;
  rating: number;
  experienceNotes?: string;
  bookingUrl?: string;
}

export interface ExpenseItem {
  id: string;
  category: 'transport' | 'accommodation' | 'food' | 'activities' | 'tickets' | 'shopping' | 'guide' | 'other';
  description: string;
  amount: number;
  quantity: number;
}

export interface TripDay {
  dayNumber: number;
  title: string;
  activities: string[];
  notes?: string;
}

export interface TripCostConfirmationStats {
  stillAccurate: number;
  slightlyHigher: number;
  muchHigher: number;
  lowerPossible: number;
  lastConfirmedDate: string;
}

export interface TripImage {
  id: string;
  tripId: string;
  uploadedBy: string;
  storagePath: string;
  originalFilename: string;
  caption?: string;
  altText?: string;
  isCover: boolean;
  sortOrder: number;
  visibility: 'public' | 'private' | 'unlisted';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  fileSize: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
  previewUrl?: string;
  uploaderName?: string;
  uploaderAvatar?: string;
  destinationName?: string;
  tripTitle?: string;
  tripSlug?: string;
  tripDate?: string;
  travelStyleSlug?: string;
  reportsCount?: number;
  moderationNotes?: string;
}

export interface Trip {
  id: string;
  authorId: string;
  author: UserProfile;
  title: string;
  slug: string;
  summary: string;
  contentLanguage: Locale;
  startLocationText: string;
  destination: Destination;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travelerCount: number;
  travelStyle: TravelStyle;
  totalCost: number;
  costPerPerson: number;
  currency: string;
  coverImagePath: string;
  images: string[];
  tripImages?: TripImage[];
  transportSegments: TransportSegment[];
  accommodations: AccommodationRecord[];
  expenses: ExpenseItem[];
  itinerary: TripDay[];
  whatWentWell: string[];
  problemsExperienced: string[];
  recommendations: {
    recommendedFor: string[];
    whatToCarry: string[];
    bestTime: string;
    costSavingTips: string[];
  };
  costConfirmations: TripCostConfirmationStats;
  visibility: 'public' | 'unlisted' | 'private';
  publicationStatus: 'draft' | 'pending' | 'published' | 'rejected';
  verificationStatus: 'unverified' | 'verified';
  publishedAt: string;
  lastCostUpdatedAt: string;
  viewCount: number;
  saveCount: number;
  copyCount: number;
  questionCount: number;
}

export interface Question {
  id: string;
  author: UserProfile;
  title: string;
  slug: string;
  details: string;
  destinationName: string;
  travelStyleSlug?: string;
  budgetRange?: string;
  contentLanguage: Locale;
  helpfulVotes: number;
  answerCount: number;
  isAnswered: boolean;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  author: UserProfile;
  content: string;
  helpfulVotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface GroupTripMember {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  role: 'owner' | 'organizer' | 'member';
}

export interface GroupExpense {
  id: string;
  title: string;
  category: string;
  amount: number;
  paidByUserId: string;
  paidByUserName: string;
  splitType: 'equally' | 'exact';
  date: string;
}

export interface PackingItem {
  id: string;
  category: string;
  name: string;
  isPacked: boolean;
  assignedTo?: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  badgeIcon: string;
  category: string;
  progress: number; // 0 to 100
  isUnlocked: boolean;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  contentType: 'trip' | 'trip_image' | 'question' | 'answer' | 'comment';
  contentId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  payload?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  targetType: 'trip' | 'question' | 'answer';
  targetId: string;
  authorId: string;
  author?: UserProfile;
  content: string;
  parentId?: string;
  createdAt: string;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  badgeIcon: string;
  category: string;
  progress: number; // 0 to 100
  isUnlocked: boolean;
}
