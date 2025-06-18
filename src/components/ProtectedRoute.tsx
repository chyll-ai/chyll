
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, sessionChecked } = useAuth();

  // Only show loading spinner briefly and only when session hasn't been checked yet
  if (!sessionChecked && isLoading) {
    return <LoadingSpinner />;
  }

  // If session has been checked and user is not authenticated, redirect to login
  if (sessionChecked && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback loading state
  return <LoadingSpinner />;
};

export default ProtectedRoute;
