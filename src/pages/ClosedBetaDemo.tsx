
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import WaitlistJoinForm from '@/components/WaitlistJoinForm';
import WaitlistConfirmation from '@/components/WaitlistConfirmation';
import { useAuthContext } from '@/context/AuthContext';
import { useWaitlist } from '@/hooks/useWaitlist';

const ClosedBetaDemo = () => {
  const [searchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthContext();
  const { waitlistData, loadWaitlistData } = useWaitlist();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      loadWaitlistData();
    }
  }, [user]);

  useEffect(() => {
    if (waitlistData) {
      setShowConfirmation(true);
    }
  }, [waitlistData]);

  const handleWaitlistSuccess = () => {
    setShowConfirmation(true);
  };

  if (showConfirmation && waitlistData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="container-custom py-16">
            <div className="max-w-4xl mx-auto">
              {/* Back Link */}
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>

              <WaitlistConfirmation isMobile={isMobile} />
            </div>
          </div>
        </div>
        
        <Footer2 />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Rejoignez la <span className="rainbow-text-static">liste d'attente</span> de chyll
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                chyll est actuellement en développement. Inscrivez-vous à notre liste d'attente 
                gamifiée et gagnez des points en parrainant vos amis !
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="mb-12">
              <WaitlistJoinForm 
                onSuccess={handleWaitlistSuccess}
                referralCode={referralCode || undefined}
              />
            </div>

            {/* Demo Information */}
            <Card className="border-2 border-primary/20 shadow-lg mb-8">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Démonstration personnalisée</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Découvrez chyll en action avec une démonstration adaptée à vos besoins
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* What you'll see */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ce que vous découvrirez :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Génération automatique de leads B2B</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Enrichissement de données prospects</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Interface CRM intégrée</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Assistant IA conversationnel</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Création de personas LinkedIn</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Automatisation des relances</span>
                    </div>
                  </div>
                </div>

                {/* Demo details */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Détails de la démonstration :</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Durée : 30 minutes</li>
                    <li>• Format : Visioconférence personnalisée</li>
                    <li>• Présentation live de la plateforme</li>
                    <li>• Questions & réponses</li>
                    <li>• Discussion sur vos besoins spécifiques</li>
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="inline-flex items-center justify-center gap-2"
                    asChild
                  >
                    <a href="https://cal.com/chyll.ai/30min" target="_blank" rel="noopener noreferrer">
                      <PhoneCall className="h-5 w-5" />
                      Réserver une démonstration
                    </a>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Créneaux disponibles du lundi au vendredi, de 9h à 18h
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="text-center">
              <Card className="border border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-orange-800">Bêta fermée</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    chyll est actuellement en phase de test avec un groupe sélectionné d'entreprises. 
                    Rejoignez notre liste d'attente pour être parmi les premiers informés du lancement public.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer2 />
    </div>
  );
};

export default ClosedBetaDemo;
