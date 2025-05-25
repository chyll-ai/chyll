import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import FAQ from '@/pages/FAQ';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPostPage';
import AboutUs from '@/pages/AboutUs';
import Login from '@/pages/Login';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Assistant from '@/pages/Assistant';
import Leads from '@/pages/Leads';
import NotFound from '@/pages/NotFound';

// Wrap a component with AuthProvider and ProtectedRoute
const ProtectedComponent = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  </AuthProvider>
);

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/onboarding" element={<ProtectedComponent><Onboarding /></ProtectedComponent>} />
            <Route path="/dashboard" element={<ProtectedComponent><Dashboard /></ProtectedComponent>} />
            <Route path="/assistant" element={<ProtectedComponent><Assistant /></ProtectedComponent>} />
            <Route path="/leads" element={<ProtectedComponent><Leads /></ProtectedComponent>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="bottom-right" />
          <CookieConsent />
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
