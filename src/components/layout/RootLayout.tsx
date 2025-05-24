import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const RootLayout = () => {
  const { isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex-1 py-6">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default RootLayout; 