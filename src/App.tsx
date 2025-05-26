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
import AuthCallback from '@/routes/auth/callback';

// Wrap protected components with auth
const ProtectedDashboard = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

const ProtectedOnboarding = () => (
  <ProtectedRoute>
    <Onboarding />
  </ProtectedRoute>
);

const ProtectedAssistant = () => (
  <ProtectedRoute>
    <Assistant />
  </ProtectedRoute>
);

const ProtectedLeads = () => (
  <ProtectedRoute>
    <Leads />
  </ProtectedRoute>
);

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes - No Auth Required */}
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedDashboard />} />
              <Route path="/onboarding" element={<ProtectedOnboarding />} />
              <Route path="/assistant" element={<ProtectedAssistant />} />
              <Route path="/leads" element={<ProtectedLeads />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <SonnerToaster position="bottom-right" />
            <CookieConsent />
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
