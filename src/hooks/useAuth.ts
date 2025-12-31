import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient, signOut as supabaseSignOut } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Store token if session exists
          if (session?.access_token) {
            localStorage.setItem('supabase.auth.token', session.access_token);
          } else {
            localStorage.removeItem('supabase.auth.token');
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);

      // Update token in localStorage
      if (session?.access_token) {
        localStorage.setItem('supabase.auth.token', session.access_token);
      } else {
        localStorage.removeItem('supabase.auth.token');
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.token');
        router.push('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('supabase.auth.token');
      await supabaseSignOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if sign out fails
      localStorage.removeItem('supabase.auth.token');
      router.push('/login');
    }
  };

  const getUserRole = (): string => {
    return (user?.user_metadata?.role as string) || 'staff';
  };

  const isAdmin = (): boolean => {
    return getUserRole() === 'admin';
  };

  return {
    user,
    loading,
    signOut: handleSignOut,
    getUserRole,
    isAdmin,
  };
}
