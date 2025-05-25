import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUser = session?.user || null;
      setUser(newUser);
      setIsLoading(false);

      // Only redirect if it's a protected route and user is not authenticated
      if (!newUser && isProtectedRoute(location.pathname)) {
        console.log('[AuthContext] Redirecting to login from protected route:', location.pathname);
        navigate('/login');
      } else {
        console.log('[AuthContext] No redirect needed for path:', location.pathname);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state change:', { 
        event, 
        userId: session?.user?.id, 
        path: location.pathname,
        isProtectedRoute: isProtectedRoute(location.pathname)
      });

      const newUser = session?.user || null;
      setUser(newUser);
      
      // Only redirect if it's a protected route and user is not authenticated
      if (!newUser && isProtectedRoute(location.pathname)) {
        console.log('[AuthContext] Redirecting to login from protected route:', location.pathname);
        navigate('/login');
      } else {
        console.log('[AuthContext] No redirect needed for path:', location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const value = {
    user,
    isAuthenticated: !!user?.id,
    isLoading,
    signOut
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
