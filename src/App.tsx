
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TolgeeProvider } from '@tolgee/react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from './components/ui/sonner';
import RootLayout from './components/layout/RootLayout';
import AssistantPage from './pages/Assistant';
import LoginPage from './pages/Login';
import PricingPage from './pages/PricingPage';
import WorkspacePage from './pages/Workspace';
import ClosedBetaDemo from './pages/ClosedBetaDemo';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { tolgee } from './lib/tolgee';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TolgeeProvider tolgee={tolgee}>
        <CurrencyProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <AuthProvider>
                  <Routes>
                    <Route path="/" element={<RootLayout />}>
                      <Route index element={<AssistantPage />} />
                      <Route path="login" element={<LoginPage />} />
                      <Route path="pricing" element={<PricingPage />} />
                      <Route path="workspace" element={<WorkspacePage />} />
                      <Route path="closed-beta-demo" element={<ClosedBetaDemo />} />
                    </Route>
                  </Routes>
                </AuthProvider>
              </Router>
            </TooltipProvider>
          </LanguageProvider>
        </CurrencyProvider>
      </TolgeeProvider>
    </QueryClientProvider>
  );
}

export default App;
