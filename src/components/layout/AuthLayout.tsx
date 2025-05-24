import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Loader2 } from 'lucide-react';

interface AuthLayoutProps {
  requireCompleteProfile?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ requireCompleteProfile = false }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isComplete, isLoading: profileLoading } = useProfile();

  // Show loading state while checking auth/profile
  if (authLoading || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If complete profile is required but profile is not complete, redirect to assistant
  if (requireCompleteProfile && !isComplete) {
    return <Navigate to="/assistant" replace />;
  }

  // If profile is complete and we're on assistant page, redirect to dashboard
  if (isComplete && location.pathname === '/assistant' && !location.search) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthLayout; 