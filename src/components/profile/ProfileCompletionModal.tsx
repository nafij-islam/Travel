'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, User, Phone, Mail, Camera } from 'lucide-react';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileState: {
    fullName: string;
    username: string;
    emailVerified: boolean;
    phoneNumber: string;
    hasAvatar: boolean;
  };
}

export function ProfileCompletionModal({
  isOpen,
  onClose,
  profileState
}: ProfileCompletionModalProps) {
  if (!isOpen) return null;

  const checks = [
    { label: 'Full Name', completed: !!profileState.fullName, icon: User },
    { label: 'Unique Username', completed: !!profileState.username, icon: User },
    { label: 'Verified Email', completed: profileState.emailVerified, icon: Mail },
    { label: 'Phone Number', completed: !!profileState.phoneNumber, icon: Phone },
    { label: 'Profile Picture', completed: profileState.hasAvatar, icon: Camera }
  ];

  const allCompleted = checks.every((c) => c.completed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
            Complete Your Traveler Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            To ensure genuine travel cost reports across Bangladesh, please complete all required profile fields before publishing your trip.
          </p>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          {checks.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                <c.icon className="w-4 h-4 text-slate-400" />
                <span>{c.label}</span>
              </div>
              {c.completed ? (
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                  <XCircle className="w-4 h-4" /> Required
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Save as Draft First
          </button>

          <Link
            href="/settings"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-brand-purple text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-purple/90 transition-colors shadow-md"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
