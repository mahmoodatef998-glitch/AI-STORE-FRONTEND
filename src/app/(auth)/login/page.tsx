'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient();

  // Convert username/phone to email format for Supabase
  const formatUsernameToEmail = (input: string): string => {
    // If it's already an email, return as is
    if (input.includes('@')) {
      return input;
    }
    // If it's a phone number (starts with + or digits), format it
    if (/^\+?[0-9]+$/.test(input)) {
      return `${input}@phone.local`;
    }
    // Otherwise, treat as username
    return `${input}@local`;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Debug: Check environment variables
    if (typeof window !== 'undefined') {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      console.log('🔍 Environment Check:');
      console.log('Supabase URL:', supabaseUrl || '❌ MISSING');
      console.log('Supabase Key:', supabaseKey ? '✅ EXISTS (' + supabaseKey.substring(0, 20) + '...)' : '❌ MISSING');
    }

    try {
      // Convert username/phone to email format
      const emailFormat = formatUsernameToEmail(username);

      // Debug: Log what we're sending
      console.log('🔐 Login Attempt:');
      console.log('  Username input:', username);
      console.log('  Email format:', emailFormat);
      console.log('  Password length:', password.length);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailFormat,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Get fresh session and store token
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          localStorage.setItem('supabase.auth.token', session.access_token);
        }
        // Wait a bit to ensure token is stored
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Equipment Inventory
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Username or Phone Number"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin or 00243540000"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}

