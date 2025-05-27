
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const RootLayout = () => {
  const { isLoading: authLoading } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      {!isDashboard && <Header />}
      <main 
        className={`mx-auto w-full ${
          isDashboard 
            ? "h-screen overflow-hidden" 
            : "max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        }`}
      >
        <Outlet />
      </main>
      <Toaster 
        position="bottom-right" 
        className="sm:max-w-[420px]"
        richColors
        closeButton
      />
    </div>
  );
};

export default RootLayout;
