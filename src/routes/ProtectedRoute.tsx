
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification dans ProtectedRoute");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la vérification de session:", error);
          setIsAuthenticated(false);
          toast.error("Erreur d'authentification");
          return;
        }
        
        const hasSession = !!data.session;
        console.log("Session trouvée:", hasSession);
        setIsAuthenticated(hasSession);
        
        if (!hasSession) {
          toast.error("Veuillez vous connecter pour accéder à cette page");
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    
    // Configurer l'écouteur de changement d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état d'authentification:", event);
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        
        // Si l'utilisateur est déconnecté, afficher une notification
        if (event === 'SIGNED_OUT') {
          toast.info("Vous avez été déconnecté");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    // État de chargement
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    console.log("Utilisateur non authentifié, redirection vers login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rendre les enfants si l'utilisateur est authentifié
  console.log("Utilisateur authentifié, affichage du contenu protégé");
  return <>{children}</>;
};

export default ProtectedRoute;
