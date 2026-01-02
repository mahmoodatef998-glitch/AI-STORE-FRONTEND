import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables. Please check your .env.local file or Vercel Environment Variables.';
  console.error('❌', error);
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ ' + supabaseUrl.substring(0, 30) + '...' : '❌ MISSING');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ EXISTS (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ MISSING');
  console.error('');
  console.error('📋 To fix this:');
  console.error('1. Go to Vercel Dashboard → Settings → Environment Variables');
  console.error('2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('3. Redeploy your application');
  console.error('');
  
  // In production, we should throw an error
  if (typeof window === 'undefined') {
    throw new Error(error);
  }
}

// Additional validation: Check if API key looks valid (starts with eyJ or sb_publishable)
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ') && !supabaseAnonKey.startsWith('sb_publishable')) {
  console.warn('⚠️  WARNING: NEXT_PUBLIC_SUPABASE_ANON_KEY does not look like a valid key.');
  console.warn('   Make sure you are using the "publishable" or "anon public" key, not the "service_role" key.');
  console.warn('   Get it from: Supabase Dashboard → Settings → API → PUBLISHABLE key (or anon/public key)');
}

// Client-side Supabase client with optimized configuration
export const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'pkce', // Use PKCE flow for better security
    },
    global: {
      headers: {
        'X-Client-Info': 'ai-store-frontend',
      },
    },
  });
};

// Server-side Supabase client (for API routes and Server Components)
export const createServerSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Get current session token
export const getSessionToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const supabase = createSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session?.access_token || null;
  } catch (error) {
    console.error('Error in getSessionToken:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const supabase = createSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return false;
    }

    return !!session?.user;
  } catch (error) {
    return false;
  }
};

// Sign out user
export const signOut = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    
    // Clear any stored tokens
    localStorage.removeItem('supabase.auth.token');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
