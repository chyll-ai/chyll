
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Cookie } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Show the cookie banner after a short delay
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setOpen(false);
    toast("Cookies acceptés", {
      description: "Merci d'avoir accepté tous les cookies pour une expérience optimale.",
      duration: 3000,
    });
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookiesAccepted', 'essential');
    setOpen(false);
    toast("Cookies essentiels uniquement", {
      description: "Seuls les cookies essentiels au fonctionnement du site seront utilisés.",
      duration: 3000,
    });
  };

  // If cookies already accepted, don't render anything
  if (typeof window !== 'undefined' && localStorage.getItem('cookiesAccepted')) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="rounded-t-lg max-w-full w-full h-auto p-0">
        <div className="p-6 max-w-5xl mx-auto">
          <SheetHeader className="flex flex-row items-center gap-3 mb-4">
            <Cookie className="h-5 w-5 text-brand-blue" />
            <SheetTitle className="text-xl">Nous utilisons des cookies</SheetTitle>
          </SheetHeader>
          
          <div className="mb-4 text-sm text-gray-600">
            <p>
              En naviguant sur ce site, vous acceptez l'utilisation de cookies pour améliorer votre expérience, personnaliser le contenu et analyser le trafic.
            </p>
            <p className="mt-2">
              Pour en savoir plus, consultez notre{' '}
              <Link to="/cookies" className="text-brand-blue hover:underline" onClick={() => setOpen(false)}>
                Politique des Cookies
              </Link>.
            </p>
          </div>
          
          <SheetFooter className="flex flex-row gap-3 justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={acceptEssentialOnly}
            >
              Refuser
            </Button>
            <Button onClick={acceptCookies}>
              Tout accepter
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CookieConsent;
