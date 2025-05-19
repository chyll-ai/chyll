
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error("Pas de session trouvée:", sessionError);
          toast.error("Veuillez vous connecter pour accéder à cette page");
          navigate('/login');
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Session trouvée, ID utilisateur:", userId);
        
        // Create client record if it doesn't exist
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (clientError) {
          console.error("Erreur lors de la vérification du client:", clientError);
          throw new Error("Erreur lors de la vérification du client");
        }
        
        if (!client) {
          console.log("Client non trouvé, création en cours...");
          await supabase
            .from('clients')
            .insert({
              id: userId,
              email: sessionData.session.user.email || ''
            });
          console.log("Client créé avec succès");
        }
        
        // Fetch client profile data
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          throw new Error("Erreur lors de la récupération du profil");
        }
        
        if (!profileData) {
          console.log("Profil non trouvé, redirection vers l'onboarding");
          navigate('/onboarding');
          return;
        }
        
        console.log("Profil récupéré avec succès:", profileData);
        setProfile(profileData);
        setLoading(false);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate('/login');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  const handleStartCampaign = () => {
    navigate('/assistant');
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue {profile?.company_name}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Se déconnecter
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profil de votre entreprise</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">Nom de l'entreprise</h3>
              <p className="text-muted-foreground">{profile?.company_name || "Non renseigné"}</p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Secteur d'activité</h3>
              <p className="text-muted-foreground">{profile?.industry || "Non renseigné"}</p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Poste cible</h3>
              <p className="text-muted-foreground">{profile?.icp_title || "Non renseigné"}</p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Taille d'entreprise ciblée</h3>
              <p className="text-muted-foreground">{profile?.icp_size || "Non renseigné"}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="mb-2 text-lg font-medium">Proposition de valeur</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{profile?.value_prop || "Non renseigné"}</p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Ton</h3>
              <p className="text-muted-foreground">{profile?.tone || "Non renseigné"}</p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Objectif principal</h3>
              <p className="text-muted-foreground">{profile?.primary_goal || "Non renseigné"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Button onClick={handleStartCampaign} className="w-full" size="lg">
          <Rocket className="mr-2" />
          Lancer une campagne
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
