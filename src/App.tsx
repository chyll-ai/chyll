
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from './components/ui/sonner';
import RootLayout from './components/layout/RootLayout';
import AssistantPage from './pages/Assistant';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PricingPage from './pages/PricingPage';
import WorkspacePage from './pages/Workspace';
import ClosedBetaDemo from './pages/ClosedBetaDemo';
import { CurrencyProvider } from '@/context/CurrencyContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <Routes>
                  <Route path="/*" element={
                    <RootLayout>
                      <Routes>
                        <Route path="/" element={<AssistantPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/workspace" element={<WorkspacePage />} />
                        <Route path="/closed-beta-demo" element={<ClosedBetaDemo />} />
                      </Routes>
                    </RootLayout>
                  } />
                </Routes>
              </Router>
            </TooltipProvider>
          </LanguageProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
