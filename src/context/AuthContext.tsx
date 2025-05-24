
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
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const ensureClientRecord = async (userId: string, email: string) => {
    try {
      console.log('AuthContext: Creating/checking client record for:', userId);
      
      const { data: existingClient, error: selectError } = await supabase
        .from('clients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (selectError) {
        console.error('AuthContext: Error checking existing client:', selectError);
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
        console.error('AuthContext: Error creating client record:', insertError);
        return;
      }

      console.log('AuthContext: Client record created successfully');
    } catch (error) {
      console.error('AuthContext: Error in ensureClientRecord:', error);
    }
  };

  const updateAuthState = (newSession: Session | null) => {
    console.log('AuthContext: Updating auth state with session:', !!newSession);
    setSession(newSession);
    setUser(newSession?.user || null);
    
    if (newSession?.user) {
      // Create client record in background
      setTimeout(() => {
        ensureClientRecord(newSession.user.id, newSession.user.email || '');
      }, 1000);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('AuthContext: Refreshing session...');
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('AuthContext: Error refreshing session:', error);
        throw error;
      }
      
      updateAuthState(refreshedSession);
      return refreshedSession;
    } catch (error) {
      console.error('AuthContext: Failed to refresh session:', error);
      updateAuthState(null);
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
      
      updateAuthState(null);
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
        console.log('AuthContext: Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
        }
        
        if (mounted) {
          console.log('AuthContext: Initial session found:', !!initialSession);
          updateAuthState(initialSession);
          setIsInitialized(true);
          setIsLoading(false);
          
          // Navigate based on session status and current path
          if (initialSession) {
            if (window.location.pathname === '/login' || window.location.pathname === '/') {
              console.log('AuthContext: User authenticated, navigating to assistant...');
              navigate('/assistant', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error in initialization:', error);
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      
      console.log('AuthContext: Auth state change:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession) {
        updateAuthState(newSession);
        if (isInitialized) {
          console.log('AuthContext: User signed in, navigating to assistant...');
          navigate('/assistant', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        updateAuthState(null);
        if (isInitialized) {
          navigate('/login', { replace: true });
        }
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        updateAuthState(newSession);
      }
      // Ignore INITIAL_SESSION events to prevent conflicts
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
