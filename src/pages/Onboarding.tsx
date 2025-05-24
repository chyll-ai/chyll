import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NotFoundRedirect } from '@/components/NotFoundRedirect';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    icp_title: '',
    icp_size: '',
    icp_location: '',
    value_prop: '',
    tone: '',
    common_objections: '',
    primary_goal: '',
    calendly_url: '',
    linkedin_url: '',
    banned_phrases: '',
  });

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Vérifier si la page est chargée avec un hash (pour l'authentification) ou si le hash est passé via le state
        const hashToProcess = location.hash || (location.state && location.state.hash);
        
        if (hashToProcess && hashToProcess.includes('access_token')) {
          console.log("Hash détecté dans l'URL ou le state, processing auth dans Onboarding");
          
          const hashParams = new URLSearchParams(
            hashToProcess.substring(1) || (location.state && location.state.hash.substring(1))
          );
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // Définir la session avec le token d'accès
            console.log("Setting session with access token in Onboarding");
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            });
            
            if (error) {
              console.error("Erreur lors de la définition de la session:", error);
              toast.error("Erreur d'authentification. Veuillez réessayer.");
              navigate('/login', { replace: true });
              return;
            }
            
            // Nettoyer l'URL en retirant le hash
            if (location.hash) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            
            console.log("Session définie avec succès dans Onboarding, URL nettoyée");
          }
        }
        
        // Vérifier si l'utilisateur est authentifié
        const checkSession = async () => {
          try {
            const { data, error } = await supabase.auth.getSession();
            
            if (error || !data.session) {
              // Pas de session, redirection vers la page de connexion
              console.log("Pas de session dans Onboarding, redirection vers login");
              setAuthChecked(true);
              setHasSession(false);
              return;
            }

            console.log("Session trouvée dans Onboarding:", data.session.user.email);
            setHasSession(true);

            // Vérifier si l'utilisateur a déjà un profil
            const userId = data.session.user.id;
            console.log("ID utilisateur récupéré:", userId);
            
            // Vérifier si l'utilisateur existe dans la table clients
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
              
            if (clientError) {
              console.error("Erreur lors de la vérification du client:", clientError);
            }
            
            // Si le client n'existe pas, créer un nouveau client
            if (!clientData) {
              console.log("Client non trouvé, création d'un nouveau client dans la table clients");
              const { error: insertClientError } = await supabase
                .from('clients')
                .insert({
                  id: userId,
                  email: data.session.user.email || '',
                });
                
              if (insertClientError) {
                console.error("Erreur lors de la création du client:", insertClientError);
                toast.error("Erreur lors de la création du profil client.");
                return;
              }
              
              console.log("Nouveau client créé avec succès");
            } else {
              console.log("Client trouvé dans la base de données");
            }

            // Vérifier si l'utilisateur a déjà un profil
            const { data: profileData, error: profileError } = await supabase
              .from('client_profile')
              .select('*')
              .eq('client_id', userId)
              .maybeSingle();

            if (profileError) {
              console.error("Erreur lors de la vérification du profil:", profileError);
            }

            if (profileData) {
              // Remplir le formulaire avec les données existantes
              console.log("Profil trouvé, remplissage du formulaire");
              setFormData({
                company_name: profileData.company_name || '',
                industry: profileData.industry || '',
                icp_title: profileData.icp_title || '',
                icp_size: profileData.icp_size || '',
                icp_location: profileData.icp_location || '',
                value_prop: profileData.value_prop || '',
                tone: profileData.tone || '',
                common_objections: profileData.common_objections || '',
                primary_goal: profileData.primary_goal || '',
                calendly_url: profileData.calendly_url || '',
                linkedin_url: profileData.linkedin_url || '',
                banned_phrases: profileData.banned_phrases || '',
              });
            } else {
              console.log("Pas de profil trouvé, formulaire vide");
            }

            setLoading(false);
            setAuthChecked(true);
          } catch (error: any) {
            console.error("Erreur lors de la vérification de la session:", error);
            toast.error(error.message || "Une erreur s'est produite");
            setAuthChecked(true);
            setHasSession(false);
          }
        };
        
        await checkSession();
      } catch (error: any) {
        console.error("Erreur lors du traitement de l'authentification:", error);
        toast.error(error.message || "Une erreur s'est produite");
        setAuthChecked(true);
        setHasSession(false);
      }
    };

    processAuth();
  }, [navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      console.log("Début de la soumission du formulaire...");
      
      // Récupérer l'ID de l'utilisateur connecté
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Vous n'êtes pas connecté");
      }
      
      const userId = sessionData.session.user.id;
      console.log("ID utilisateur récupéré:", userId);
      
      // IMPORTANT: Vérifier d'abord si le client existe, si non, le créer
      let clientExists = false;
      
      // Vérifier si le client existe dans la table clients
      const { data: clientData, error: clientCheckError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (clientCheckError) {
        console.error("Erreur lors de la vérification du client:", clientCheckError);
        throw new Error("Erreur lors de la vérification du client");
      }
      
      // Si le client n'existe pas, créer un nouveau client
      if (!clientData) {
        console.log("Client non trouvé, création d'un nouveau client dans la table clients");
        const { error: insertClientError } = await supabase
          .from('clients')
          .insert({
            id: userId,
            email: sessionData.session.user.email || '',
          });
          
        if (insertClientError) {
          console.error("Erreur lors de la création du client:", insertClientError);
          throw new Error("Erreur lors de la création du profil client");
        }
        
        console.log("Nouveau client créé avec succès");
      } else {
        console.log("Client déjà existant dans la table clients:", clientData);
        clientExists = true;
      }
      
      // Vérification supplémentaire après l'insertion pour s'assurer que le client existe maintenant
      if (!clientExists) {
        const { data: verifyClientData, error: verifyClientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (verifyClientError || !verifyClientData) {
          console.error("Erreur de vérification après création du client:", verifyClientError);
          throw new Error("Le client n'a pas pu être créé correctement");
        }
        
        console.log("Vérification réussie: client bien créé:", verifyClientData);
      }
      
      // Vérifier si le profil existe déjà
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();
      
      if (profileCheckError) {
        console.error("Erreur lors de la vérification du profil:", profileCheckError);
      }
      
      console.log("Profil existant:", existingProfile);
      
      let error;
      
      if (existingProfile) {
        // Mettre à jour le profil existant
        console.log("Mise à jour du profil existant...");
        const { error: updateError } = await supabase
          .from('client_profile')
          .update({
            ...formData,
            client_id: userId,
          })
          .eq('client_id', userId);
        
        error = updateError;
        if (updateError) {
          console.error("Erreur lors de la mise à jour du profil:", updateError);
        }
      } else {
        // Insérer le nouveau profil
        console.log("Création d'un nouveau profil...");
        const { error: insertError } = await supabase
          .from('client_profile')
          .insert({
            ...formData,
            client_id: userId,
          });
        
        error = insertError;
        if (insertError) {
          console.error("Erreur lors de l'insertion du profil:", insertError);
        }
      }
      
      if (error) {
        throw error;
      }
      
      console.log("Profil enregistré avec succès");
      toast.success("✅ Profil enregistré avec succès");
      
      // Redirection vers l'assistant au lieu du dashboard
      console.log("Redirection vers l'assistant...");
      navigate('/assistant', { replace: true });
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du profil:", error);
      toast.error(error.message || "Une erreur s'est produite lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Si l'authentification a été vérifiée mais qu'il n'y a pas de session, rediriger vers login
  if (authChecked && !loading && !hasSession) {
    return <NotFoundRedirect message="Vous devez vous connecter pour accéder à cette page" redirectTo="/login" />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background py-10">
      <div className="container max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Complétez votre profil</h1>
          <p className="mt-2 text-muted-foreground">
            Ces informations nous permettront de personnaliser votre expérience
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations sur l'entreprise</h2>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Nom de l'entreprise</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Secteur d'activité</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="Ex: SaaS, Retail, Finance..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">Lien LinkedIn de l'entreprise</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cible idéale</h2>
            
            <div className="space-y-2">
              <Label htmlFor="icp_title">Poste cible</Label>
              <Input
                id="icp_title"
                name="icp_title"
                value={formData.icp_title}
                onChange={handleInputChange}
                placeholder="Ex: Directeur Marketing, CEO..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icp_size">Taille des entreprises ciblées</Label>
              <Select
                name="icp_size"
                value={formData.icp_size}
                onValueChange={(value) => handleSelectChange('icp_size', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-entrepreneur">Auto-entrepreneur</SelectItem>
                  <SelectItem value="tpe">TPE</SelectItem>
                  <SelectItem value="pme">PME</SelectItem>
                  <SelectItem value="grands-comptes">Grands comptes</SelectItem>
                  <SelectItem value="tous">Tous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icp_location">Localisation cible</Label>
              <Input
                id="icp_location"
                name="icp_location"
                value={formData.icp_location}
                onChange={handleInputChange}
                placeholder="Ex: France, Europe, International..."
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Stratégie de communication</h2>
            
            <div className="space-y-2">
              <Label htmlFor="value_prop">Proposition de valeur</Label>
              <Textarea
                id="value_prop"
                name="value_prop"
                value={formData.value_prop}
                onChange={handleInputChange}
                rows={3}
                placeholder="Qu'est-ce qui rend votre produit/service unique ?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Ton de voix préféré</Label>
              <Select
                name="tone"
                value={formData.tone}
                onValueChange={(value) => handleSelectChange('tone', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Amical</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="formal">Formel</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="inspirational">Inspirationnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="common_objections">Objections fréquentes rencontrées</Label>
              <Textarea
                id="common_objections"
                name="common_objections"
                value={formData.common_objections}
                onChange={handleInputChange}
                rows={3}
                placeholder="Quelles objections rencontrez-vous souvent lors de vos ventes ?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banned_phrases">Phrases ou sujets à éviter</Label>
              <Textarea
                id="banned_phrases"
                name="banned_phrases"
                value={formData.banned_phrases}
                onChange={handleInputChange}
                rows={3}
                placeholder="Sujets ou termes à éviter dans les messages"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configuration de l'agent IA</h2>
            
            <div className="space-y-2">
              <Label htmlFor="primary_goal">Objectif principal</Label>
              <Select
                name="primary_goal"
                value={formData.primary_goal}
                onValueChange={(value) => handleSelectChange('primary_goal', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rdv">Prise de RDV</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calendly_url">Lien Calendly</Label>
              <Input
                id="calendly_url"
                name="calendly_url"
                type="url"
                value={formData.calendly_url}
                onChange={handleInputChange}
                placeholder="https://calendly.com/..."
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Enregistrement en cours..." : "Enregistrer mon profil"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
