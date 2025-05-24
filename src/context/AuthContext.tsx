
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

// Simple tracking to prevent duplicate client creation
const processedUsers = new Set<string>();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureClientRecord = async (userId: string, email: string) => {
    try {
      if (processedUsers.has(userId)) {
        console.log('AuthContext: Client already processed for:', userId);
        return;
      }
      
      console.log('AuthContext: Ensuring client record exists for:', userId);
      processedUsers.add(userId);
      
      // Simple upsert - create if doesn't exist, ignore if exists
      const { error } = await supabase
        .from('clients')
        .upsert({
          id: userId,
          email: email
        }, {
          onConflict: 'id',
          ignoreDuplicates: true
        });

      if (error && error.code !== '23505') {
        console.error('AuthContext: Error upserting client record:', error);
      } else {
        console.log('AuthContext: Client record ensured successfully');
      }
    } catch (error) {
      console.error('AuthContext: Error in ensureClientRecord:', error);
    }
  };

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('AuthContext: Auth state changed:', { event, userId: newSession?.user?.id });
    debugStorage();

    try {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('AuthContext: User signed out or deleted, cleaning up...');
        setSession(null);
        setUser(null);
        processedUsers.clear();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        navigate('/login', { replace: true });
      } else if (newSession?.user) {
        console.log('AuthContext: Updating session state...');
        setSession(newSession);
        setUser(newSession.user);
        
        // Ensure client record exists in background
        if (event === 'SIGNED_IN') {
          ensureClientRecord(newSession.user.id, newSession.user.email || '');
        }
      } else {
        console.log('AuthContext: No session, clearing state...');
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error in handleAuthStateChange:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('AuthContext: Attempting to refresh session...');
      setIsLoading(true);
      debugStorage();
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('AuthContext: No current session, trying to refresh...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('AuthContext: Error refreshing session:', refreshError);
          throw refreshError;
        }
        
        if (!refreshedSession) {
          console.log('AuthContext: No session after refresh attempt');
          setSession(null);
          setUser(null);
          return;
        }
        
        console.log('AuthContext: Session refreshed successfully');
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        ensureClientRecord(refreshedSession.user.id, refreshedSession.user.email || '');
      } else {
        console.log('AuthContext: Using existing session');
        setSession(currentSession);
        setUser(currentSession.user);
        ensureClientRecord(currentSession.user.id, currentSession.user.email || '');
      }
    } catch (error) {
      console.error('AuthContext: Error in refreshSession:', error);
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
      console.log('AuthContext: Signing out...');
      setIsLoading(true);
      debugStorage();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Error during sign out:', error);
        throw error;
      }
      
      console.log('AuthContext: Signed out successfully, cleaning up...');
      setSession(null);
      setUser(null);
      processedUsers.clear();
      
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
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
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth state...');
        debugStorage();
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthContext: Error getting initial session:', sessionError);
          throw sessionError;
        }
        
        if (!initialSession) {
          console.log('AuthContext: No initial session found');
          await handleAuthStateChange('INITIAL', null);
          return;
        }

        console.log('AuthContext: Found initial session:', {
          userId: initialSession.user.id,
          expiresAt: initialSession.expires_at
        });
        await handleAuthStateChange('INITIAL', initialSession);
      } catch (error) {
        console.error('AuthContext: Error in initializeAuth:', error);
        await handleAuthStateChange('INITIAL', null);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      console.log('AuthContext: Cleaning up auth subscriptions');
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
