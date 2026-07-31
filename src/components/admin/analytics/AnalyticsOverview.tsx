'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DateRangeOption,
  RealtimeUserActivity,
  TrendDataPoint,
  TrafficSourceItem,
  SearchConsoleQueryItem,
  SearchConsoleLandingPageItem,
  PopularContentItem,
  UserEventMetric,
  FunnelStep,
  IntegrationStatus
} from '@/lib/analytics/types';
import { MOCK_TRIPS, MOCK_DESTINATIONS } from '@/lib/data/mockData';
import {
  Users,
  Eye,
  TrendingUp,
  UserPlus,
  Search,
  FileText,
  Copy,
  Bookmark,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Laptop,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Filter,
  BarChart2,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [activeTrendMetric, setActiveTrendMetric] = useState<'visitors' | 'pageViews' | 'registeredUsers'>('visitors');
  const [searchTablePage, setSearchTablePage] = useState(1);

  // Integration Connection Status (Mocking actual env presence check safely)
  const integrationStatus: IntegrationStatus = {
    ga4Connected: false, // Set to true when GA4_PROPERTY_ID env set
    searchConsoleConnected: false, // Set to true when SEARCH_CONSOLE_SITE_URL set
    supabaseRealtimeConnected: true,
    lastSyncTime: 'Live Realtime',
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  // Top Statistics Data
  const STATS_CARDS = [
    {
      id: 'stat-1',
      title: 'Users Online Now',
      value: 14,
      changePercent: 12,
      changeLabel: 'vs 30 mins ago',
      icon: Users,
      isRealtime: true,
    },
    {
      id: 'stat-2',
      title: 'Visitors Today',
      value: '1,420',
      changePercent: 8.4,
      changeLabel: 'vs yesterday',
      icon: Eye,
      isPositiveGood: true,
    },
    {
      id: 'stat-3',
      title: 'Total Visitors',
      value: '38,900',
      changePercent: 15.2,
      changeLabel: 'vs previous period',
      icon: TrendingUp,
      isPositiveGood: true,
    },
    {
      id: 'stat-4',
      title: 'New Registered Users',
      value: '248',
      changePercent: 5.6,
      changeLabel: 'vs previous period',
      icon: UserPlus,
      isPositiveGood: true,
    },
    {
      id: 'stat-5',
      title: 'Google Search Visitors',
      value: '22,400',
      changePercent: 18.5,
      changeLabel: 'vs previous period',
      icon: Search,
      isPositiveGood: true,
    },
    {
      id: 'stat-6',
      title: 'Published Trips',
      value: MOCK_TRIPS.length,
      changePercent: 0,
      changeLabel: 'Quality Verified',
      icon: FileText,
      isPositiveGood: true,
    },
    {
      id: 'stat-7',
      title: 'Trip Views',
      value: '14,850',
      changePercent: 22.1,
      changeLabel: 'vs previous period',
      icon: Eye,
      isPositiveGood: true,
    },
    {
      id: 'stat-8',
      title: 'Signup Conversion Rate',
      value: '4.2%',
      changePercent: -0.5,
      changeLabel: 'vs previous period',
      icon: TrendingUp,
      isPositiveGood: false,
    },
  ];

  // Realtime Active User Sessions (Supabase Realtime)
  const REALTIME_SESSIONS: RealtimeUserActivity[] = [
    { id: 'rs-1', currentPage: '/trips/dhaka-to-sajek-valley-3-days-friends-trip', deviceType: 'Mobile', userType: 'Guest', language: 'English', lastActiveTime: '10s ago' },
    { id: 'rs-2', currentPage: '/destinations/coxs-bazar', deviceType: 'Desktop', userType: 'Registered', language: 'Bangla', lastActiveTime: '25s ago' },
    { id: 'rs-3', currentPage: '/routes/dhaka-to-sreemangal', deviceType: 'Mobile', userType: 'Guest', language: 'English', lastActiveTime: '42s ago' },
    { id: 'rs-4', currentPage: '/budget-trips/under-5000', deviceType: 'Desktop', userType: 'Guest', language: 'Bangla', lastActiveTime: '1m ago' },
    { id: 'rs-5', currentPage: '/questions/can-i-visit-sajek-valley-under-5000', deviceType: 'Tablet', userType: 'Registered', language: 'English', lastActiveTime: '2m ago' },
  ];

  // Trend Data Points
  const TREND_DATA: TrendDataPoint[] = [
    { date: 'Jul 25', visitors: 1100, pageViews: 2400, registeredUsers: 18 },
    { date: 'Jul 26', visitors: 1250, pageViews: 2800, registeredUsers: 22 },
    { date: 'Jul 27', visitors: 1400, pageViews: 3100, registeredUsers: 28 },
    { date: 'Jul 28', visitors: 1350, pageViews: 2950, registeredUsers: 25 },
    { date: 'Jul 29', visitors: 1600, pageViews: 3500, registeredUsers: 34 },
    { date: 'Jul 30', visitors: 1520, pageViews: 3400, registeredUsers: 30 },
    { date: 'Jul 31', visitors: 1420, pageViews: 3200, registeredUsers: 26 },
  ];

  // Traffic Sources
  const TRAFFIC_SOURCES: TrafficSourceItem[] = [
    { sourceName: 'Google Organic', visitors: 22400, percentage: 57.5, conversionRate: 5.2 },
    { sourceName: 'Direct', visitors: 8200, percentage: 21.0, conversionRate: 4.1 },
    { sourceName: 'Facebook', visitors: 4300, percentage: 11.0, conversionRate: 2.8 },
    { sourceName: 'Referral', visitors: 2100, percentage: 5.4, conversionRate: 3.5 },
    { sourceName: 'Other Social Media', visitors: 1200, percentage: 3.1, conversionRate: 2.1 },
    { sourceName: 'Email', visitors: 700, percentage: 1.8, conversionRate: 6.4 },
  ];

  // Search Console Queries
  const SEARCH_QUERIES: SearchConsoleQueryItem[] = [
    { keyword: 'sajek valley trip cost', clicks: 2450, impressions: 18200, ctr: 13.4, avgPosition: 2.1, landingPage: '/trips/dhaka-to-sajek-valley-3-days-friends-trip' },
    { keyword: 'dhaka to coxs bazar bus fare', clicks: 1820, impressions: 14500, ctr: 12.5, avgPosition: 1.8, landingPage: '/routes/dhaka-to-coxs-bazar' },
    { keyword: 'bangladesh budget travel guide', clicks: 1340, impressions: 11200, ctr: 11.9, avgPosition: 3.4, landingPage: '/' },
    { keyword: 'sreemangal tour plan 2 days', clicks: 980, impressions: 8900, ctr: 11.0, avgPosition: 2.6, landingPage: '/trips/sreemangal-tea-gardens-2-days-student-tour' },
    { keyword: '5000 taka trip bangladesh', clicks: 760, impressions: 6800, ctr: 11.1, avgPosition: 2.3, landingPage: '/budget-trips/under-5000' },
  ];

  // Tracked Product Events
  const PRODUCT_EVENTS: UserEventMetric[] = [
    { eventName: 'trip_view', eventCount: 14850, uniqueUsers: 8400 },
    { eventName: 'budget_filter_used', eventCount: 4200, uniqueUsers: 2800 },
    { eventName: 'trip_saved', eventCount: 1840, uniqueUsers: 1250 },
    { eventName: 'trip_copied', eventCount: 920, uniqueUsers: 680 },
    { eventName: 'trip_shared', eventCount: 640, uniqueUsers: 480 },
    { eventName: 'question_asked', eventCount: 140, uniqueUsers: 110 },
    { eventName: 'signup_completed', eventCount: 248, uniqueUsers: 248 },
  ];

  // Conversion Funnel Steps
  const FUNNEL_STEPS: FunnelStep[] = [
    { stepNumber: 1, stepName: '1. Website Visit', count: 38900, conversionFromPrev: 100 },
    { stepNumber: 2, stepName: '2. Trip Report Viewed', count: 30340, conversionFromPrev: 78.0 },
    { stepNumber: 3, stepName: '3. Account Created', count: 2480, conversionFromPrev: 8.1 },
    { stepNumber: 4, stepName: '4. Trip Saved or Copied', count: 1840, conversionFromPrev: 74.1 },
    { stepNumber: 5, stepName: '5. Trip Published', count: 184, conversionFromPrev: 10.0 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. DASHBOARD HEADER & FILTERS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Analytics Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor visitors, search performance, engagement, and platform growth.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
            {(['today', '7d', '30d', '90d'] as DateRangeOption[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-md transition-all ${
                  dateRange === range
                    ? 'bg-white text-brand-purple shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-purple ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <span className="text-[11px] text-slate-400 pl-1">Updated {lastUpdated}</span>
        </div>
      </div>

      {/* INTEGRATION STATUS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-purple" />
            <span className="font-bold text-slate-800">Google Analytics 4</span>
          </div>
          {integrationStatus.ga4Connected ? (
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" /> Setup Required
            </span>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-brand-purple" />
            <span className="font-bold text-slate-800">Google Search Console</span>
          </div>
          {integrationStatus.searchConsoleConnected ? (
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" /> Setup Required
            </span>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-green" />
            <span className="font-bold text-slate-800">Supabase Realtime Presence</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active Live
          </span>
        </div>
      </div>

      {/* 2. TOP STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((stat) => {
          const IconComp = stat.icon;
          return (
            <div key={stat.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <IconComp className="w-4 h-4 text-brand-purple" />
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
                  <span>{stat.value}</span>
                  {stat.isRealtime && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
                  )}
                </div>

                {stat.changePercent !== undefined && (
                  <div
                    className={`flex items-center text-xs font-bold ${
                      stat.changePercent > 0
                        ? 'text-emerald-600'
                        : stat.changePercent < 0
                        ? 'text-rose-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {stat.changePercent > 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>{Math.abs(stat.changePercent)}%</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 font-medium">{stat.changeLabel}</div>
            </div>
          );
        })}
      </div>

      {/* 3. REALTIME ACTIVITY & VISITOR TREND CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visitor Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">Visitor Growth Trend</h2>
              <p className="text-xs text-slate-500">Daily unique visitors, page views, and user registrations.</p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveTrendMetric('visitors')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTrendMetric === 'visitors' ? 'bg-white text-brand-purple font-bold shadow-sm' : ''
                }`}
              >
                Visitors
              </button>
              <button
                onClick={() => setActiveTrendMetric('pageViews')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTrendMetric === 'pageViews' ? 'bg-white text-brand-purple font-bold shadow-sm' : ''
                }`}
              >
                Page Views
              </button>
              <button
                onClick={() => setActiveTrendMetric('registeredUsers')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTrendMetric === 'registeredUsers' ? 'bg-white text-brand-purple font-bold shadow-sm' : ''
                }`}
              >
                Registrations
              </button>
            </div>
          </div>

          {/* SVG Bar Visualization */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
              {TREND_DATA.map((dp, idx) => {
                const val = dp[activeTrendMetric];
                const maxVal = activeTrendMetric === 'visitors' ? 2000 : activeTrendMetric === 'pageViews' ? 4000 : 40;
                const heightPercent = Math.min(100, Math.max(15, (val / maxVal) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-slate-900 text-white px-2 py-0.5 rounded shadow">
                      {val.toLocaleString()}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-brand-purple/80 hover:bg-brand-purple rounded-t-md transition-all duration-300"
                    />
                    <span className="text-[10px] font-semibold text-slate-400">{dp.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Supabase Realtime Activity (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-green" />
              <span>Realtime Activity</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
              14 Online Now
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {REALTIME_SESSIONS.map((sess) => (
              <div key={sess.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="truncate max-w-[180px]">{sess.currentPage}</span>
                  <span className="text-[10px] text-slate-400">{sess.lastActiveTime}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{sess.deviceType}</span>
                  <span>•</span>
                  <span>{sess.userType}</span>
                  <span>•</span>
                  <span>{sess.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TRAFFIC SOURCES & CONVERSION FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic Sources (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading">Traffic Sources Breakdown</h2>

          <div className="space-y-3.5">
            {TRAFFIC_SOURCES.map((src, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{src.sourceName}</span>
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span>{src.visitors.toLocaleString()} visitors ({src.percentage}%)</span>
                    <span className="text-emerald-600 font-semibold">{src.conversionRate}% conv</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${src.percentage}%` }}
                    className="h-full bg-brand-purple rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Conversion Funnel (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading">5-Step Product Conversion Funnel</h2>

          <div className="space-y-3">
            {FUNNEL_STEPS.map((step) => (
              <div key={step.stepNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-900">{step.stepName}</div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-900 font-heading">{step.count.toLocaleString()}</span>
                  <span className="px-2 py-0.5 rounded bg-brand-cyan/40 text-brand-purple font-bold text-[10px]">
                    {step.conversionFromPrev}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. GOOGLE SEARCH CONSOLE PERFORMANCE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-purple" />
              <span>Google Search Console Performance</span>
            </h2>
            <p className="text-xs text-slate-500">Organic impressions, clicks, keyword rankings, and top landing pages.</p>
          </div>
        </div>

        {/* Search Console Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Total Google Clicks</div>
            <div className="text-xl font-black text-slate-900 font-heading">22,400</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Total Impressions</div>
            <div className="text-xl font-black text-slate-900 font-heading">184,000</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Average CTR</div>
            <div className="text-xl font-black text-emerald-600 font-heading">12.1%</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Average Position</div>
            <div className="text-xl font-black text-brand-purple font-heading">2.4</div>
          </div>
        </div>

        {/* Queries Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading">Top Organic Search Queries</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Search Keyword</th>
                  <th className="py-2.5 px-3">Clicks</th>
                  <th className="py-2.5 px-3">Impressions</th>
                  <th className="py-2.5 px-3">CTR</th>
                  <th className="py-2.5 px-3">Avg Position</th>
                  <th className="py-2.5 px-3">Landing Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SEARCH_QUERIES.map((sq, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{sq.keyword}</td>
                    <td className="py-3 px-3 font-semibold text-brand-purple">{sq.clicks.toLocaleString()}</td>
                    <td className="py-3 px-3">{sq.impressions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{sq.ctr}%</td>
                    <td className="py-3 px-3 font-bold">{sq.avgPosition}</td>
                    <td className="py-3 px-3 text-slate-500 underline font-mono text-[11px]">{sq.landingPage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. TRACKED PRODUCT EVENTS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading">Tracked Platform Engagement Events</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRODUCT_EVENTS.map((pe, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-mono font-bold text-brand-purple">{pe.eventName}</div>
              <div className="text-xl font-black text-slate-900 font-heading">{pe.eventCount.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">{pe.uniqueUsers.toLocaleString()} unique users</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
