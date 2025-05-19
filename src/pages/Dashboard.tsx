
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const processAuth = async () => {
      // Vérifier si la page est chargée avec un hash (pour l'authentification)
      if (location.hash) {
        console.log("Hash détecté dans l'URL, processing auth");
        
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // Définir la session avec le token d'accès
          console.log("Setting session with access token");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });
          
          if (error) {
            console.error("Erreur lors de la définition de la session:", error);
            toast.error("Erreur d'authentification. Veuillez réessayer.");
            navigate('/login');
            return;
          }
          
          // Nettoyer l'URL en retirant le hash
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    processAuth();
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          // Pas de session, redirection vers la page de connexion
          toast.error("Veuillez vous connecter pour accéder à cette page");
          navigate('/login');
          return;
        }

        setUser(data.session.user);
        
        // Récupérer le profil de l'utilisateur
        const userId = data.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();
        
        if (profileError) {
          throw profileError;
        }
        
        if (!profileData) {
          // L'utilisateur n'a pas encore de profil, redirection vers l'onboarding
          navigate('/onboarding');
          return;
        }
        
        setProfile(profileData);
        setLoading(false);
        
      } catch (error: any) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error(error.message || "Une erreur s'est produite");
      }
    };
    
    checkSession();
  }, [navigate, location]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Vous avez été déconnecté avec succès");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la déconnexion");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Se déconnecter
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Informations de votre profil</h2>
          
          {profile && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Entreprise</h3>
                <p>{profile.company_name || "Non renseigné"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Secteur d'activité</h3>
                <p>{profile.industry || "Non renseigné"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Cible principale</h3>
                <p>{profile.icp_title || "Non renseigné"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Taille des entreprises ciblées</h3>
                <p>{profile.icp_size || "Non renseigné"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Localisation cible</h3>
                <p>{profile.icp_location || "Non renseigné"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Objectif principal</h3>
                <p>{profile.primary_goal || "Non renseigné"}</p>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="font-medium">Proposition de valeur</h3>
                <p className="whitespace-pre-wrap">{profile.value_prop || "Non renseigné"}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Button onClick={() => navigate('/onboarding')}>
              Modifier mon profil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
