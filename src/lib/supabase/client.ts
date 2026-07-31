import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-id')) {
    // Return null or dummy handler when Supabase environment variables are missing
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
