import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureClientRecord = async (userId: string, email: string) => {
    try {
      // First check if we have a valid session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('AuthContext: Session error in ensureClientRecord:', {
          error: sessionError,
          message: sessionError.message,
          status: sessionError.status
        });
        return;
      }

      if (!currentSession?.access_token) {
        console.error('AuthContext: No valid access token available');
        return;
      }

      console.log('AuthContext: Creating/checking client record for:', {
        userId,
        hasAccessToken: !!currentSession?.access_token,
        tokenExpiry: currentSession?.expires_at
      });
      
      const { data: existingClient, error: selectError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (selectError) {
        console.error('AuthContext: Error checking existing client:', {
          error: selectError,
          message: selectError.message,
          details: selectError.details
        });
        return;
      }

      if (existingClient) {
        console.log('AuthContext: Client record already exists');
        return;
      }

      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: userId,
          email: email
        });

      if (insertError) {
        console.error('AuthContext: Error creating client record:', {
          error: insertError,
          message: insertError.message,
          details: insertError.details
        });
        return;
      }

      console.log('AuthContext: Client record created successfully');
    } catch (error: any) {
      console.error('AuthContext: Error in ensureClientRecord:', {
        error,
        message: error.message,
        status: error?.status,
        details: error?.details
      });
    }
  };

  const updateAuthState = async (newSession: Session | null) => {
    console.log('AuthContext: Updating auth state with session:', {
      hasSession: !!newSession,
      userId: newSession?.user?.id,
      expiresAt: newSession?.expires_at
    });

    // Update state
    setSession(newSession);
    setUser(newSession?.user || null);
    
    // If we have a session with a user, ensure client record exists
    if (newSession?.user && newSession?.access_token) {
      try {
        // Wait a bit to ensure auth is fully initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify session is still valid before proceeding
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession?.access_token) {
          console.error('AuthContext: Session validation failed before creating client record:', {
            error: sessionError,
            hasAccessToken: !!currentSession?.access_token
          });
          return;
        }

        // Now safe to create/check client record
        await ensureClientRecord(newSession.user.id, newSession.user.email || '');
      } catch (error: any) {
        console.error('AuthContext: Error in delayed client record creation:', {
          error,
          message: error.message
        });
      }
    }
  };

  const refreshSession = async (): Promise<Session | null> => {
    try {
      console.log('AuthContext: Refreshing session...');
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('AuthContext: Error refreshing session:', error);
        throw error;
      }
      
      await updateAuthState(refreshedSession);
      return refreshedSession;
    } catch (error) {
      console.error('AuthContext: Failed to refresh session:', error);
      await updateAuthState(null);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out...');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Error during sign out:', error);
        throw error;
      }
      
      await updateAuthState(null);
      navigate('/login', { replace: true });
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('AuthContext: Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting auth initialization...');
        setIsLoading(true);
        
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('AuthContext: Initial session check result:', {
          hasSession: !!initialSession,
          hasError: !!sessionError,
          userId: initialSession?.user?.id
        });

        if (sessionError) {
          console.error('AuthContext: Error getting initial session:', {
            error: sessionError,
            message: sessionError.message
          });
          toast.error('Error initializing authentication');
          return;
        }
        
        if (mounted) {
          await updateAuthState(initialSession);
          
          // Only navigate if we have a session and we're on login page
          if (initialSession?.user) {
            const currentPath = window.location.pathname;
            if (currentPath === '/login' || currentPath === '/') {
              console.log('AuthContext: User authenticated, navigating to assistant...');
              navigate('/assistant', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error in initialization:', error);
        toast.error('Error initializing authentication');
      } finally {
        if (mounted) {
          console.log('AuthContext: Completing initialization, setting loading to false');
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('AuthContext: Auth state change:', {
        event,
        hasSession: !!newSession,
        userId: newSession?.user?.id
      });
      
      try {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && newSession) {
          await updateAuthState(newSession);
          const currentPath = window.location.pathname;
          // Only navigate if on login or root page
          if (currentPath === '/login' || currentPath === '/') {
            console.log('AuthContext: User signed in, navigating to assistant...');
            navigate('/assistant', { replace: true });
          }
        } else if (event === 'SIGNED_OUT') {
          await updateAuthState(null);
          navigate('/login', { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          await updateAuthState(newSession);
        }
      } catch (error) {
        console.error('AuthContext: Error handling auth state change:', error);
        toast.error('Error updating authentication state');
      } finally {
        if (mounted) {
          console.log('AuthContext: Completing auth state change, setting loading to false');
          setIsLoading(false);
        }
      }
    });

    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
