
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [redirectAttempt, setRedirectAttempt] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si la page est chargée avec un hash (pour l'authentification)
    if (location.hash && location.hash.includes('access_token')) {
      console.log("Hash détecté dans l'URL de login, redirection vers assistant");
      console.log("URL de redirection: " + window.location.origin + "/assistant");
      // Force l'utilisation d'une redirection avec replace pour éviter les problèmes de navigation
      window.location.href = window.location.origin + "/assistant";
      return;
    }

    // Vérifier si l'utilisateur est déjà connecté
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la vérification de session:", error);
          toast.error("Erreur de vérification d'authentification");
        } else if (data.session) {
          console.log("Session utilisateur trouvée, redirection vers assistant");
          // Utiliser replace: true pour remplacer l'entrée dans l'historique
          navigate('/assistant', { replace: true });
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [location, navigate, redirectAttempt]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    try {
      setLoading(true);
      
      // Construire l'URL absolue pour la redirection
      const origin = window.location.origin;
      const redirectUrl = `${origin}/assistant`;
      console.log("URL de redirection:", redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Un lien de connexion vous a été envoyé par email");
      setMessageSent(true);
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      
      // Messages d'erreur plus spécifiques
      if (error.message?.includes("path is invalid")) {
        toast.error("Erreur de configuration de redirection. Veuillez vérifier les URL de redirection dans Supabase.");
      } else if (error.message?.includes("security purposes")) {
        toast.error("Trop de tentatives. Veuillez attendre quelques instants avant de réessayer.");
      } else {
        toast.error(error.error_description || error.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  // Force une nouvelle tentative de vérification après quelques secondes si on est toujours sur la page de login
  // avec un hash dans l'URL
  useEffect(() => {
    if (location.hash && location.hash.includes('access_token')) {
      const timer = setTimeout(() => {
        console.log("Nouvelle tentative de redirection...");
        setRedirectAttempt(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.hash, redirectAttempt]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (checkingAuth) {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Connexion</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Saisissez votre email pour recevoir un lien de connexion magique
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email-input" className="block text-sm font-medium text-foreground">
              Adresse Email
            </label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full"
            />
          </div>

          <Button
            id="login-button"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Se connecter'}
          </Button>
          
          {messageSent && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Lien de connexion envoyé ! Veuillez vérifier votre boîte mail.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
