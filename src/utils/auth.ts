import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface UserProfile {
  id: string;
  email: string;
  company_name?: string;
  industry?: string;
  is_complete?: boolean;
}

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error('Failed to get current user');
  }
  return session?.user;
};

export const ensureAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const getOrCreateClientRecord = async (userId: string, email: string) => {
  try {
    // Check if client record exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (clientError) {
      throw new Error('Failed to check client record');
    }

    // If client doesn't exist, create it
    if (!client) {
      const { error: createError } = await supabase
        .from('clients')
        .insert({
          id: userId,
          email: email
        });

      if (createError) {
        throw new Error('Failed to create client record');
      }
    }

    return true;
  } catch (error: any) {
    console.error('Error in getOrCreateClientRecord:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('client_profile')
      .select('*')
      .eq('client_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error('Failed to fetch user profile');
    }

    return data;
  } catch (error: any) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const checkProfileCompletion = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    return {
      isComplete: profile?.is_complete === true,
      profile
    };
  } catch (error: any) {
    console.error('Error in checkProfileCompletion:', error);
    throw error;
  }
};

export const handleAuthError = (error: any) => {
  console.error('Authentication error:', error);
  const message = error.message || 'An authentication error occurred';
  toast.error(message);
  return false;
};

export const redirectBasedOnProfile = async (userId: string, navigate: (path: string) => void) => {
  try {
    const { isComplete } = await checkProfileCompletion(userId);
    navigate(isComplete ? '/dashboard' : '/assistant');
  } catch (error) {
    handleAuthError(error);
    navigate('/login');
  }
}; 