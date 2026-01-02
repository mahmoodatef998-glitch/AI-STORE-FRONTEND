'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          router.push('/dashboard');
        }
      } catch (err) {
        // Ignore errors, user is not logged in
      }
    };

    checkSession();
  }, [router]);

  // Convert username/phone to email format for Supabase
  const formatUsernameToEmail = (input: string): string => {
    // Trim whitespace
    const trimmed = input.trim();
    
    // If it's already an email, return as is
    if (trimmed.includes('@')) {
      return trimmed.toLowerCase();
    }
    
    // If it's a phone number (starts with + or digits), format it
    if (/^\+?[0-9]+$/.test(trimmed)) {
      return `${trimmed}@phone.local`;
    }
    
    // Otherwise, treat as username - use @example.com for better Supabase compatibility
    return `${trimmed}@example.com`;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo('');

    // Validate inputs
    if (!username.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseClient();

      // Debug: Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      const debugMessages: string[] = [];
      debugMessages.push('🔍 Environment Check:');
      debugMessages.push(`  Supabase URL: ${supabaseUrl ? '✅ ' + supabaseUrl.substring(0, 30) + '...' : '❌ MISSING'}`);
      
      if (supabaseKey) {
        if (supabaseKey.startsWith('eyJ')) {
          debugMessages.push(`  Supabase Key: ✅ EXISTS (${supabaseKey.substring(0, 20)}...) - Looks valid`);
        } else {
          debugMessages.push(`  Supabase Key: ⚠️ EXISTS (${supabaseKey.substring(0, 20)}...) - May be invalid (should start with 'eyJ')`);
        }
      } else {
        debugMessages.push(`  Supabase Key: ❌ MISSING`);
      }
      
      // If environment variables are missing, show error immediately
      if (!supabaseUrl || !supabaseKey) {
        const missingVars = [];
        if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!supabaseKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        
        setError(
          `Missing Environment Variables: ${missingVars.join(', ')}\n\n` +
          'Please add them in Vercel Dashboard → Settings → Environment Variables and redeploy.'
        );
        setLoading(false);
        console.error('❌ Missing Environment Variables:', missingVars);
        return;
      }
      
      // Convert username/phone to email format
      const emailFormat = formatUsernameToEmail(username);
      
      debugMessages.push('');
      debugMessages.push('🔐 Login Attempt:');
      debugMessages.push(`  Username input: "${username}"`);
      debugMessages.push(`  Email format: "${emailFormat}"`);
      debugMessages.push(`  Password length: ${password.length}`);
      
      setDebugInfo(debugMessages.join('\n'));
      console.log(debugMessages.join('\n'));

      // Attempt login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailFormat,
        password: password,
      });

      if (authError) {
        console.error('❌ Auth Error:', authError);
        console.error('Error Code:', authError.status);
        console.error('Error Message:', authError.message);
        
        // Check if it's an API key issue
        if (authError.message.includes('Invalid API key') || authError.status === 401) {
          const errorDetails = [
            '❌ Invalid API key error detected!',
            '',
            'This usually means:',
            '1. Environment Variables are missing in Vercel',
            '2. Environment Variables are incorrect',
            '3. Application needs to be redeployed after adding variables',
            '',
            '🔧 To fix:',
            '1. Go to Vercel Dashboard → Settings → Environment Variables',
            '2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
            '3. Redeploy the application (Use existing Build Cache = No)',
            '',
            '📋 Current Environment Status:',
            `  URL: ${supabaseUrl ? '✅ Set' : '❌ MISSING'}`,
            `  Key: ${supabaseKey ? (supabaseKey.startsWith('eyJ') ? '✅ Set (looks valid)' : '⚠️ Set but may be invalid') : '❌ MISSING'}`,
          ];
          
          console.error(errorDetails.join('\n'));
          
          setError(
            'Invalid API key. Please check Vercel Environment Variables:\n' +
            '1. Go to Vercel → Settings → Environment Variables\n' +
            '2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
            '3. Redeploy the application'
          );
          setLoading(false);
          return;
        }
        
        // Provide user-friendly error messages for other errors
        let errorMessage = 'Failed to login';
        
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid username or password. Please check your credentials.';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in.';
        } else if (authError.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          errorMessage = authError.message || 'An error occurred during login';
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Login failed: No user data received');
        setLoading(false);
        return;
      }

      // Verify session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session Error:', sessionError);
        setError('Failed to create session. Please try again.');
        setLoading(false);
        return;
      }

      if (!session) {
        setError('Login failed: No session created');
        setLoading(false);
        return;
      }

      // Store token in localStorage for API calls
      if (session.access_token) {
        localStorage.setItem('supabase.auth.token', session.access_token);
        console.log('✅ Token stored successfully');
      }

      // Wait a moment to ensure everything is saved
      await new Promise(resolve => setTimeout(resolve, 200));

      // Redirect to dashboard
      console.log('✅ Login successful, redirecting to dashboard...');
      router.push('/dashboard');
      router.refresh();

    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
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
              disabled={loading}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !username.trim() || !password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-48">
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
}
