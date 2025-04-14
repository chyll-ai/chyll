
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
    toast('Cookies accepted', {
      description: 'Your preferences have been saved.',
      duration: 3000,
    });
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookiesAccepted', 'essential');
    setOpen(false);
    toast('Essential cookies accepted', {
      description: 'Only essential cookies will be used.',
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
            <SheetTitle className="text-xl">Cookie Consent</SheetTitle>
          </SheetHeader>
          
          <div className="mb-4 text-sm text-gray-600">
            <p>
              We use cookies to improve your experience on our site. By clicking "Accept All", you agree to our use of cookies for analytics, personalization, and advertising purposes.
            </p>
            <p className="mt-2">
              You can customize your preferences or learn more in our{' '}
              <Link to="/cookies" className="text-brand-blue hover:underline" onClick={() => setOpen(false)}>Cookie Policy</Link>.
            </p>
          </div>
          
          <SheetFooter className="flex flex-row gap-3 justify-start sm:justify-end">
            <Button
              variant="outline"
              onClick={acceptEssentialOnly}
            >
              Essential Only
            </Button>
            <Button onClick={acceptCookies}>
              Accept All
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CookieConsent;
