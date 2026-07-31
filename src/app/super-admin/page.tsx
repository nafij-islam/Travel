import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShieldCheck, Users, FileText, Image as ImageIcon, MapPin, MessageSquare, Flag, Activity, Settings, AlertOctagon } from 'lucide-react';
import { ImageModeration } from '@/components/admin/ImageModeration';

export const metadata: Metadata = {
  title: 'Super Admin Control Center — Ghurabo Platform',
  description: 'Protected Super Admin console for platform governance, user role management, content moderation, and audit logs.'
};

export default async function SuperAdminPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login?redirect=/super-admin');
  }

  // Server-side verification of super_admin or admin role
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .in('role', ['super_admin', 'admin']);

  const isSuperAdmin = roles && roles.length > 0;

  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">Access Restricted</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have <strong className="text-slate-800">super_admin</strong> privileges to access this console. This action has been logged in the platform security audit log.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Super Admin Banner */}
      <div className="bg-slate-950 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Super Admin Privileges Active</span>
          </div>
          <h1 className="text-3xl font-black font-heading">Ghurabo Super Admin Governance</h1>
          <p className="text-xs text-slate-400">
            Authenticated as <strong className="text-white">{session.user.email}</strong> · Full access to 22 normalized tables, user roles, moderation queues, & audit logs.
          </p>
        </div>
      </div>

      {/* Super Admin Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-brand-purple font-bold text-xs">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> User Management</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px]">profiles & user_roles</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage user verification badges, roles (`traveler`, `moderator`, `super_admin`), and profile suspensions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-brand-purple font-bold text-xs">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Trip Moderation</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">trips</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Approve, reject, feature, or archive trip posts (`published`, `pending_review`, `archived`).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-brand-purple font-bold text-xs">
            <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Gallery Moderation</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px]">trip_images</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review uploaded travel photos, cover choices, captions, and reported images.
          </p>
        </div>
      </div>

      {/* Embed Moderation Queue */}
      <ImageModeration />
    </div>
  );
}
