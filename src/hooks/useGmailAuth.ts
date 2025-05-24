import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface GmailAuthState {
  isConnected: boolean;
  isChecking: boolean;
  lastCheck: number;
  error: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const stateCache = new Map<string, GmailAuthState>();

export const useGmailAuth = () => {
  const [state, setState] = useState<GmailAuthState>({
    isConnected: false,
    isChecking: false,
    lastCheck: 0,
    error: null
  });
  
  // Use a ref to track ongoing operations
  const checkingRef = useRef(false);

  const checkConnection = async (userId: string) => {
    try {
      console.log('Starting Gmail connection check for user:', userId);
      
      // Use ref to prevent concurrent checks
      if (checkingRef.current) {
        console.log('Check already in progress, skipping');
        return state.isConnected;
      }
      
      checkingRef.current = true;
      setState(prev => ({ ...prev, isChecking: true, error: null }));

      // Check cache first
      const cached = stateCache.get(userId);
      const now = Date.now();
      if (cached && now - cached.lastCheck < CACHE_DURATION) {
        console.log('Using cached Gmail connection status:', cached);
        setState(cached);
        checkingRef.current = false;
        return cached.isConnected;
      }

      // Get Gmail token
      console.log('Fetching Gmail token from database...');
      const { data: tokenData, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (tokenError) {
        console.error('Error fetching Gmail token:', tokenError);
        throw new Error('Failed to check Gmail connection');
      }

      // If we have a token, verify it's still valid
      if (tokenData?.access_token) {
        try {
          const testResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`
            }
          });
          
          if (testResponse.ok) {
            console.log('Token is valid');
            const newState = {
              isConnected: true,
              isChecking: false,
              lastCheck: now,
              error: null
            };
            setState(newState);
            stateCache.set(userId, newState);
            checkingRef.current = false;
            return true;
          } else {
            console.log('Token is invalid, removing from database');
            // Token is invalid, remove it
            await supabase
              .from('tokens')
              .delete()
              .eq('client_id', userId);
          }
        } catch (error) {
          console.log('Error testing token:', error);
          // On network error, assume token might still be valid
          if (error instanceof TypeError) {
            const newState = {
              isConnected: true,
              isChecking: false,
              lastCheck: now,
              error: null
            };
            setState(newState);
            stateCache.set(userId, newState);
            checkingRef.current = false;
            return true;
          }
        }
      }

      const newState = {
        isConnected: false,
        isChecking: false,
        lastCheck: now,
        error: null
      };
      setState(newState);
      stateCache.set(userId, newState);
      checkingRef.current = false;
      return false;

    } catch (error: any) {
      console.error('Error checking Gmail connection:', error);
      const newState = {
        isConnected: false,
        isChecking: false,
        lastCheck: Date.now(),
        error: error.message
      };
      setState(newState);
      stateCache.set(userId, newState);
      checkingRef.current = false;
      return false;
    }
  };

  const connect = async (userId: string) => {
    try {
      console.log('Starting Gmail connection process for user:', userId);
      
      // Use ref to prevent concurrent connections
      if (checkingRef.current) {
        console.log('Connection already in progress, skipping');
        return;
      }
      
      checkingRef.current = true;
      setState(prev => ({ ...prev, isChecking: true, error: null }));
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Failed to get user session');
      }

      if (!session) {
        throw new Error('No active session found');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'connect',
          client_id: userId,
          redirect_url: window.location.origin + window.location.pathname
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Gmail connection response:', result);
        throw new Error(result.error || result.message || 'Failed to initiate Gmail connection');
      }
      
      console.log('Gmail connection response:', result);
      
      if (result.oauth_url) {
        console.log('Opening OAuth URL:', result.oauth_url);
        window.location.href = result.oauth_url;
      } else if (result.access_token) {
        console.log('Already connected to Gmail');
        toast.success('Already connected to Gmail');
        await checkConnection(userId);
      } else {
        console.error('Invalid response:', result);
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error('Error connecting Gmail:', error);
      toast.error(error.message || 'Failed to connect Gmail');
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isChecking: false,
        isConnected: false
      }));
    } finally {
      checkingRef.current = false;
    }
  };

  const disconnect = async (userId: string) => {
    try {
      console.log('Disconnecting Gmail for user:', userId);
      
      // Use ref to prevent concurrent operations
      if (checkingRef.current) {
        console.log('Operation already in progress, skipping');
        return;
      }
      
      checkingRef.current = true;
      setState(prev => ({ ...prev, isChecking: true, error: null }));
      
      const { error } = await supabase
        .from('tokens')
        .delete()
        .eq('client_id', userId);

      if (error) {
        console.error('Error deleting Gmail token:', error);
        throw new Error('Failed to disconnect Gmail');
      }

      console.log('Gmail disconnected successfully');
      const newState = {
        isConnected: false,
        isChecking: false,
        lastCheck: Date.now(),
        error: null
      };
      setState(newState);
      stateCache.set(userId, newState);
      toast.success('Gmail disconnected successfully');

    } catch (error: any) {
      console.error('Error disconnecting Gmail:', error);
      toast.error(error.message || 'Failed to disconnect Gmail');
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isChecking: false,
        isConnected: false 
      }));
    } finally {
      checkingRef.current = false;
    }
  };

  useEffect(() => {
    console.log('Initializing Gmail auth hook');
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.id) {
        console.log('Found active session, checking connection...');
        await checkConnection(data.session.user.id);
      } else {
        console.log('No active session found');
        setState(prev => ({ ...prev, isChecking: false }));
      }
    };
    
    initializeAuth();
    
    return () => {
      // Clean up on unmount
      checkingRef.current = false;
    };
  }, []);

  return {
    ...state,
    checkConnection,
    connect,
    disconnect
  };
}; 