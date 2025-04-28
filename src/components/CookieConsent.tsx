
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Cookie } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

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
    toast(t.legal.cookies.consent.toast.accepted, {
      description: t.legal.cookies.consent.toast.description,
      duration: 3000,
    });
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookiesAccepted', 'essential');
    setOpen(false);
    toast(t.legal.cookies.consent.toast.essential, {
      description: t.legal.cookies.consent.toast.essentialDescription,
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
            <SheetTitle className="text-xl">{t.legal.cookies.consent.title}</SheetTitle>
          </SheetHeader>
          
          <div className="mb-4 text-sm text-gray-600">
            <p>
              {t.legal.cookies.consent.description}
            </p>
            <p className="mt-2">
              {t.legal.cookies.consent.learnMore}{' '}
              <Link to="/cookies" className="text-brand-blue hover:underline" onClick={() => setOpen(false)}>
                {t.footer.links.cookies}
              </Link>.
            </p>
          </div>
          
          <SheetFooter className="flex flex-row gap-3 justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={acceptEssentialOnly}
            >
              {t.legal.cookies.consent.buttons.essentialOnly}
            </Button>
            <Button onClick={acceptCookies}>
              {t.legal.cookies.consent.buttons.acceptAll}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CookieConsent;
