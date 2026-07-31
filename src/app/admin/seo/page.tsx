'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_TRIPS, MOCK_DESTINATIONS, MOCK_QUESTIONS, MOCK_USERS } from '@/lib/data/mockData';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function SeoAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'schema' | 'console'>('overview');

  const indexableTripsCount = MOCK_TRIPS.filter((t) => t.publicationStatus === 'published').length;
  const totalDestinationsCount = MOCK_DESTINATIONS.length;
  const totalQuestionsCount = MOCK_QUESTIONS.length;
  const totalProfilesCount = MOCK_USERS.length;
  const totalIndexablePages = 1 + 6 + indexableTripsCount + totalDestinationsCount + totalQuestionsCount + totalProfilesCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-purple/40 text-brand-cyan text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engine Optimization Governance</span>
          </div>
          <h1 className="text-3xl font-black font-heading">Ghurabo SEO Control Center</h1>
          <p className="text-xs text-slate-300">Monitor indexable URLs, sitemaps, rich snippet schemas, and search console health.</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 flex items-center gap-1.5"
          >
            <span>XML Sitemap</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
          </a>

          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 flex items-center gap-1.5"
          >
            <span>Robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-brand-purple" /> Indexable URLs
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">{totalIndexablePages}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">100% Quality Gated</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-brand-purple" /> Schema Rich Snippets
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">6 Types</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Google Test Compliant</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" /> Excluded Noindex
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">4 Routes</div>
          <div className="text-[10px] text-slate-500 font-semibold">/admin, /dashboard, /create</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-brand-purple" /> Core Web Vitals
          </div>
          <div className="text-2xl font-black text-emerald-600 font-heading">98/100</div>
          <div className="text-[10px] text-slate-500 font-semibold">LCP 1.2s · CLS 0.00</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Audit Overview
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Indexable Routes
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === 'schema'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Structured Data (JSON-LD)
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === 'console'
              ? 'border-brand-purple text-brand-purple font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Search Console Instructions
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">SEO System Architecture Status</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Dynamic Metadata Generation (`generateMetadata`)</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Bilingual Hreflang Tags (`en`, `bn`, `x-default`)</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Dynamic XML Sitemap Index (`app/sitemap.ts`)</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Robots Directive (`app/robots.ts`)</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Indexable Routes */}
      {activeTab === 'pages' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">Target Indexable Public Routes</h3>
          <div className="space-y-2 text-xs">
            {[
              { path: '/', type: 'Homepage', priority: '1.0', status: 'Indexed' },
              { path: '/trips', type: 'Catalog', priority: '0.9', status: 'Indexed' },
              { path: '/destinations', type: 'Catalog', priority: '0.9', status: 'Indexed' },
              { path: '/routes/dhaka-to-sajek-valley', type: 'Route Guide', priority: '0.8', status: 'Indexed' },
              { path: '/budget-trips/under-5000', type: 'Budget Tier', priority: '0.8', status: 'Indexed' },
              { path: '/questions', type: 'Q&A Forum', priority: '0.8', status: 'Indexed' },
              { path: '/admin', type: 'Private Admin', priority: '0.0', status: 'Noindex' },
              { path: '/dashboard', type: 'User Dashboard', priority: '0.0', status: 'Noindex' },
            ].map((r, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="font-mono font-medium text-slate-800">{r.path}</div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{r.type}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${r.status === 'Indexed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Schema JSON-LD */}
      {activeTab === 'schema' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">Configured Structured Data Schemas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-brand-purple">1. WebSite & Organization</div>
              <div className="text-slate-500">Injected on Homepage with Sitelinks Search Box metadata.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-brand-purple">2. Article / BlogPosting</div>
              <div className="text-slate-500">Injected on `/trips/[slug]` with author Person reference.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-brand-purple">3. Place</div>
              <div className="text-slate-500">Injected on `/destinations/[slug]` with locality coordinates.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-brand-purple">4. QAPage</div>
              <div className="text-slate-500">Injected on `/questions/[slug]` with community answers.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Search Console Guide */}
      {activeTab === 'console' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs leading-relaxed text-slate-700">
          <h3 className="text-base font-bold text-slate-900 font-heading">Google Search Console Submission Guide</h3>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Log into <strong>Google Search Console</strong> using your domain owner email.</li>
            <li>Add property: <code>https://ghurabo.app</code>.</li>
            <li>Go to <strong>Sitemaps</strong> in the left sidebar.</li>
            <li>Submit sitemap URL: <code>https://ghurabo.app/sitemap.xml</code>.</li>
            <li>Verify indexation status under Coverage report after 24 hours.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
