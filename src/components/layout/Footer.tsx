'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, locale } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800 pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center shrink-0">
              <div className="h-14 w-auto flex items-center justify-center">
                <ImageWithFallback
                  src="/images/logo.png"
                  fallbackSrc="/logo.png"
                  alt="Ghurabo"
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {locale === 'bn'
                ? 'বাস্তব ট্রিপ, বাস্তব খরচ, বাস্তব অভিজ্ঞতা। ভ্রমণকারীদের শেয়ার করা আসল ট্রিপ ও খরচের হিসাব দিয়ে আপনার ভ্রমণ সুন্দর করুন।'
                : 'Real Trips. Real Costs. Real Experiences. Plan better with authentic travel experiences shared by real travelers.'}
            </p>
            <div className="pt-1">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Explore</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/trips" className="hover:text-brand-sky transition-colors py-1 block">Explore All Trips</Link></li>
              <li><Link href="/budget-trips" className="hover:text-brand-sky transition-colors py-1 block">Search by Budget</Link></li>
              <li><Link href="/destinations" className="hover:text-brand-sky transition-colors py-1 block">Popular Destinations</Link></li>
              <li><Link href="/questions" className="hover:text-brand-sky transition-colors py-1 block">Community Q&A</Link></li>
            </ul>
          </div>

          {/* Column 2: Travel Styles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Travel Styles</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/trips?style=student-budget" className="hover:text-brand-sky transition-colors py-1 block">Student Budget Trips</Link></li>
              <li><Link href="/trips?style=family-holiday" className="hover:text-brand-sky transition-colors py-1 block">Family Holidays</Link></li>
              <li><Link href="/trips?style=couple-getaway" className="hover:text-brand-sky transition-colors py-1 block">Couple Getaways</Link></li>
              <li><Link href="/trips?style=friends-trip" className="hover:text-brand-sky transition-colors py-1 block">Friends Trips</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/dashboard" className="hover:text-brand-sky transition-colors py-1 block">User Dashboard</Link></li>
              <li><Link href="/challenges" className="hover:text-brand-sky transition-colors py-1 block">Achievements</Link></li>
              <li><Link href="/admin" className="hover:text-brand-sky transition-colors py-1 block">Admin Portal</Link></li>
              <li><Link href="/admin/seo" className="hover:text-brand-sky transition-colors py-1 block">SEO Control Dashboard</Link></li>
              <li><Link href="/trips/create" className="hover:text-brand-sky transition-colors py-1 block">Share a Trip</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Ghurabo Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for real travelers in Bangladesh & worldwide</span>
            <Heart className="w-3.5 h-3.5 text-brand-purple fill-brand-purple" />
          </div>
        </div>
      </div>
    </footer>
  );
};
