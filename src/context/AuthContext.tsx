
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);

  const ensureClientRecord = async (userId: string, email: string) => {
    try {
      if (processedUsers.has(userId)) {
        console.log('AuthContext: Client already processed for:', userId);
        return;
      }
      
      console.log('AuthContext: Ensuring client record exists for:', userId);
      
      // Wait a bit to ensure the session is fully established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get fresh session to ensure we have valid auth context
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        console.log('AuthContext: No session available for client record creation');
        return;
      }
      
      processedUsers.add(userId);
      
      // First check if client record already exists
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

      // If no existing client, try to create one
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          id: userId,
          email: email
        });

      if (insertError) {
        console.error('AuthContext: Error creating client record:', insertError);
        // Remove from processed set so we can try again later
        processedUsers.delete(userId);
        return;
      }

      console.log('AuthContext: Client record created successfully');
    } catch (error) {
      console.error('AuthContext: Error in ensureClientRecord:', error);
      // Remove from processed set so we can try again later
      processedUsers.delete(userId);
    }
  };

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('AuthContext: Auth state changed:', { 
      event, 
      userId: newSession?.user?.id, 
      isInitialized,
      hasValidSession
    });
    debugStorage();

    try {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('AuthContext: User signed out or deleted, cleaning up...');
        setSession(null);
        setUser(null);
        setHasValidSession(false);
        processedUsers.clear();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        if (isInitialized) {
          navigate('/login', { replace: true });
        }
      } else if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('AuthContext: User signed in, updating state...');
        setSession(newSession);
        setUser(newSession.user);
        setHasValidSession(true);
        
        // Only navigate after initialization is complete
        if (isInitialized) {
          console.log('AuthContext: User authenticated, navigating to assistant...');
          navigate('/assistant', { replace: true });
        }
        
        // Ensure client record exists in background after session is established
        setTimeout(() => {
          ensureClientRecord(newSession.user.id, newSession.user.email || '');
        }, 1500);
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        console.log('AuthContext: Token refreshed, updating session...');
        setSession(newSession);
        setUser(newSession.user);
        setHasValidSession(true);
      } else if (event === 'INITIAL_SESSION') {
        // Only handle initial session if we don't already have a valid session
        if (!hasValidSession) {
          if (newSession?.user) {
            console.log('AuthContext: Initial session found, updating state...');
            setSession(newSession);
            setUser(newSession.user);
            setHasValidSession(true);
          } else {
            console.log('AuthContext: No initial session found');
            setSession(null);
            setUser(null);
            setHasValidSession(false);
          }
        } else {
          console.log('AuthContext: Ignoring INITIAL_SESSION - already have valid session');
        }
      }
    } catch (error) {
      console.error('AuthContext: Error in handleAuthStateChange:', error);
    } finally {
      if (!isInitialized) {
        setIsLoading(false);
        setIsInitialized(true);
      }
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
          setHasValidSession(false);
          return;
        }
        
        console.log('AuthContext: Session refreshed successfully');
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        setHasValidSession(true);
        ensureClientRecord(refreshedSession.user.id, refreshedSession.user.email || '');
      } else {
        console.log('AuthContext: Using existing session');
        setSession(currentSession);
        setUser(currentSession.user);
        setHasValidSession(true);
        ensureClientRecord(currentSession.user.id, currentSession.user.email || '');
      }
    } catch (error) {
      console.error('AuthContext: Error in refreshSession:', error);
      // On error, clear session state
      setSession(null);
      setUser(null);
      setHasValidSession(false);
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
      setHasValidSession(false);
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
    let subscription: any = null;
    
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth state...');
        debugStorage();
        
        // Set up auth state listener first
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
        subscription = authSubscription;
        
        // Then check for existing session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthContext: Error getting initial session:', sessionError);
          throw sessionError;
        }
        
        if (initialSession) {
          console.log('AuthContext: Found initial session:', {
            userId: initialSession.user.id,
            expiresAt: initialSession.expires_at
          });
          setSession(initialSession);
          setUser(initialSession.user);
          setHasValidSession(true);
        } else {
          console.log('AuthContext: No initial session found');
          setSession(null);
          setUser(null);
          setHasValidSession(false);
        }
        
      } catch (error) {
        console.error('AuthContext: Error in initializeAuth:', error);
        setSession(null);
        setUser(null);
        setHasValidSession(false);
      } finally {
        // Mark as initialized after everything is done
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      console.log('AuthContext: Cleaning up auth subscriptions');
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    session,
    isAuthenticated: !!session && hasValidSession,
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
