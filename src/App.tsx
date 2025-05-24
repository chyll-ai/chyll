import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import Index from '@/pages/Index';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
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
import ProtectedRoute from '@/components/ProtectedRoute';

import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <AuthProvider>
            <ProfileProvider>
              <Routes>
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
                <Route path="/onboarding-legacy" element={<Onboarding />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireCompleteProfile={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard-legacy" 
                  element={
                    <ProtectedRoute requireCompleteProfile={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/assistant" 
                  element={
                    <ProtectedRoute>
                      <Assistant />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leads" 
                  element={
                    <ProtectedRoute requireCompleteProfile={true}>
                      <Leads />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <SonnerToaster position="bottom-right" />
              <CookieConsent />
            </ProfileProvider>
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
