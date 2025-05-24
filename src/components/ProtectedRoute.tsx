import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireCompleteProfile = false 
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isComplete, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (requireCompleteProfile && !profileLoading && !isComplete) {
      navigate('/assistant');
      return;
    }
  }, [
    isAuthenticated, 
    authLoading, 
    navigate, 
    requireCompleteProfile, 
    isComplete, 
    profileLoading
  ]);

  if (authLoading || (requireCompleteProfile && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 