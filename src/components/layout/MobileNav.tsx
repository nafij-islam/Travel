'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  Home,
  Compass,
  PlusCircle,
  Bookmark,
  User,
  Menu,
  X,
  HelpCircle,
  Award,
  LayoutDashboard,
  Wallet,
  MapPin,
  Search,
  Sparkles
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Slide-out Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between z-50 animate-in slide-in-from-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
                  <ImageWithFallback
                    src="/images/logo.png"
                    fallbackSrc="/logo.png"
                    alt="Ghurabo"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 touch-target">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1.5">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-4 h-4 text-brand-purple" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/trips"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/trips') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-brand-purple" />
                  <span>Explore Trips</span>
                </Link>

                <Link
                  href="/budget-trips"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/budget-trips') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-brand-purple" />
                  <span>By Budget</span>
                </Link>

                <Link
                  href="/destinations"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/destinations') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-purple" />
                  <span>Destinations</span>
                </Link>

                <Link
                  href="/questions"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/questions') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-brand-purple" />
                  <span>Community Q&A</span>
                </Link>

                <Link
                  href="/challenges"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/challenges') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4 text-brand-purple" />
                  <span>Badges</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                    isActive('/dashboard') ? 'bg-slate-100 text-brand-purple' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-purple" />
                  <span>User Dashboard</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              <Link
                href="/trips/create"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl bg-brand-purple text-white font-bold text-xs shadow-sm hover:bg-brand-purple/90"
              >
                Share a Trip
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-1.5 flex items-center justify-between shadow-lg pb-safe">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all touch-target ${
            isActive('/') ? 'text-brand-purple font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/trips"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all touch-target ${
            isActive('/trips') ? 'text-brand-purple font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </Link>

        {/* Highlighted Central Share Action */}
        <Link
          href="/trips/create"
          aria-label="Share Trip"
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-brand-purple text-white shadow-lg border-2 border-white transform active:scale-95 transition-transform shrink-0"
        >
          <PlusCircle className="w-6 h-6 text-brand-cyan" />
        </Link>

        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all touch-target ${
            isActive('/dashboard') ? 'text-brand-purple font-bold' : 'text-slate-500'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Saved</span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-slate-500 hover:text-brand-purple touch-target"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
