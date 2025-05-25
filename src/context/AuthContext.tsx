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

      // Only redirect to /login if the current path is a protected route
      const protectedRoutes = ['/dashboard', '/onboarding', '/assistant', '/leads'];
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
      const isLoginPage = location.pathname === '/login';

      if (!newUser && isProtectedRoute && !isLoginPage) {
        navigate('/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state change:', { event, userId: session?.user?.id });
      const newUser = session?.user || null;
      setUser(newUser);
      
      // Only redirect to /login if the current path is a protected route
      const protectedRoutes = ['/dashboard', '/onboarding', '/assistant', '/leads'];
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
      const isLoginPage = location.pathname === '/login';

      if (!newUser && isProtectedRoute && !isLoginPage) {
        navigate('/login');
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
