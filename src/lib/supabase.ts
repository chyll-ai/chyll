import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use the actual Supabase project values
const supabaseUrl = 'https://atsfuqwxfrezkxtnctmk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE';

// Simplified custom storage implementation
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

      // For OAuth flow, allow non-JSON values (like code verifier strings)
      if (key.includes('code_verifier') || key.includes('state')) {
        return item;
      }
      
      // For session data, validate JSON format
      try {
        const parsed = JSON.parse(item);
        
        // Check session expiration with a 5-minute buffer for session data
        if (parsed.expires_at) {
          const expiresAt = new Date(parsed.expires_at);
          const now = new Date();
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
          
          if ((expiresAt.getTime() - now.getTime()) < fiveMinutes) {
            console.debug(`[Storage] Session expired or expiring soon for key: ${key}`);
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            return null;
          }
        }
        
        return item;
      } catch (parseError) {
        // If it's not JSON, return as-is (for OAuth flow strings)
        return item;
      }
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
      // For OAuth flow values (code verifier, state), store directly
      if (key.includes('code_verifier') || key.includes('state')) {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        console.debug(`[Storage] Successfully stored OAuth item for key: ${key}`);
        return;
      }
      
      // For session data, validate JSON format
      try {
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid session data format');
        }
      } catch (parseError) {
        // If it's not JSON, store it anyway (for OAuth strings)
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        console.debug(`[Storage] Successfully stored non-JSON item for key: ${key}`);
        return;
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

// Create the Supabase client with minimal configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token'
    }
  }
);

// Set up auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Auth] State change:', { event, userId: session?.user?.id });
  
  if (event === 'SIGNED_IN' && session) {
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  }
  
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('supabase.auth.token');
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
