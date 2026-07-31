'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  Compass,
  PlusCircle,
  ChevronDown,
  Search,
  Sparkles,
  MapPin,
  HelpCircle,
  Award,
  Wallet,
  GraduationCap,
  Users,
  Heart,
  User,
  Smile,
  Calendar,
  TreePine,
  Utensils,
  Car,
  Bell
} from 'lucide-react';
import { MOCK_TRAVEL_STYLES } from '@/lib/data/mockData';

function renderStyleIcon(slug: string) {
  switch (slug) {
    case 'student-budget': return <GraduationCap className="w-4 h-4 text-brand-purple" />;
    case 'family-holiday': return <Users className="w-4 h-4 text-brand-purple" />;
    case 'couple-getaway': return <Heart className="w-4 h-4 text-rose-500" />;
    case 'solo-adventure': return <User className="w-4 h-4 text-brand-sky" />;
    case 'friends-trip': return <Smile className="w-4 h-4 text-amber-500" />;
    case 'weekend-escape': return <Calendar className="w-4 h-4 text-teal-600" />;
    case 'adventure': return <Compass className="w-4 h-4 text-brand-purple" />;
    case 'nature-wildlife': return <TreePine className="w-4 h-4 text-brand-green" />;
    case 'food-trail': return <Utensils className="w-4 h-4 text-orange-500" />;
    case 'road-trip': return <Car className="w-4 h-4 text-brand-sky" />;
    default: return <Compass className="w-4 h-4 text-brand-purple" />;
  }
}

export const Header: React.FC = () => {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo - Perfectly Balanced */}
          <Link href="/" className="flex items-center shrink-0 group">
            <div className="h-16 w-auto flex items-center justify-center">
              <ImageWithFallback
                src="/images/logo.png"
                fallbackSrc="/logo.png"
                alt="Jatrio"
                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* Desktop Navbar Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            {/* Explore Dropdown */}
            <div className="relative" onMouseLeave={() => setIsExploreDropdownOpen(false)}>
              <button
                onMouseEnter={() => setIsExploreDropdownOpen(true)}
                onClick={() => setIsExploreDropdownOpen(!isExploreDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive('/trips') || isActive('/destinations') || isExploreDropdownOpen
                    ? 'bg-slate-100 text-brand-purple font-bold'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Compass className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Explore</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isExploreDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-2 grid grid-cols-1 gap-0.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Travel Reports
                  </div>
                  <Link
                    href="/trips"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 font-medium text-xs"
                  >
                    <Compass className="w-4 h-4 text-brand-purple" />
                    <span>All Travel Experiences</span>
                  </Link>

                  <Link
                    href="/destinations"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 font-medium text-xs"
                  >
                    <MapPin className="w-4 h-4 text-brand-purple" />
                    <span>Popular Destinations</span>
                  </Link>

                  <Link
                    href="/gallery"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 font-medium text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    <span>Travel Photo Gallery</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Categories
                  </div>
                  {MOCK_TRAVEL_STYLES.slice(0, 5).map((style) => (
                    <Link
                      key={style.id}
                      href={`/trips?style=${style.slug}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 text-xs"
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {renderStyleIcon(style.slug)}
                      </div>
                      <span className="font-medium">{locale === 'bn' ? style.nameBn : style.nameEn}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/gallery')
                  ? 'bg-slate-100 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Gallery</span>
            </Link>

            <Link
              href="/budget-trips"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/budget-trips')
                  ? 'bg-slate-100 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
              <span>By Budget</span>
            </Link>

            <Link
              href="/questions"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/questions')
                  ? 'bg-slate-100 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Q&A</span>
            </Link>

            <Link
              href="/challenges"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/challenges')
                  ? 'bg-slate-100 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Badges</span>
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <LanguageSwitcher />

            <Link
              href="/trips/create"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-purple text-white text-xs font-semibold shadow-sm hover:bg-brand-purple/90 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>Share Trip</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500">Quick Trip Search</span>
              <button onClick={() => setIsSearchOpen(false)} className="text-xs text-slate-400 hover:text-slate-700">Close ✕</button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Sajek, Cox's Bazar, Budget trips..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Suggestions:</span>
              <Link href="/trips?destination=sajek-valley" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 text-brand-purple font-medium hover:bg-slate-200">Sajek</Link>
              <Link href="/trips?destination=coxs-bazar" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 text-brand-purple font-medium hover:bg-slate-200">Cox's Bazar</Link>
              <Link href="/trips?maxBudget=5000" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 text-brand-purple font-medium hover:bg-slate-200">Under ৳5k</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
