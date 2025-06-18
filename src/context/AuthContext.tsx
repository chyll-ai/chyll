
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/assistant', '/leads'];

// Check if a route is protected
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('[AuthContext] Initial session:', !!initialSession);
        
        setSession(initialSession);
        setUser(initialSession?.user || null);
        setSessionChecked(true);
        setIsLoading(false);
      } catch (error) {
        console.error('[AuthContext] Error getting initial session:', error);
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, currentSession) => {
      console.log('[AuthContext] Auth state change:', event, !!currentSession);
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setSessionChecked(true);
      setIsLoading(false);

      // Handle routing
      const currentPath = location.pathname;
      
      if (currentSession?.user) {
        // User is authenticated
        if (currentPath === '/login') {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // User is not authenticated
        if (isProtectedRoute(currentPath)) {
          navigate('/login', { replace: true, state: { from: currentPath } });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signOut = async () => {
    try {
      console.log('[AuthContext] Starting sign out...');
      setUser(null);
      setSession(null);
      
      await supabase.auth.signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[AuthContext] Error during sign out:', error);
      setUser(null);
      setSession(null);
      navigate('/', { replace: true });
    }
  };

  const isAuthenticated = !!(session?.user?.id && session?.access_token);

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    sessionChecked,
    signOut
  };

  console.log('[AuthContext] Current state:', {
    isLoading,
    sessionChecked,
    isAuthenticated,
    userId: user?.id
  });

  // Simplified loading state - only show briefly
  if (isLoading && !sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
