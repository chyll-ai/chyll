import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use the actual production values directly since this is a public project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE';

console.log('Supabase config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  origin: window.location.origin
});

// Create the Supabase client with improved configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token',
      // Remove flowType to use default PKCE
      debug: true // Enable debug mode temporarily to help diagnose issues
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-v2'
      }
    }
  }
);

// Clear any stale auth data on init
Object.keys(localStorage)
  .filter(key => key.startsWith('supabase.auth.token'))
  .forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Error parsing auth data:', e);
      localStorage.removeItem(key);
    }
  });

// Set up auth state change handler with improved session management
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Auth] State change:', { 
    event, 
    userId: session?.user?.id,
    hasSession: !!session,
    accessToken: session?.access_token ? 'present' : 'missing',
    currentUrl: window.location.href,
    origin: window.location.origin,
    timestamp: new Date().toISOString(),
    localStorage: {
      hasToken: !!localStorage.getItem('supabase.auth.token'),
      allKeys: Object.keys(localStorage).filter(key => key.startsWith('supabase'))
    }
  });

  // Clear local storage on sign out
  if (event === 'SIGNED_OUT') {
    Object.keys(localStorage)
      .filter(key => key.startsWith('supabase'))
      .forEach(key => localStorage.removeItem(key));
  }
});

// Export a singleton instance
export const supabaseInstance = supabase;
