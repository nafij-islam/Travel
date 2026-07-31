'use client';

import React, { useState } from 'react';
import { TripCostConfirmationStats } from '@/lib/types';
import { CheckCircle2, AlertTriangle, TrendingUp, ArrowDown, ThumbsUp } from 'lucide-react';

interface CostConfirmationProps {
  stats: TripCostConfirmationStats;
}

export const CostConfirmation: React.FC<CostConfirmationProps> = ({ stats }) => {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [confirmStats, setConfirmStats] = useState(stats);

  const handleVote = (option: 'stillAccurate' | 'slightlyHigher' | 'muchHigher' | 'lowerPossible') => {
    if (userVote) return;
    setUserVote(option);
    setConfirmStats((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-green" />
            <span>Community Price Accuracy Confirmation</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed by travelers who recently completed this route. Last updated {confirmStats.lastConfirmedDate}.
          </p>
        </div>
      </div>

      {/* Voting Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <button
          onClick={() => handleVote('stillAccurate')}
          disabled={!!userVote}
          className={`p-3 rounded-2xl border text-left transition-all ${
            userVote === 'stillAccurate'
              ? 'bg-brand-green/20 border-brand-green text-slate-900 ring-2 ring-brand-green/30'
              : 'bg-slate-50 border-slate-200 hover:border-brand-purple hover:bg-brand-cyan/20'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ThumbsUp className="w-4 h-4 text-brand-green" />
            <span>Still Accurate</span>
          </div>
          <div className="text-lg font-black text-navy-900 mt-1">{confirmStats.stillAccurate}</div>
        </button>

        <button
          onClick={() => handleVote('slightlyHigher')}
          disabled={!!userVote}
          className={`p-3 rounded-2xl border text-left transition-all ${
            userVote === 'slightlyHigher'
              ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
              : 'bg-slate-50 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Slightly Higher</span>
          </div>
          <div className="text-lg font-black text-navy-900 mt-1">{confirmStats.slightlyHigher}</div>
        </button>

        <button
          onClick={() => handleVote('muchHigher')}
          disabled={!!userVote}
          className={`p-3 rounded-2xl border text-left transition-all ${
            userVote === 'muchHigher'
              ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
              : 'bg-slate-50 border-slate-200 hover:border-rose-500 hover:bg-rose-50/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Much Higher</span>
          </div>
          <div className="text-lg font-black text-navy-900 mt-1">{confirmStats.muchHigher}</div>
        </button>

        <button
          onClick={() => handleVote('lowerPossible')}
          disabled={!!userVote}
          className={`p-3 rounded-2xl border text-left transition-all ${
            userVote === 'lowerPossible'
              ? 'bg-brand-cyan border-brand-sky text-slate-900 ring-2 ring-brand-sky/30'
              : 'bg-slate-50 border-slate-200 hover:border-brand-sky hover:bg-brand-cyan/30'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ArrowDown className="w-4 h-4 text-brand-sky" />
            <span>Lower Possible</span>
          </div>
          <div className="text-lg font-black text-navy-900 mt-1">{confirmStats.lowerPossible}</div>
        </button>
      </div>

      {userVote && (
        <p className="text-xs font-semibold text-brand-purple pt-1">
          ✓ Thank you! Your cost confirmation vote has been counted to keep Jatrio prices accurate.
        </p>
      )}
    </div>
  );
};
