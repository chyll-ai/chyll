import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

interface UseOAuthHandlerProps {
  onSuccess?: (result: any) => void;
}

export const useOAuthHandler = ({ onSuccess }: UseOAuthHandlerProps = {}) => {
  const [oauthInProgress, setOauthInProgress] = useState(false);
  const [hasProcessedCode, setHasProcessedCode] = useState(false);
  const navigate = useNavigate();

  const handleOAuthCode = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    // If we've already processed this code or there's no code, return early
    if (hasProcessedCode || !code || !state) {
      setOauthInProgress(false);
      return;
    }

    // If already in progress, prevent duplicate processing
    if (oauthInProgress) {
      console.log('OAuth already in progress, skipping...');
      return;
    }
    
    // Log any OAuth errors and return early
    if (error || errorDescription) {
      console.error('OAuth Error:', { error, errorDescription });
      toast.error(`Gmail connection failed: ${errorDescription || error}`);
      setOauthInProgress(false);
      setHasProcessedCode(true);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    try {
      setOauthInProgress(true);
      console.log('Processing OAuth code...');

      // First ensure we have a valid session
      let session = null;
      
      // Try to get existing session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (sessionData?.session) {
        session = sessionData.session;
        console.log('Using existing session');
      } else {
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;
        
        if (refreshData?.session) {
          session = refreshData.session;
          console.log('Using refreshed session');
        } else {
          console.error('No session available after refresh');
          toast.error("Session expired. Please log in again.");
          navigate('/login');
          return;
        }
      }

      // Verify we have a valid session before proceeding
      if (!session?.access_token || !session?.user?.id) {
        throw new Error('Invalid session state');
      }

      console.log('Starting OAuth code exchange with params:', {
        code: code.substring(0, 10) + '...',
        state,
        userId: session.user.id
      });

      // Exchange code for token
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'exchange_code',
          code,
          client_id: session.user.id,
          redirect_url: window.location.origin + window.location.pathname,
          state // Include state parameter for verification
        })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to exchange code');
      }

      const result = await response.json();
      console.log('Exchange code success:', result);
      
      if (result.status === "success") {
        // Ensure session is still valid after token exchange
        const { data: finalSession, error: finalError } = await supabase.auth.getSession();
        if (finalError || !finalSession.session) {
          throw new Error('Session validation failed after token exchange');
        }
        
        toast.success('Gmail connected successfully!');
        onSuccess?.(result);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error("Error handling OAuth:", error);
      toast.error(error.message || "Error completing Gmail connection");
      
      // If we hit a session error, redirect to login
      if (error.message?.includes('session')) {
        navigate('/login');
      }
    } finally {
      setHasProcessedCode(true);
      setOauthInProgress(false);
      // Clean up URL parameters after success or failure
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onSuccess, oauthInProgress, hasProcessedCode, navigate]);

  useEffect(() => {
    handleOAuthCode();
  }, [handleOAuthCode]);

  // Reset state when the URL changes
  useEffect(() => {
    const cleanup = () => {
      setHasProcessedCode(false);
      setOauthInProgress(false);
    };
    
    // Listen for URL changes
    window.addEventListener('popstate', cleanup);
    
    return () => {
      window.removeEventListener('popstate', cleanup);
    };
  }, []);

  return { oauthInProgress };
}; 