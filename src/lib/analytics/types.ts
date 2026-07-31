export type DateRangeOption = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  changePercent?: number;
  changeLabel?: string;
  iconName: string;
  isPositiveGood?: boolean;
}

export interface RealtimeUserActivity {
  id: string;
  currentPage: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  userType: 'Guest' | 'Registered';
  language: 'English' | 'Bangla';
  lastActiveTime: string;
}

export interface TrendDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  registeredUsers: number;
}

export interface TrafficSourceItem {
  sourceName: string;
  visitors: number;
  percentage: number;
  conversionRate: number;
}

export interface SearchConsoleQueryItem {
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  landingPage: string;
}

export interface SearchConsoleLandingPageItem {
  landingPage: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
}

export interface PopularContentItem {
  id: string;
  title: string;
  url: string;
  views: number;
  saves: number;
  copies: number;
  category: string;
}

export interface UserEventMetric {
  eventName: string;
  eventCount: number;
  uniqueUsers: number;
}

export interface FunnelStep {
  stepNumber: number;
  stepName: string;
  count: number;
  conversionFromPrev: number;
}

export interface IntegrationStatus {
  ga4Connected: boolean;
  searchConsoleConnected: boolean;
  supabaseRealtimeConnected: boolean;
  lastSyncTime: string;
}
