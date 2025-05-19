
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface NotFoundRedirectProps {
  message?: string;
  redirectTo: string;
  delay?: number;
}

export const NotFoundRedirect = ({ 
  message = "Page non trouvée, redirection en cours...", 
  redirectTo, 
  delay = 3000 
}: NotFoundRedirectProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast.error(message);
    
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);
    
    return () => clearTimeout(timer);
  }, [message, redirectTo, delay, navigate]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Page non trouvée</h1>
        <p className="mb-2">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <p>Redirection vers {redirectTo} dans {Math.round(delay/1000)} secondes...</p>
        <button 
          onClick={() => navigate(redirectTo, { replace: true })}
          className="mt-4 rounded bg-brand-blue px-4 py-2 text-white hover:bg-brand-blue-dark"
        >
          Rediriger maintenant
        </button>
      </div>
    </div>
  );
};
