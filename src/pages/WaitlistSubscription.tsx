
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Star, Trophy } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import WaitlistJoinForm from '@/components/WaitlistJoinForm';
import WaitlistConfirmation from '@/components/WaitlistConfirmation';
import { useWaitlist } from '@/hooks/useWaitlist';

const WaitlistSubscription = () => {
  const [searchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [waitlistData, setWaitlistData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { loadWaitlistData } = useWaitlist();
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
    // Check if user already has waitlist data in localStorage
    const savedEmail = localStorage.getItem('waitlist_email');
    if (savedEmail) {
      loadWaitlistData(savedEmail);
    }
  }, []);

  const handleWaitlistSuccess = (data: any) => {
    setWaitlistData(data);
    setShowConfirmation(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {showConfirmation && waitlistData ? (
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

              <WaitlistConfirmation 
                isMobile={isMobile} 
                waitlistData={waitlistData}
              />
            </div>
          </div>
        </div>
      ) : (
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

              {/* Benefits Section */}
              <Card className="border-2 border-primary/20 shadow-lg mb-8">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Pourquoi rejoindre la liste d'attente ?</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Soyez parmi les premiers à découvrir chyll et ses fonctionnalités révolutionnaires
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Avantages exclusifs :</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Accès prioritaire à la bêta</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Configuration personnalisée gratuite</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Tarifs préférentiels</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Support direct de l'équipe</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Formation gratuite incluse</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Influence sur le développement produit</span>
                      </div>
                    </div>
                  </div>

                  {/* Gamification details */}
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Comment gagner des points :</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        +10 points par ami parrainé
                      </li>
                      <li className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        +50 points en rejoignant notre Circle
                      </li>
                      <li className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Position mise à jour quotidiennement
                      </li>
                    </ul>
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
      )}
      
      <Footer2 />
    </div>
  );
};

export default WaitlistSubscription;
