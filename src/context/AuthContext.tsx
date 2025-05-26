import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define protected routes
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

  // Function to handle session updates
  const handleSession = async (newSession: Session | null) => {
    try {
      const newUser = newSession?.user || null;
      
      console.log('[AuthContext] Handling session:', {
        hasUser: !!newUser,
        userId: newUser?.id,
        path: location.pathname,
        origin: window.location.origin,
        isCallback: location.pathname === '/auth/callback'
      });

      // Update state
      setSession(newSession);
      setUser(newUser);
      setIsLoading(false);

      // Handle redirects based on auth state
      if (newUser) {
        if (location.pathname === '/login') {
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      } else if (isProtectedRoute(location.pathname)) {
        console.log('[AuthContext] Redirecting to login from protected route:', location.pathname);
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }
    } catch (error) {
      console.error('[AuthContext] Error handling session:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          await handleSession(initialSession);
        }
      } catch (error) {
        console.error('[AuthContext] Error during initialization:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Start auth initialization
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('[AuthContext] Auth state change:', { 
        event, 
        userId: currentSession?.user?.id, 
        path: location.pathname,
        isProtectedRoute: isProtectedRoute(location.pathname),
        origin: window.location.origin
      });

      if (mounted) {
        switch (event) {
          case 'SIGNED_IN':
            await handleSession(currentSession);
            break;
          
          case 'SIGNED_OUT':
            await handleSession(null);
            navigate('/', { replace: true });
            break;
          
          case 'TOKEN_REFRESHED':
            await handleSession(currentSession);
            break;
          
          case 'USER_UPDATED':
            await handleSession(currentSession);
            break;
          
          case 'INITIAL_SESSION':
            await handleSession(currentSession);
            break;
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await handleSession(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session?.user?.id,
    isLoading,
    signOut
  };

  // Prevent rendering children until auth is initialized
  if (isLoading) {
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

