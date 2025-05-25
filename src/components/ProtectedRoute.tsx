import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">Loading...</p>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCompleteProfile = false }) => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { isComplete, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || (requireCompleteProfile && profileLoading)) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 