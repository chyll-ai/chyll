import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    isChecking: true,
    lastCheck: 0,
    error: null
  });

  const checkConnection = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, isChecking: true, error: null }));

      // Check cache first
      const cached = stateCache.get(userId);
      if (cached && Date.now() - cached.lastCheck < CACHE_DURATION) {
        setState(cached);
        return cached.isConnected;
      }

      // Get Gmail token
      const { data: tokenData, error: tokenError } = await supabase
        .from('tokens')
        .select('access_token')
        .eq('client_id', userId)
        .maybeSingle();

      if (tokenError) {
        throw new Error('Failed to check Gmail connection');
      }

      const isConnected = !!tokenData?.access_token;
      const newState = {
        isConnected,
        isChecking: false,
        lastCheck: Date.now(),
        error: null
      };

      setState(newState);
      stateCache.set(userId, newState);
      return isConnected;

    } catch (error: any) {
      const newState = {
        isConnected: false,
        isChecking: false,
        lastCheck: Date.now(),
        error: error.message
      };
      setState(newState);
      stateCache.set(userId, newState);
      return false;
    }
  };

  const connect = async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'connect',
          client_id: userId,
          redirect_url: window.location.origin + window.location.pathname
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Gmail connection');
      }

      const result = await response.json();
      
      if (result.auth_url) {
        window.location.href = result.auth_url;
      } else {
        throw new Error('No authentication URL received');
      }

    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Gmail');
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const disconnect = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('tokens')
        .delete()
        .eq('client_id', userId);

      if (error) {
        throw new Error('Failed to disconnect Gmail');
      }

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
      toast.error(error.message || 'Failed to disconnect Gmail');
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      session.then(({ data }) => {
        if (data.session?.user.id) {
          checkConnection(data.session.user.id);
        }
      });
    }
  }, []);

  return {
    ...state,
    checkConnection,
    connect,
    disconnect
  };
}; 