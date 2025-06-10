
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getOrCreateClientRecord } from '@/utils/auth';

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

// Define public routes that should never redirect to login
const PUBLIC_ROUTES = ['/', '/about', '/contact', '/terms', '/privacy', '/cookies', '/faq', '/blog'];

// Check if a route is protected
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

// Check if a route is public
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname === route);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Function to handle session updates
  const handleSession = async (newSession: Session | null) => {
    try {
      const newUser = newSession?.user || null;
      const currentPath = location.pathname;
      
      console.log('[AuthContext] Handling session:', {
        hasUser: !!newUser,
        userId: newUser?.id,
        path: currentPath,
        origin: window.location.origin,
        isCallback: currentPath === '/auth/callback',
        isProtected: isProtectedRoute(currentPath),
        isPublic: isPublicRoute(currentPath)
      });

      // Update state
      setSession(newSession);
      setUser(newUser);
      setSessionChecked(true);
      setIsLoading(false);

      // Create client record if user exists
      if (newUser && newUser.email) {
        try {
          await getOrCreateClientRecord(newUser.id, newUser.email);
          console.log('[AuthContext] Client record ensured for user:', newUser.id);
        } catch (error) {
          console.error('[AuthContext] Error creating client record:', error);
        }
      }

      // Handle routing based on auth state and current path
      if (newUser) {
        // User is authenticated
        if (currentPath === '/login') {
          // If on login page, redirect to intended destination or dashboard
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
        // Don't redirect if already on a valid route
      } else {
        // User is not authenticated
        if (isProtectedRoute(currentPath)) {
          // Only redirect to login from protected routes
          console.log('[AuthContext] Redirecting to login from protected route:', currentPath);
          navigate('/login', { replace: true, state: { from: currentPath } });
        }
        // IMPORTANT: Don't redirect from public routes like homepage
      }
    } catch (error) {
      console.error('[AuthContext] Error handling session:', error);
      setIsLoading(false);
      setSessionChecked(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth state...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
            setSessionChecked(true);
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
          setSessionChecked(true);
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
        isPublicRoute: isPublicRoute(location.pathname),
        origin: window.location.origin
      });

      if (mounted) {
        switch (event) {
          case 'SIGNED_IN':
            await handleSession(currentSession);
            break;
          
          case 'SIGNED_OUT':
            await handleSession(null);
            // Only redirect to home if not already on a public route
            if (!isPublicRoute(location.pathname)) {
              navigate('/', { replace: true });
            }
            break;
          
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
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
    sessionChecked,
    signOut
  };

  // Show loading state while checking auth - but only for a brief moment
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
