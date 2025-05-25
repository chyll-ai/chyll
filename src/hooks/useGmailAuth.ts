import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';

interface GmailAuthState {
  isConnected: boolean;
  isChecking: boolean;
}

export const useGmailAuth = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GmailAuthState>({
    isConnected: false,
    isChecking: false
  });

  const checkConnection = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, isChecking: true }));

      const { data: tokenData } = await supabase
        .from('tokens')
        .select('access_token')
        .eq('client_id', userId)
        .maybeSingle();

      setState({
        isConnected: !!tokenData?.access_token,
        isChecking: false
      });
      
      return !!tokenData?.access_token;
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
      setState({ isConnected: false, isChecking: false });
      return false;
    }
  };

  const connect = async () => {
    if (!user?.id) return;
    
    try {
      setState(prev => ({ ...prev, isChecking: true }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'connect',
          client_id: user.id,
          redirect_url: window.location.origin + window.location.pathname
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to connect Gmail');
      }
      
      if (result.oauth_url) {
        window.location.href = result.oauth_url;
      } else if (result.access_token) {
        await checkConnection(user.id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect Gmail');
      setState({ isConnected: false, isChecking: false });
    }
  };

  const disconnect = async () => {
    if (!user?.id) return;
    
    try {
      setState(prev => ({ ...prev, isChecking: true }));
      
      await supabase
        .from('tokens')
        .delete()
        .eq('client_id', user.id);
      
      setState({ isConnected: false, isChecking: false });
    } catch (error: any) {
      toast.error('Failed to disconnect Gmail');
      setState(prev => ({ ...prev, isChecking: false }));
    }
  };

  // Check connection when user changes
  useEffect(() => {
    if (user?.id) {
      checkConnection(user.id);
    } else {
      setState({ isConnected: false, isChecking: false });
    }
  }, [user?.id]);

  return {
    ...state,
    connect,
    disconnect
  };
}; 