import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { User, Session } from '@supabase/supabase-js';
import { debugStorage } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a Set to track in-progress client creation attempts
const clientCreationInProgress = new Set<string>();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureClientRecord = async (userId: string, email: string) => {
    try {
      if (clientCreationInProgress.has(userId)) {
        console.log('Client creation already in progress for:', userId);
        return;
      }
      
      console.log('Ensuring client record exists for:', userId);
      clientCreationInProgress.add(userId);
      
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client record:', clientError);
        return;
      }

      if (!client) {
        console.log('Creating new client record for:', userId);
        const { error: createError } = await supabase
          .from('clients')
          .insert({
            id: userId,
            email: email
          });

        if (createError && createError.code !== '23505') {
          console.error('Error creating client record:', createError);
        } else {
          console.log('Client record created successfully');
        }
      } else {
        console.log('Client record already exists');
      }
    } catch (error) {
      console.error('Error in ensureClientRecord:', error);
    } finally {
      clientCreationInProgress.delete(userId);
    }
  };

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('Auth state changed:', { event, userId: newSession?.user?.id });
    debugStorage();

    try {
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('User signed in, ensuring client record...');
        await ensureClientRecord(newSession.user.id, newSession.user.email || '');
      }

      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted, cleaning up...');
        setSession(null);
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        console.log('Token refreshed, updating session...');
        setSession(newSession);
        setUser(newSession.user);
      } else {
        console.log('Updating session state...');
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    } catch (error) {
      console.error('Error in handleAuthStateChange:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('Attempting to refresh session...');
      setIsLoading(true);
      debugStorage();
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('No current session, trying to refresh...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
          throw refreshError;
        }
        
        if (!refreshedSession) {
          console.log('No session after refresh attempt');
          setSession(null);
          setUser(null);
          return;
        }
        
        console.log('Session refreshed successfully');
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        await ensureClientRecord(refreshedSession.user.id, refreshedSession.user.email || '');
      } else {
        console.log('Using existing session');
        setSession(currentSession);
        setUser(currentSession.user);
        await ensureClientRecord(currentSession.user.id, currentSession.user.email || '');
      }
    } catch (error) {
      console.error('Error in refreshSession:', error);
      // On error, clear session state
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      setIsLoading(true);
      debugStorage();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during sign out:', error);
        throw error;
      }
      
      console.log('Signed out successfully, cleaning up...');
      setSession(null);
      setUser(null);
      
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      navigate('/login', { replace: true });
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        debugStorage();
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          throw sessionError;
        }
        
        if (!initialSession) {
          console.log('No initial session found');
          await handleAuthStateChange('INITIAL', null);
          return;
        }

        console.log('Found initial session:', {
          userId: initialSession.user.id,
          expiresAt: initialSession.expires_at
        });
        await handleAuthStateChange('INITIAL', initialSession);
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        await handleAuthStateChange('INITIAL', null);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      console.log('Cleaning up auth subscriptions');
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