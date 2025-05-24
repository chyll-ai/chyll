import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Debug - Auth state changed:', { event, userId: session?.user?.id });
    
    setSession(session);
    setUser(session?.user ?? null);
    setIsLoading(false);

    if (event === 'SIGNED_OUT') {
      navigate('/login', { replace: true });
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      toast.error('Failed to refresh session');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('Debug - Starting sign out process');
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Reset local state
      setSession(null);
      setUser(null);
      
      // Clear any stored session data
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
    console.log('Debug - Setting up auth state in AuthContext');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        toast.error('Failed to restore session');
        return;
      }

      handleAuthStateChange('INITIAL', session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
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