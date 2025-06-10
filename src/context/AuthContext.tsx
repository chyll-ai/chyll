
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
    console.log('[AuthContext] Handling session update:', {
      hasSession: !!newSession,
      userId: newSession?.user?.id,
      currentPath: location.pathname
    });

    try {
      const newUser = newSession?.user || null;
      
      // Update state immediately
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
      const currentPath = location.pathname;
      
      if (newUser) {
        // User is authenticated
        if (currentPath === '/login') {
          // If on login page, redirect to intended destination or dashboard
          const from = location.state?.from || '/dashboard';
          navigate(from, { replace: true });
        }
      } else {
        // User is not authenticated
        if (isProtectedRoute(currentPath)) {
          console.log('[AuthContext] Redirecting to login from protected route:', currentPath);
          navigate('/login', { replace: true, state: { from: currentPath } });
        }
      }
    } catch (error) {
      console.error('[AuthContext] Error handling session:', error);
      setIsLoading(false);
      setSessionChecked(true);
    }
  };

  useEffect(() => {
    let mounted = true;
    let initializationTimeout: NodeJS.Timeout;

    // Set a timeout to ensure loading doesn't get stuck
    initializationTimeout = setTimeout(() => {
      console.log('[AuthContext] Initialization timeout reached, forcing loading to false');
      if (mounted) {
        setIsLoading(false);
        setSessionChecked(true);
      }
    }, 5000); // 5 second timeout

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Starting initialization...');
        
        // Get initial session with a reasonable timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 3000)
        );

        const { data: { session: initialSession }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
            setSessionChecked(true);
          }
          return;
        }

        console.log('[AuthContext] Initial session retrieved:', {
          hasSession: !!initialSession,
          userId: initialSession?.user?.id
        });

        if (mounted) {
          clearTimeout(initializationTimeout);
          await handleSession(initialSession);
        }
      } catch (error) {
        console.error('[AuthContext] Error during initialization:', error);
        if (mounted) {
          clearTimeout(initializationTimeout);
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
        path: location.pathname
      });

      if (mounted) {
        clearTimeout(initializationTimeout);
        
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
      clearTimeout(initializationTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const signOut = async () => {
    try {
      console.log('[AuthContext] Starting sign out process...');
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      // Clear any stored auth data
      Object.keys(localStorage)
        .filter(key => key.startsWith('supabase'))
        .forEach(key => localStorage.removeItem(key));
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthContext] Supabase signOut error:', error);
        // Don't throw - still try to navigate away
      }

      console.log('[AuthContext] Sign out completed, navigating to home');
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('[AuthContext] Error during sign out:', error);
      // Still clear state and navigate on error
      setUser(null);
      setSession(null);
      navigate('/', { replace: true });
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

  console.log('[AuthContext] Current state:', {
    isLoading,
    sessionChecked,
    isAuthenticated: !!session?.user?.id,
    userId: user?.id
  });

  // Show loading state while checking auth - but with timeout protection
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
