import { Trip, Destination, UserProfile, TravelStyle, Question, Achievement } from '@/lib/types';

export const PUBLIC_IMAGES = [
  '/images/sajek_cloud_valley.png',
  '/images/coxs_bazar_beach.png',
  '/images/sreemangal_tea_garden.png',
  '/images/saint_martins_island.png',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
  '/images/river-calm-scenery.jpg',
  '/images/india-woods-hill-station-fog-coffee.jpg',
  '/images/beautiful-tropical-beach-sea.jpg',
  '/images/female-tourists.jpg'
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-1',
    fullName: 'Nafij Islam',
    username: 'nafij_travels',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Backpacker & budget trip lover. Visited 38 districts in Bangladesh.',
    homeCity: 'Dhaka',
    preferredLanguage: 'en',
    districtsVisitedCount: 38,
    tripsCount: 14,
    helpfulVotesCount: 240,
    followersCount: 1250,
    followingCount: 180,
    isVerified: true,
    badges: ['Explorer', 'Budget Expert', 'Top Contributor'],
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'user-2',
    fullName: 'Anika Rahman',
    username: 'anika_wanders',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    bio: 'Family trip planner & photographer. Exploring nature trails with my family.',
    homeCity: 'Chittagong',
    preferredLanguage: 'bn',
    districtsVisitedCount: 26,
    tripsCount: 9,
    helpfulVotesCount: 185,
    followersCount: 890,
    followingCount: 120,
    isVerified: true,
    badges: ['Family Travel Expert', 'Photographer'],
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'user-3',
    fullName: 'Tanvir Hossain',
    username: 'tanvir_adventures',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Student budget traveler. Sharing honest costs & raw adventure experiences.',
    homeCity: 'Sylhet',
    preferredLanguage: 'bn',
    districtsVisitedCount: 21,
    tripsCount: 11,
    helpfulVotesCount: 310,
    followersCount: 1420,
    followingCount: 210,
    isVerified: false,
    badges: ['Student Budget', 'Local Expert'],
    createdAt: '2025-03-01T00:00:00Z',
  }
];

export const MOCK_TRAVEL_STYLES: TravelStyle[] = [
  { id: 'style-1', nameEn: 'Student Budget', nameBn: 'স্টুডেন্ট বাজেট', slug: 'student-budget', icon: 'GraduationCap', descriptionEn: 'Low cost trips optimized for students' },
  { id: 'style-2', nameEn: 'Family Holiday', nameBn: 'ফ্যামিলি ট্যুর', slug: 'family-holiday', icon: 'Users', descriptionEn: 'Comfortable family vacation plans' },
  { id: 'style-3', nameEn: 'Couple Getaway', nameBn: 'কাপল ট্যুর', slug: 'couple-getaway', icon: 'Heart', descriptionEn: 'Romantic & peaceful getaways' },
  { id: 'style-4', nameEn: 'Solo Adventure', nameBn: 'একলা ভ্রমণ', slug: 'solo-adventure', icon: 'User', descriptionEn: 'Independent solo exploration' },
  { id: 'style-5', nameEn: 'Friends Trip', nameBn: 'বন্ধুদের ট্যুর', slug: 'friends-trip', icon: 'Smile', descriptionEn: 'Group fun & adventure with friends' },
  { id: 'style-6', nameEn: 'Weekend Escape', nameBn: 'সাপ্তাহিক ট্রিপ', slug: 'weekend-escape', icon: 'Calendar', descriptionEn: 'Short 1-2 day weekend trips' },
  { id: 'style-7', nameEn: 'Adventure', nameBn: 'এডভেঞ্চার', slug: 'compass', icon: 'Compass', descriptionEn: 'Trekking & thrill seeking' },
  { id: 'style-8', nameEn: 'Nature & Wildlife', nameBn: 'প্রকৃতি ও বন্যপ্রাণী', slug: 'nature-wildlife', icon: 'TreePine', descriptionEn: 'Forests & eco-tourism' },
  { id: 'style-9', nameEn: 'Food Trail', nameBn: 'ফুড ট্রেল', slug: 'food-trail', icon: 'Utensils', descriptionEn: 'Culinary exploration' },
  { id: 'style-10', nameEn: 'Road Trip', nameBn: 'রোড ট্রিপ', slug: 'road-trip', icon: 'Car', descriptionEn: 'Highway driving trips' }
];

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    nameEn: 'Sajek Valley',
    nameBn: 'সাজেক ভ্যালি',
    slug: 'sajek-valley',
    district: 'Rangamati',
    division: 'Chittagong',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    tripCount: 48,
    avgTotalCost: 20800,
    avgCostPerPerson: 5200,
    avgDurationDays: 3,
    isVerified: true
  },
  {
    id: 'dest-2',
    nameEn: 'Cox\'s Bazar',
    nameBn: 'কক্সবাজার',
    slug: 'coxs-bazar',
    district: 'Cox\'s Bazar',
    division: 'Chittagong',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    tripCount: 120,
    avgTotalCost: 24000,
    avgCostPerPerson: 6000,
    avgDurationDays: 4,
    isVerified: true
  },
  {
    id: 'dest-3',
    nameEn: 'Sreemangal',
    nameBn: 'শ্রীমঙ্গল',
    slug: 'sreemangal',
    district: 'Moulvibazar',
    division: 'Sylhet',
    coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
    tripCount: 35,
    avgTotalCost: 12000,
    avgCostPerPerson: 4000,
    avgDurationDays: 2,
    isVerified: true
  },
  {
    id: 'dest-4',
    nameEn: 'Sundarbans Eco Tour',
    nameBn: 'সুন্দরবন ইকো ট্যুর',
    slug: 'sundarbans',
    district: 'Bagerhat',
    division: 'Khulna',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    tripCount: 19,
    avgTotalCost: 32000,
    avgCostPerPerson: 8000,
    avgDurationDays: 3,
    isVerified: true
  },
  {
    id: 'dest-5',
    nameEn: 'Saint Martin\'s Island',
    nameBn: 'সেন্টমার্টিন দ্বীপ',
    slug: 'saint-martins-island',
    district: 'Cox\'s Bazar',
    division: 'Chittagong',
    coverImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
    tripCount: 64,
    avgTotalCost: 18000,
    avgCostPerPerson: 4500,
    avgDurationDays: 3,
    isVerified: true
  },
  {
    id: 'dest-6',
    nameEn: 'Bandarban Hills',
    nameBn: 'বান্দরবান হিলস',
    slug: 'bandarban-hills',
    district: 'Bandarban',
    division: 'Chittagong',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    tripCount: 42,
    avgTotalCost: 16000,
    avgCostPerPerson: 4000,
    avgDurationDays: 3,
    isVerified: true
  },
  {
    id: 'dest-7',
    nameEn: 'Jaflong & Bichnakandi',
    nameBn: 'জাফলং ও বিছনাকান্দি',
    slug: 'jaflong-bichnakandi',
    district: 'Sylhet',
    division: 'Sylhet',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    tripCount: 51,
    avgTotalCost: 14000,
    avgCostPerPerson: 3500,
    avgDurationDays: 2,
    isVerified: true
  },
  {
    id: 'dest-8',
    nameEn: 'Kaptai Lake & Rangamati',
    nameBn: 'কাপ্তাই লেক ও রাঙ্গামাটি',
    slug: 'kaptai-lake-rangamati',
    district: 'Rangamati',
    division: 'Chittagong',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    tripCount: 29,
    avgTotalCost: 15000,
    avgCostPerPerson: 3750,
    avgDurationDays: 2,
    isVerified: true
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    authorId: 'user-1',
    author: MOCK_USERS[0],
    title: 'Dhaka to Sajek Valley: 3 Days Friends Trip under ৳5,200',
    slug: 'dhaka-to-sajek-valley-3-days-friends-trip',
    summary: 'A complete step-by-step 3-day budget trip for 4 friends traveling from Dhaka to Sajek Valley via Khagrachari by bus and Chander Gari.',
    contentLanguage: 'en',
    startLocationText: 'Dhaka (Sayedabad / Kalabagan)',
    destination: MOCK_DESTINATIONS[0],
    startDate: '2026-06-10',
    endDate: '2026-06-13',
    durationDays: 3,
    travelerCount: 4,
    travelStyle: MOCK_TRAVEL_STYLES[4], // Friends Trip
    totalCost: 20800,
    costPerPerson: 5200,
    currency: 'BDT',
    coverImagePath: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800'
    ],
    transportSegments: [
      {
        id: 't-1',
        fromLocation: 'Dhaka (Kalabagan)',
        toLocation: 'Khagrachari Bus Stand',
        transportType: 'Bus',
        operatorName: 'Shanti Paribahan (Non-AC)',
        durationHours: 7.5,
        cost: 2800,
        notes: '৳700 per person each way.'
      },
      {
        id: 't-2',
        fromLocation: 'Khagrachari Bus Stand',
        toLocation: 'Sajek Ruilui Para',
        transportType: 'Jeep',
        operatorName: 'Chander Gari (Reserved)',
        durationHours: 3,
        cost: 4500,
        notes: 'Reserved round-trip Chander Gari for 4 people including Dighinala Army Escort.'
      }
    ],
    accommodations: [
      {
        id: 'a-1',
        propertyName: 'Meghmachang Resort',
        location: 'Ruilui Para, Sajek',
        accommodationType: 'Resort',
        nights: 2,
        totalCost: 7000,
        costPerNight: 3500,
        rating: 4.6,
        experienceNotes: 'Stunning cloud views right from the bamboo cottage balcony. Hot water available upon request.',
        bookingUrl: 'https://example.com'
      }
    ],
    expenses: [
      { id: 'e-1', category: 'transport', description: 'Dhaka - Khagrachari Bus (Round trip)', amount: 5600, quantity: 4 },
      { id: 'e-2', category: 'transport', description: 'Chander Gari Reserve (2 days)', amount: 4500, quantity: 1 },
      { id: 'e-3', category: 'accommodation', description: 'Meghmachang Resort Cottage (2 nights)', amount: 7000, quantity: 1 },
      { id: 'e-4', category: 'food', description: 'Bamboo Chicken, meals & morning tea', amount: 3200, quantity: 4 },
      { id: 'e-5', category: 'activities', description: 'Helipad entry & Kanglak Hill guide fee', amount: 500, quantity: 4 }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Dhaka to Khagrachari & Arrival at Sajek',
        activities: [
          'Board overnight bus from Dhaka Kalabagan at 11:00 PM',
          'Arrive Khagrachari at 6:30 AM, have breakfast (Paratha + Eggs)',
          'Meet Chander Gari driver and proceed to Dighinala Army Escort (10:00 AM batch)',
          'Reach Sajek Ruilui Para by 1:00 PM, check into Meghmachang Resort',
          'Sunset view from Ruilui Para Helipad'
        ],
        notes: 'Make sure to carry your NID / Student ID copy for Army checkpoints.'
      },
      {
        dayNumber: 2,
        title: 'Kanglak Hill Trekking & Cloud Watching',
        activities: [
          'Early morning 5:30 AM cloud watching from resort balcony',
          'Trek up to Kanglak Hill (highest peak of Sajek)',
          'Traditional tribal lunch (Bamboo Chicken & System fish curry)',
          'Night bonfire & stargazing at Helipad 2'
        ]
      },
      {
        dayNumber: 3,
        title: 'Hajachora Waterfall & Return to Dhaka',
        activities: [
          'Checkout at 9:00 AM with the morning Army Escort',
          'Visit Hajachora Waterfall near Dighinala',
          'Lunch at System Restaurant Khagrachari city',
          'Board 3:00 PM bus back to Dhaka'
        ]
      }
    ],
    whatWentWell: [
      'Amazing sea of clouds in early morning',
      'Extremely friendly local Tripuri villagers',
      'Delicious authentic Bamboo Chicken at Rock Paradise eatery'
    ],
    problemsExperienced: [
      'Poor Teletalk/Robi mobile internet reception in certain parts of Ruilui Para',
      'Electricity cuts during peak afternoon hours (Solar backup available for light only)'
    ],
    recommendations: {
      recommendedFor: ['Students', 'Friends Groups', 'Nature Lovers', 'Photographers'],
      whatToCarry: ['Power Bank', 'Cash (No working ATMs in Sajek)', 'Odomos / Insect Repellent', 'National ID / Passport Photocopies'],
      bestTime: 'October to February for clear cloud views',
      costSavingTips: [
        'Share a Chander Gari with another small group at Khagrachari counter to split ৳4,500 cost.',
        'Book wooden cottages slightly away from Helipad 1 for 30% lower room rates.'
      ]
    },
    costConfirmations: {
      stillAccurate: 42,
      slightlyHigher: 5,
      muchHigher: 1,
      lowerPossible: 3,
      lastConfirmedDate: '2026-07-20'
    },
    visibility: 'public',
    publicationStatus: 'published',
    verificationStatus: 'verified',
    publishedAt: '2026-06-15T00:00:00Z',
    lastCostUpdatedAt: '2026-07-15T00:00:00Z',
    viewCount: 1420,
    saveCount: 380,
    copyCount: 195,
    questionCount: 12
  },
  {
    id: 'trip-2',
    authorId: 'user-2',
    author: MOCK_USERS[1],
    title: 'Cox\'s Bazar & Inani Beach Family Trip: 4 Days Comfort Plan',
    slug: 'coxs-bazar-inani-beach-family-trip-4-days',
    summary: 'A relaxed 4-day family holiday in Cox\'s Bazar staying near Kolatoli beach with visits to Marine Drive, Inani, and Himchari.',
    contentLanguage: 'en',
    startLocationText: 'Chittagong',
    destination: MOCK_DESTINATIONS[1],
    startDate: '2026-05-01',
    endDate: '2026-05-05',
    durationDays: 4,
    travelerCount: 4,
    travelStyle: MOCK_TRAVEL_STYLES[1], // Family Holiday
    totalCost: 24000,
    costPerPerson: 6000,
    currency: 'BDT',
    coverImagePath: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800'
    ],
    transportSegments: [
      {
        id: 't-3',
        fromLocation: 'Chittagong (Dampara)',
        toLocation: 'Cox\'s Bazar Kolatoli',
        transportType: 'Bus',
        operatorName: 'Desh Travels AC',
        durationHours: 4,
        cost: 3200,
        notes: '৳800 per ticket for family.'
      }
    ],
    accommodations: [
      {
        id: 'a-2',
        propertyName: 'Ocean Paradise Suites',
        location: 'Kolatoli Road, Cox\'s Bazar',
        accommodationType: 'Hotel',
        nights: 3,
        totalCost: 13500,
        costPerNight: 4500,
        rating: 4.8,
        experienceNotes: 'Family suite with swimming pool and complimentary buffet breakfast.',
        bookingUrl: 'https://example.com'
      }
    ],
    expenses: [
      { id: 'e-6', category: 'transport', description: 'Chittagong-Cox bus tickets (Round trip)', amount: 6400, quantity: 4 },
      { id: 'e-7', category: 'accommodation', description: 'Hotel Family Suite (3 nights)', amount: 13500, quantity: 1 },
      { id: 'e-8', category: 'food', description: 'Seafood dinners & Jau Restaurant family meals', amount: 3500, quantity: 4 },
      { id: 'e-9', category: 'activities', description: 'Auto-rickshaw rental for Marine Drive & Inani', amount: 600, quantity: 1 }
    ],
    itinerary: [
      { dayNumber: 1, title: 'Arrival & Kolatoli Sunset Walk', activities: ['Arrive Kolatoli, check in hotel', 'Evening walk & fresh coconut water on beach'] },
      { dayNumber: 2, title: 'Marine Drive & Inani Coral Beach', activities: ['Rent Tomtom auto for Marine Drive drive', 'Visit Inani Coral beach & Himchari Hill viewpoint'] },
      { dayNumber: 3, title: 'Laboni Beach & Dry Fish Market Shopping', activities: ['Morning sea bath at Laboni Beach', 'Evening shopping at Burmese Market'] },
      { dayNumber: 4, title: 'Return Journey to Chittagong', activities: ['Buffet breakfast and checkout', 'Return AC Bus journey'] }
    ],
    whatWentWell: ['Very comfortable AC bus trip', 'Clean swimming pool for kids at hotel'],
    problemsExperienced: ['Crowded beach area during weekend evenings'],
    recommendations: {
      recommendedFor: ['Families', 'Couples', 'Senior Citizens'],
      whatToCarry: ['Sunscreen', 'Beach Towels', 'Extra Flip-flops'],
      bestTime: 'November to March',
      costSavingTips: ['Eat at Jau Restaurant or Poushee for authentic low-cost Bengali fish meals.']
    },
    costConfirmations: {
      stillAccurate: 30,
      slightlyHigher: 2,
      muchHigher: 0,
      lowerPossible: 1,
      lastConfirmedDate: '2026-07-22'
    },
    visibility: 'public',
    publicationStatus: 'published',
    verificationStatus: 'verified',
    publishedAt: '2026-05-10T00:00:00Z',
    lastCostUpdatedAt: '2026-06-01T00:00:00Z',
    viewCount: 980,
    saveCount: 240,
    copyCount: 110,
    questionCount: 5
  },
  {
    id: 'trip-3',
    authorId: 'user-3',
    author: MOCK_USERS[2],
    title: 'Sreemangal Tea Gardens & Lawachara Forest: 2 Days Student Tour',
    slug: 'sreemangal-tea-gardens-2-days-student-tour',
    summary: 'A 2-day student budget trip traveling by Kalni Express train from Dhaka to Sreemangal exploring tea estates, 7-layer tea, and Lawachara rainforest.',
    contentLanguage: 'bn',
    startLocationText: 'Dhaka (Kamalapur Railway Station)',
    destination: MOCK_DESTINATIONS[2],
    startDate: '2026-04-12',
    endDate: '2026-04-14',
    durationDays: 2,
    travelerCount: 3,
    travelStyle: MOCK_TRAVEL_STYLES[0], // Student Budget
    totalCost: 12000,
    costPerPerson: 4000,
    currency: 'BDT',
    coverImagePath: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
    images: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800'
    ],
    transportSegments: [
      {
        id: 't-4',
        fromLocation: 'Kamalapur Station',
        toLocation: 'Sreemangal Railway Station',
        transportType: 'Train',
        operatorName: 'Kalni Express (Shovon Chair)',
        durationHours: 4.5,
        cost: 1500,
        notes: '৳250 per person train ticket.'
      }
    ],
    accommodations: [
      {
        id: 'a-3',
        propertyName: 'Green Leaf Guest House',
        location: 'Sreemangal Town',
        accommodationType: 'Guest House',
        nights: 1,
        totalCost: 2400,
        costPerNight: 2400,
        rating: 4.4,
        experienceNotes: 'Clean triple bed room right near the train station.'
      }
    ],
    expenses: [
      { id: 'e-10', category: 'transport', description: 'Train tickets Dhaka-Sreemangal (Round trip)', amount: 1500, quantity: 3 },
      { id: 'e-11', category: 'transport', description: 'CNG rental for full day sights', amount: 1800, quantity: 1 },
      { id: 'e-12', category: 'accommodation', description: 'Guest House (1 night)', amount: 2400, quantity: 1 },
      { id: 'e-13', category: 'food', description: 'Kutum Bari meals & Nilkantha 7-layer tea', amount: 4800, quantity: 3 },
      { id: 'e-14', category: 'tickets', description: 'Lawachara & Madhabpur entry tickets', amount: 150, quantity: 3 }
    ],
    itinerary: [
      { dayNumber: 1, title: 'Train Journey & Finlay Tea Estate', activities: ['Morning 6:30 AM Kalni Express train', 'Check in guest house', 'Visit Finlay tea garden & 7-layer tea stall'] },
      { dayNumber: 2, title: 'Lawachara National Park & Madhabpur Lake', activities: ['Early morning trek in Lawachara National Park', 'Madhabpur Lake lotus watching', 'Evening return train to Dhaka'] }
    ],
    whatWentWell: ['Punctual train journey', 'Refreshing green scenery'],
    problemsExperienced: ['Leeches in Lawachara trail during light rain'],
    recommendations: {
      recommendedFor: ['Students', 'Solo Travelers', 'Nature Lovers'],
      whatToCarry: ['Salt or Liquid Soap for leeches', 'Raincoat / Umbrella'],
      bestTime: 'July to November for lush green gardens',
      costSavingTips: ['Book Shovon Chair train tickets 10 days in advance via Bangladesh Railway app.']
    },
    costConfirmations: {
      stillAccurate: 28,
      slightlyHigher: 1,
      muchHigher: 0,
      lowerPossible: 2,
      lastConfirmedDate: '2026-07-25'
    },
    visibility: 'public',
    publicationStatus: 'published',
    verificationStatus: 'unverified',
    publishedAt: '2026-04-20T00:00:00Z',
    lastCostUpdatedAt: '2026-05-01T00:00:00Z',
    viewCount: 750,
    saveCount: 190,
    copyCount: 88,
    questionCount: 3
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    author: MOCK_USERS[2],
    title: 'Can I visit Sajek Valley under ৳5,000 per person with 4 friends?',
    slug: 'can-i-visit-sajek-valley-under-5000',
    details: 'We are 4 university students planning a 3-day trip from Dhaka next month. What is the cheapest bus and Chander Gari reservation strategy?',
    destinationName: 'Sajek Valley',
    travelStyleSlug: 'student-budget',
    budgetRange: 'Under ৳5,000',
    contentLanguage: 'en',
    helpfulVotes: 34,
    answerCount: 4,
    isAnswered: true,
    createdAt: '2026-07-10T00:00:00Z'
  },
  {
    id: 'q-2',
    author: MOCK_USERS[1],
    title: 'Which Kolatoli hotel is best for a family with young children in Cox\'s Bazar?',
    slug: 'best-kolatoli-hotel-for-family-coxs-bazar',
    details: 'Looking for a hotel with clean swimming pool, elevator, and elevator accessibility near Kolatoli beach under ৳4,500/night.',
    destinationName: 'Cox\'s Bazar',
    travelStyleSlug: 'family-holiday',
    budgetRange: 'Under ৳20,000',
    contentLanguage: 'bn',
    helpfulVotes: 19,
    answerCount: 2,
    isAnswered: true,
    createdAt: '2026-07-14T00:00:00Z'
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    titleEn: 'First Journey Shared',
    titleBn: 'প্রথম ট্রিপ শেয়ারড',
    descriptionEn: 'Publish your first completed travel trip post on Jatrio.',
    descriptionBn: 'যাত্রিওতে আপনার প্রথম সম্পূর্ণ ট্রিপ পাবলিশ করুন।',
    badgeIcon: 'MapPin',
    category: 'Trip Creator',
    progress: 100,
    isUnlocked: true
  },
  {
    id: 'ach-2',
    titleEn: 'District Explorer (5 Districts)',
    titleBn: 'জেলা এক্সপ্লোরার (৫টি জেলা)',
    descriptionEn: 'Publish trips or log travel experiences in at least 5 districts.',
    descriptionBn: 'কমপক্ষে ৫টি ভিন্ন জেলায় ভ্রমণের অভিজ্ঞতা লগ করুন।',
    badgeIcon: 'Compass',
    category: 'Explorer',
    progress: 80,
    isUnlocked: false
  },
  {
    id: 'ach-3',
    titleEn: 'Budget Mastermind',
    titleBn: 'বাজেট মাস্টারমাইন্ড',
    descriptionEn: 'Publish 3 detailed trips with complete cost breakdown under ৳5,000.',
    descriptionBn: '৳৫,০০০ টাকার নিচে বিস্তারিত খরচের হিসাবসহ ৩টি ট্রিপ শেয়ার করুন।',
    badgeIcon: 'Wallet',
    category: 'Budget Expert',
    progress: 66,
    isUnlocked: false
  },
  {
    id: 'ach-4',
    titleEn: 'Community Savior (50 Helpful Votes)',
    titleBn: 'কমিউনিটি সেভিয়ার (৫০টি হেল্পফুল ভোট)',
    descriptionEn: 'Receive 50 helpful votes on your answers or trip tips.',
    descriptionBn: 'আপনার উত্তর বা ট্রিপ টিপসে ৫০টি হেল্পফুল ভোট অর্জন করুন।',
    badgeIcon: 'Award',
    category: 'Helpful Traveler',
    progress: 100,
    isUnlocked: true
  }
];
