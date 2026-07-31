// Jatrio TypeScript Interfaces & Schema Definitions

export type Locale = 'en' | 'bn';

export type UserRole =
  | 'guest'
  | 'traveler'
  | 'verified_traveler'
  | 'creator'
  | 'operator'
  | 'resort_owner'
  | 'moderator'
  | 'admin';

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
  badges: string[];
  createdAt: string;
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
