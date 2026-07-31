'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { createClient } from '@/lib/supabase/client';
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
  Bell,
  Sun,
  Moon,
  Monitor,
  LogIn,
  UserPlus,
  LogOut,
  Bookmark,
  Settings,
  Briefcase,
  ShieldCheck,
  Globe
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
  const { theme, resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || 'Traveler',
          username: session.user.user_metadata?.username || 'traveler',
          avatarUrl: session.user.user_metadata?.avatar_url || ''
        });
      }
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || 'Traveler',
          username: session.user.user_metadata?.username || 'traveler',
          avatarUrl: session.user.user_metadata?.avatar_url || ''
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setIsProfileDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <div className="h-16 w-auto flex items-center justify-center">
              <ImageWithFallback
                src="/images/logo.png"
                fallbackSrc="/logo.png"
                alt="Jatrio"
                transparentBg
                className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* Desktop Navbar Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {/* Explore Dropdown */}
            <div className="relative" onMouseLeave={() => setIsExploreDropdownOpen(false)}>
              <button
                onMouseEnter={() => setIsExploreDropdownOpen(true)}
                onClick={() => setIsExploreDropdownOpen(!isExploreDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive('/trips') || isActive('/destinations') || isExploreDropdownOpen
                    ? 'bg-slate-100 dark:bg-slate-800 text-brand-purple font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Explore</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isExploreDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 grid grid-cols-1 gap-0.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Travel Reports
                  </div>
                  <Link
                    href="/trips"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs"
                  >
                    <Compass className="w-4 h-4 text-brand-purple" />
                    <span>All Travel Experiences</span>
                  </Link>

                  <Link
                    href="/destinations"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs"
                  >
                    <MapPin className="w-4 h-4 text-brand-purple" />
                    <span>Popular Destinations</span>
                  </Link>

                  <Link
                    href="/gallery"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    <span>Travel Photo Gallery</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Categories
                  </div>
                  {MOCK_TRAVEL_STYLES.slice(0, 5).map((style) => (
                    <Link
                      key={style.id}
                      href={`/trips?style=${style.slug}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
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
                  ? 'bg-slate-100 dark:bg-slate-800 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Gallery</span>
            </Link>

            <Link
              href="/questions"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive('/questions')
                  ? 'bg-slate-100 dark:bg-slate-800 text-brand-purple font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Q&A</span>
            </Link>
          </nav>

          {/* Right Controls (Theme, Search, Language, Auth / Profile) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Search Trips"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Light / Dark / System Theme Switcher Dropdown */}
            <div ref={themeRef} className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Theme Settings"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 space-y-1 z-50 animate-in fade-in text-xs font-semibold">
                  <button
                    onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'light' ? 'bg-brand-purple/10 text-brand-purple font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'dark' ? 'bg-brand-purple/10 text-brand-purple font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'system' ? 'bg-brand-purple/10 text-brand-purple font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            <LanguageSwitcher />

            {/* Logged Out Controls */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/signup"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>

                <Link
                  href="/trips/create"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-sm hover:bg-brand-purple/90 transition-all whitespace-nowrap"
                >
                  <PlusCircle className="w-4 h-4 text-brand-cyan shrink-0" />
                  <span>Share Trip</span>
                </Link>
              </div>
            ) : (
              /* Logged In Controls (Notification + Profile Dropdown) */
              <div className="flex items-center gap-2.5">
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                </Link>

                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-purple/20 flex items-center justify-center font-bold text-brand-purple text-xs shrink-0">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.charAt(0)
                      )}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      @{currentUser.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 z-50 animate-in fade-in text-xs font-medium">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-white">{currentUser.fullName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">@{currentUser.username}</div>
                      </div>

                      <Link
                        href={`/travelers/${currentUser.username}`}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/my-trips"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>My Trips</span>
                      </Link>

                      <Link
                        href="/trips/create"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <PlusCircle className="w-4 h-4 text-brand-purple" />
                        <span>Share a Trip</span>
                      </Link>

                      <Link
                        href="/saved-trips"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        <span>Saved Trips</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Account Settings</span>
                      </Link>

                      {/* Super Admin & Admin Consoles Section */}
                      {(currentUser?.email === 'sahariannafis70@gmail.com' ||
                        currentUser?.username === 'sahariannafis70' ||
                        currentUser?.role === 'super_admin' ||
                        currentUser?.role === 'admin') && (
                        <>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                          <div className="px-2 py-1 text-[10px] font-bold uppercase text-brand-purple dark:text-brand-cyan tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-purple dark:text-brand-cyan" />
                            <span>Admin Consoles</span>
                          </div>

                          <Link
                            href="/admin"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-brand-purple/10 text-brand-purple dark:text-brand-cyan font-bold"
                          >
                            <ShieldCheck className="w-4 h-4 text-brand-purple dark:text-brand-cyan" />
                            <span>Control Center (/admin)</span>
                          </Link>

                          <Link
                            href="/super-admin"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                          >
                            <Award className="w-4 h-4 text-amber-500" />
                            <span>Super Admin (/super-admin)</span>
                          </Link>

                          <Link
                            href="/admin/seo"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                          >
                            <Globe className="w-4 h-4 text-emerald-500" />
                            <span>SEO Governance (/admin/seo)</span>
                          </Link>
                        </>
                      )}

                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Quick Trip Search</span>
              <button onClick={() => setIsSearchOpen(false)} className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Close ✕</button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Sajek, Cox's Bazar, Budget trips..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Suggestions:</span>
              <Link href="/trips?destination=sajek-valley" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-purple font-medium hover:bg-slate-200">Sajek</Link>
              <Link href="/trips?destination=coxs-bazar" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-purple font-medium hover:bg-slate-200">Cox's Bazar</Link>
              <Link href="/trips?maxBudget=5000" onClick={() => setIsSearchOpen(false)} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-purple font-medium hover:bg-slate-200">Under ৳5k</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
