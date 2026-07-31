'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const isSuperAdminEmail = email.trim().toLowerCase() === 'sahariannafis70@gmail.com';
    const targetRedirect = redirectPath || (isSuperAdminEmail ? '/admin' : '/dashboard');

    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      router.push(targetRedirect);
      return;
    }

    try {
      // Direct Super Admin Provisioning & Sign-in Route
      if (isSuperAdminEmail) {
        const res = await fetch('/api/auth/super-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password: password.trim() })
        });
        const result = await res.json();

        if (result.success && result.session) {
          if (supabase) {
            await supabase.auth.setSession(result.session);
          }
          router.push(targetRedirect);
          router.refresh();
          return;
        } else if (result.error) {
          setErrorMessage(result.error);
          setLoading(false);
          return;
        }
      }

      let activeUser = null;
      let activeSession = null;

      // Regular User Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (data?.session) {
        activeUser = data.user;
        activeSession = data.session;
      } else if (error && isSuperAdminEmail) {
        // 2. Auto-Create Account if Super Admin login attempted on fresh project
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: 'Nafij Islam (Super Admin)',
              username: 'sahariannafis70',
              role: 'super_admin'
            }
          }
        });

        if (signUpErr) {
          setErrorMessage(signUpErr.message);
          setLoading(false);
          return;
        }

        activeUser = signUpData.user;
        activeSession = signUpData.session;
      } else if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // 3. Promote Super Admin in user_roles table & metadata if needed
      if (activeUser && isSuperAdminEmail) {
        await supabase.auth.updateUser({
          data: {
            full_name: 'Nafij Islam (Super Admin)',
            username: 'sahariannafis70',
            role: 'super_admin'
          }
        });

        await supabase
          .from('user_roles')
          .upsert({ user_id: activeUser.id, role: 'super_admin' }, { onConflict: 'user_id,role' });
      }

      if (activeSession || activeUser) {
        router.push(targetRedirect);
        router.refresh();
      } else {
        setErrorMessage('Check your inbox to verify your email address before signing in.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
            Sign In to <span className="text-brand-purple">Ghurabo</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your travel reports, saved itineraries, and Ghurabo Control Center.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sahariannafis70@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-bold text-brand-purple flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin Quick Login</span>
          </div>
          <p>Login with <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-mono">sahariannafis70@gmail.com</code> for immediate Control Center access.</p>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-brand-purple font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
