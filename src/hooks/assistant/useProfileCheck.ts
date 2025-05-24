import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UseProfileCheckProps {
  embedded?: boolean;
  onComplete?: () => void;
}

export const useProfileCheck = ({ embedded = false, onComplete }: UseProfileCheckProps = {}) => {
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(!embedded);

  useEffect(() => {
    if (embedded) {
      setCheckingProfile(false);
      return;
    }

    const checkUserProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('client_profile')
          .select('*, is_complete')
          .eq('client_id', user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error checking profile:", profileError);
          return;
        }
        
        if (profile?.is_complete) {
          onComplete?.();
          if (!embedded) {
            navigate('/dashboard', { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setCheckingProfile(false);
      }
    };
    
    checkUserProfile();
  }, [navigate, embedded, onComplete]);

  return { checkingProfile };
}; 