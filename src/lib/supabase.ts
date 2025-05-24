import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY');
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('Creating new Supabase client instance');
    supabaseInstance = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 40
          },
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY
          }
        },
        db: {
          schema: 'public'
        }
      }
    );

    // Set up global error handler for realtime client
    supabaseInstance.realtime.setAuth(import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Monitor realtime connection status using a system channel
    const channel = supabaseInstance.channel('system')
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime connection established');
        } else if (status === 'CLOSED') {
          console.log('Realtime connection lost');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime connection error');
        }
      });

    // Ensure clean disconnection
    window.addEventListener('beforeunload', () => {
      channel.unsubscribe();
      supabaseInstance?.realtime.disconnect();
    });
  }
  return supabaseInstance;
};

// Initialize the singleton instance
export const supabase = getSupabaseClient(); 