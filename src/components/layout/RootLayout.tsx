
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './Header';

const RootLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="relative min-h-screen w-screen max-w-[100vw] overflow-x-hidden bg-background">
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
      />
    </div>
  );
};

export default RootLayout;
