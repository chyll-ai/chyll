
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          // Pas de session, redirection vers la page de connexion
          toast.error("Veuillez vous connecter pour accéder à cette page");
          navigate('/login');
          return;
        }

        // Vérifier si l'utilisateur a déjà un profil
        const userId = data.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (profileData) {
          // L'utilisateur a déjà un profil, redirection vers le dashboard
          toast.info("Vous êtes déjà inscrit");
          navigate('/dashboard');
          return;
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la vérification de la session:", error);
        toast.error(error.message || "Une erreur s'est produite");
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

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
      
      // Récupérer l'ID de l'utilisateur connecté
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Vous n'êtes pas connecté");
      }
      
      const userId = sessionData.session.user.id;
      
      // Insérer le profil dans la base de données
      const { error: insertError } = await supabase
        .from('client_profile')
        .insert({
          ...formData,
          client_id: userId,
        });
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success("✅ Profil enregistré avec succès");
      
      // Redirection vers le dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement du profil:", error);
      toast.error(error.message || "Une erreur s'est produite lors de l'enregistrement");
    } finally {
      setSubmitting(false);
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
