import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Index from '@/pages/Index';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowHome(true);
      return;
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (showHome) {
    return <Index />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 