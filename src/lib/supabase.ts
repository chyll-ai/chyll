import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

// Custom storage implementation with improved error handling
const customStorage = {
  getItem: (key: string): string | null => {
    try {
      // Try localStorage first
      let item = localStorage.getItem(key);
      
      // If not in localStorage, try sessionStorage
      if (!item) {
        item = sessionStorage.getItem(key);
      }
      
      if (!item) {
        console.debug(`[Storage] No item found for key: ${key}`);
        return null;
      }
      
      // Parse and validate the stored session
      const session = JSON.parse(item);
      
      // Check for required session properties
      if (!session || typeof session !== 'object') {
        console.debug(`[Storage] Invalid session format for key: ${key}`);
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        return null;
      }

      // Check session expiration with a 5-minute buffer
      const expiresAt = session.expires_at ? new Date(session.expires_at) : null;
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (expiresAt && (expiresAt.getTime() - now.getTime()) < fiveMinutes) {
        console.debug(`[Storage] Session expired or expiring soon for key: ${key}`);
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        return null;
      }

      return item;
    } catch (error) {
      console.error('[Storage] Error reading from storage:', error);
      // Clean up potentially corrupted data
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      // Validate that the value is a valid JSON string before storing
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid session data format');
      }
      
      // Store in both localStorage and sessionStorage for redundancy
      localStorage.setItem(key, value);
      sessionStorage.setItem(key, value);
      console.debug(`[Storage] Successfully stored item for key: ${key}`);
    } catch (error) {
      console.error('[Storage] Error writing to storage:', error);
      // Clean up on error
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      console.debug(`[Storage] Successfully removed item for key: ${key}`);
    } catch (error) {
      console.error('[Storage] Error removing from storage:', error);
    }
  }
};

// Create the Supabase client with proper configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
      storage: customStorage,
      flowType: 'implicit'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-v2'
      }
    }
  }
);

// Set up auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
  console.debug('[Auth] State change:', { event, userId: session?.user?.id });
  
  if (event === 'SIGNED_IN') {
    console.debug('[Auth] User signed in, storing session');
    if (session) {
      customStorage.setItem('supabase.auth.token', JSON.stringify(session));
    }
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.debug('[Auth] Token refreshed successfully');
    if (session) {
      customStorage.setItem('supabase.auth.token', JSON.stringify(session));
    }
  }
  
  if (event === 'SIGNED_OUT') {
    console.debug('[Auth] User signed out, cleaning up storage');
    customStorage.removeItem('supabase.auth.token');
  }

  // Handle session recovery
  if (event === 'INITIAL_SESSION') {
    console.debug('[Auth] Initial session setup');
    if (!session) {
      console.debug('[Auth] No initial session, checking storage');
      debugStorage();
      const storedSession = customStorage.getItem('supabase.auth.token');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
            console.debug('[Auth] Found expired session, cleaning up');
            customStorage.removeItem('supabase.auth.token');
          }
        } catch (error) {
          console.error('[Auth] Error parsing stored session:', error);
          customStorage.removeItem('supabase.auth.token');
        }
      }
    }
  }
});

// Debug utility to inspect storage
export const debugStorage = () => {
  console.group('Local Storage Debug');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes('supabase')) {
      console.log(`${key}:`, localStorage.getItem(key));
    }
  }
  console.groupEnd();
};

// Export a singleton instance
export const supabaseInstance = supabase; 