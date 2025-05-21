
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification dans ProtectedRoute");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la vérification de session:", error);
          setIsAuthenticated(false);
          toast.error("Erreur d'authentification: " + error.message);
          return;
        }
        
        const hasSession = !!data.session;
        if (hasSession && data.session?.user) {
          console.log("Session trouvée:", data.session.user.email);
          setUserId(data.session.user.id);
          setUserEmail(data.session.user.email || null);
        } else {
          console.log("Aucune session active trouvée");
        }
        
        setIsAuthenticated(hasSession);
        
        if (!hasSession) {
          toast.error("Veuillez vous connecter pour accéder à cette page");
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
    
    // Configurer l'écouteur de changement d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état d'authentification:", event);
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email || null);
        } else {
          setUserId(null);
          setUserEmail(null);
        }
        
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

  if (authLoading) {
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

  // Rendre les enfants si l'utilisateur est authentifié avec un wrapper pour afficher les infos utilisateur
  console.log("Utilisateur authentifié, affichage du contenu protégé");
  return (
    <>
      {userId && (
        <div className="bg-muted/30 text-xs py-1 px-2 text-right">
          <span className="font-mono">User ID: {userId.substring(0, 8)}... | {userEmail}</span>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
