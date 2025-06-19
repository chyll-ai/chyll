
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Cookie, Check, X } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookiesChoice = localStorage.getItem('cookiesAccepted');
    if (!cookiesChoice) {
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
      description: "Vos préférences ont été enregistrées",
      duration: 3000,
    });
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookiesAccepted', 'essential');
    setOpen(false);
    toast("Cookies essentiels acceptés", {
      description: "Seuls les cookies nécessaires seront utilisés",
      duration: 3000,
    });
  };
  
  const refuseCookies = () => {
    localStorage.setItem('cookiesAccepted', 'refused');
    setOpen(false);
    toast("Cookies refusés", {
      description: "Aucun cookie ne sera utilisé",
      duration: 3000,
    });
  };

  // If cookies choice already made, don't render anything
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
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez accepter tous les cookies ou choisir vos préférences.
            </p>
            <p className="mt-2">
              Pour en savoir plus, consultez notre{' '}
              <Link to="/cookies" className="text-brand-blue hover:underline" onClick={() => setOpen(false)}>
                politique des cookies
              </Link>.
            </p>
          </div>
          
          <SheetFooter className="flex flex-row gap-3 justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={refuseCookies}
              className="border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500"
            >
              <X className="h-4 w-4 mr-2" />
              Refuser
            </Button>
            <Button
              variant="outline"
              onClick={acceptEssentialOnly}
            >
              Essentiels uniquement
            </Button>
            <Button onClick={acceptCookies} className="bg-brand-blue hover:bg-brand-blue/90">
              <Check className="h-4 w-4 mr-2" />
              Tout accepter
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CookieConsent;
