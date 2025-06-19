import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { NotFoundRedirect } from '@/components/NotFoundRedirect';
import './App.css';

console.log('App: Component loading...');

// Log environment variables for debugging
console.log('Environment check:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'present' : 'missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing',
  origin: window.location.origin
});

// Check if environment variables are available
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
  });
}

// Lazy load components for better performance
const Index = lazy(() => import('@/pages/Index'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const Assistant = lazy(() => import('@/pages/Assistant'));
const Leads = lazy(() => import('@/pages/Leads'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const Team = lazy(() => import('@/pages/Team'));
const Careers = lazy(() => import('@/pages/Careers'));
const Company = lazy(() => import('@/pages/Company'));
const Support = lazy(() => import('@/pages/Support'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const AuthCallback = lazy(() => import('@/routes/auth/callback'));
const AuthConfirm = lazy(() => import('@/routes/auth/confirm'));
const LeadHistory = lazy(() => import('@/pages/LeadHistory'));
const WaitlistSubscription = lazy(() => import('@/pages/WaitlistSubscription'));
const WaitlistManagement = lazy(() => import('@/pages/WaitlistManagement'));
const Workspace = lazy(() => import('@/pages/Workspace'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

function App() {
  return (
    <Router>
      <LanguageProvider>
        <HelmetProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/waitlist-subscription" element={<WaitlistSubscription />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/company" element={<Company />} />
                    <Route path="/support" element={<Support />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/auth/confirm" element={<AuthConfirm />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/assistant" element={
                      <ProtectedRoute>
                        <Assistant />
                      </ProtectedRoute>
                    } />
                    <Route path="/leads" element={
                      <ProtectedRoute>
                        <Leads />
                      </ProtectedRoute>
                    } />
                    <Route path="/lead-history/:leadId" element={
                      <ProtectedRoute>
                        <LeadHistory />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <Onboarding />
                      </ProtectedRoute>
                    } />
                    
                    {/* Superadmin Routes */}
                    <Route path="/waitlist" element={<WaitlistManagement />} />
                    
                    {/* Legacy Route Redirect */}
                    <Route path="/closed-beta-demo" element={<NotFoundRedirect message="Page déplacée, redirection en cours..." redirectTo="/waitlist-subscription" />} />
                    
                    {/* Catch all route for 404 handling */}
                    <Route path="*" element={<NotFoundRedirect message="Page non trouvée, redirection en cours..." redirectTo="/" />} />
                    
                    {/* Workspace Route */}
                    <Route path="/workspace" element={<Workspace />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </TooltipProvider>
            </QueryClientProvider>
          </AuthProvider>
        </HelmetProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
