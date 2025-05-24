import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface UseOAuthHandlerProps {
  onSuccess?: (result: any) => void;
}

export const useOAuthHandler = ({ onSuccess }: UseOAuthHandlerProps = {}) => {
  const [oauthInProgress, setOauthInProgress] = useState(false);

  useEffect(() => {
    const handleOAuthCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (!code || !state || oauthInProgress) return;
      
      try {
        setOauthInProgress(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Vous devez être connecté pour finaliser la connexion Gmail");
          return;
        }

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
            redirect_url: window.location.origin + window.location.pathname
          })
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || 'Failed to exchange code');
        
        if (result.status === "success") {
          toast.success("Connexion Gmail réussie!");
          onSuccess?.(result);
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Error handling OAuth:", error);
        toast.error("Erreur lors de la finalisation de la connexion Gmail");
      } finally {
        setOauthInProgress(false);
      }
    };

    handleOAuthCode();
  }, [onSuccess]);

  return { oauthInProgress };
}; 