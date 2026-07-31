'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  Lock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { useTheme } from '@/context/ThemeContext';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'privacy'>('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form States
  const [profile, setProfile] = useState({
    id: '',
    fullName: 'Nafij Islam',
    username: 'sahariannafis70',
    email: 'sahariannafis70@gmail.com',
    phoneNumber: '+8801700000000',
    avatarUrl: '',
    bio: 'Avid explorer traveling across Bangladesh.',
    homeCity: 'Dhaka',
    preferredLanguage: 'en'
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setProfile((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          fullName: session.user.user_metadata?.full_name || prev.fullName,
          username: session.user.user_metadata?.username || prev.username,
          phoneNumber: session.user.user_metadata?.phone_number || prev.phoneNumber,
          avatarUrl: session.user.user_metadata?.avatar_url || prev.avatarUrl,
          homeCity: session.user.user_metadata?.home_city || prev.homeCity
        }));
      }
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const supabase = createClient();
      if (supabase && profile.id) {
        // Update Supabase profile
        await supabase
          .from('profiles')
          .update({
            full_name: profile.fullName,
            username: profile.username,
            avatar_url: profile.avatarUrl,
            bio: profile.bio,
            home_city: profile.homeCity,
            preferred_language: profile.preferredLanguage
          })
          .eq('id', profile.id);

        // Update User Metadata
        await supabase.auth.updateUser({
          data: {
            full_name: profile.fullName,
            username: profile.username,
            avatar_url: profile.avatarUrl,
            phone_number: profile.phoneNumber,
            home_city: profile.homeCity
          }
        });
      }

      setSuccessMessage('Account settings updated successfully!');
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: passwordState.newPassword
        });
        if (error) throw error;
      }

      setSuccessMessage('Password changed successfully!');
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ghurabo_account_data_${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-brand-purple" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Manage your personal profile, notification preferences, security settings, and theme choices.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'security'
              ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'preferences'
              ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Preferences & Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors ${
            activeTab === 'privacy'
              ? 'bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Data & Privacy</span>
        </button>
      </div>

      {/* Notifications Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Profile Info */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <AvatarUploader
              currentAvatarUrl={profile.avatarUrl}
              userId={profile.id}
              onAvatarChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              size="lg"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Profile Avatar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a clear profile picture (WebP, PNG, or JPG up to 5 MB). This photo appears on your public trip reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Managed via Supabase Auth</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="+880 1700 000000"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Home City</label>
              <input
                type="text"
                value={profile.homeCity}
                onChange={(e) => setProfile({ ...profile, homeCity: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-purple" />
            <span>Change Password</span>
          </h3>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordState.confirmPassword}
                onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Preferences & Theme */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Appearance & Theme</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                theme === 'light'
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold ring-2 ring-brand-purple/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="text-xs">Light Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                theme === 'dark'
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold ring-2 ring-brand-purple/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-6 h-6 text-indigo-400" />
              <span className="text-xs">Dark Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                theme === 'system'
                  ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold ring-2 ring-brand-purple/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Monitor className="w-6 h-6 text-slate-400" />
              <span className="text-xs">System Preference</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Data & Privacy */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Account Data & Export</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You can download a complete JSON archive of your Ghurabo profile, travel reports, and activity logs at any time.
            </p>

            <button
              type="button"
              onClick={handleDownloadData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-brand-purple" />
              <span>Download Account Data (JSON)</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 font-heading">Danger Zone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deleting your account will permanently remove your profile, travel stories, photos, and bookmarks. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
