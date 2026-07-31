'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Heart, MessageSquare, Sparkles, UserPlus } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      type: 'welcome',
      title: 'Welcome to Ghurabo!',
      message: 'Explore authentic Bangladesh trip costs, share your stories, and plan budget getaways.',
      time: 'Just now',
      isRead: false
    },
    {
      id: 'n-2',
      type: 'community',
      title: 'Community Tip Verified',
      message: 'Your Sajek Valley transport tip was confirmed accurate by 12 travelers.',
      time: '2 hours ago',
      isRead: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-3">
            <Bell className="w-8 h-8 text-brand-purple" />
            <span>Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stay updated with community comments, trip cost confirmations, and account activity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
        >
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
              !n.isRead
                ? 'bg-brand-purple/5 border-brand-purple/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs font-heading">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
