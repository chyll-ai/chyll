
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    try {
      setLoading(true);
      
      // Utiliser l'URL complète comme configurée dans Supabase
      const redirectUrl = "https://chyll.ai/onboarding";
      console.log("URL de redirection:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOtp({
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
        toast.error("Erreur de configuration de redirection. Veuillez contacter l'administrateur.");
      } else {
        toast.error(error.error_description || error.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

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
