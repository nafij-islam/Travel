import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (cleanEmail !== 'sahariannafis70@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized email for admin setup' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cayozsonqtzgrtqugxvw.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      return NextResponse.json({ error: 'Supabase service role key is not configured' }, { status: 500 });
    }

    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. List users to check if sahariannafis70@gmail.com exists
    const { data: usersData } = await adminSupabase.auth.admin.listUsers();
    const existingUser = usersData?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

    let userId = existingUser?.id;

    if (existingUser) {
      // Update password & confirm email for existing user
      await adminSupabase.auth.admin.updateUserById(existingUser.id, {
        password: cleanPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Nafij Islam (Super Admin)',
          username: 'sahariannafis70',
          role: 'super_admin'
        }
      });
    } else {
      // Create user if doesn't exist
      const { data: newUser, error: createErr } = await adminSupabase.auth.admin.createUser({
        email: cleanEmail,
        password: cleanPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Nafij Islam (Super Admin)',
          username: 'sahariannafis70',
          role: 'super_admin'
        }
      });

      if (createErr) {
        return NextResponse.json({ error: createErr.message }, { status: 400 });
      }

      userId = newUser?.user?.id;
    }

    // 2. Ensure Super Admin role in user_roles table
    if (userId) {
      await adminSupabase.from('profiles').upsert(
        {
          id: userId,
          full_name: 'Nafij Islam (Super Admin)',
          username: 'sahariannafis70',
          email: cleanEmail
        },
        { onConflict: 'id' }
      );

      await adminSupabase.from('user_roles').upsert(
        {
          user_id: userId,
          role: 'super_admin'
        },
        { onConflict: 'user_id,role' }
      );
    }

    // 3. Generate auth session
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NRHS9r7QQm8T2JfSloLHHg_3RPfEYcT';
    const clientSupabase = createClient(supabaseUrl, anonKey);
    const { data: sessionData, error: sessionErr } = await clientSupabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (sessionErr) {
      return NextResponse.json({ error: sessionErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, session: sessionData.session });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
