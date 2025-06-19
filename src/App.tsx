import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SuperadminGuard from './components/SuperadminGuard';
import SEOMetadata from './components/SEOMetadata';
import AuthCallback from './routes/auth/callback';
import AuthConfirm from './routes/auth/confirm';
import NotFound from './pages/NotFound';

// Lazy-loaded components
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Workspace = lazy(() => import('./pages/Workspace'));
const Leads = lazy(() => import('./pages/Leads'));
const LeadHistory = lazy(() => import('./pages/LeadHistory'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Team = lazy(() => import('./pages/Team'));
const Careers = lazy(() => import('./pages/Careers'));
const Company = lazy(() => import('./pages/Company'));
const Contact = lazy(() => import('./pages/Contact'));
const Support = lazy(() => import('./pages/Support'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const WaitlistSubscription = lazy(() => import('./pages/WaitlistSubscription'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const WaitlistManagement = lazy(() => import('./pages/WaitlistManagement'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <Router>
            <AuthProvider>
              <SEOMetadata 
                title="Chyll - AI-Powered CRM for Modern Business"
                description="Revolutionize your customer relationships with Chyll, the AI-driven CRM designed to streamline your sales process and boost productivity."
              />
              <Routes>
                <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Index /></Suspense>} />
                <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
                <Route path="/assistant" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Assistant /></Suspense></ProtectedRoute>} />
                <Route path="/workspace" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Workspace /></Suspense></ProtectedRoute>} />
                <Route path="/leads" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Leads /></Suspense></ProtectedRoute>} />
                <Route path="/lead-history/:leadId" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><LeadHistory /></Suspense></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Onboarding /></Suspense></ProtectedRoute>} />
                
                {/* Redirect dashboard to workspace */}
                <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
                
                {/* Other routes */}
                <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><AboutUs /></Suspense>} />
                <Route path="/team" element={<Suspense fallback={<div>Loading...</div>}><Team /></Suspense>} />
                <Route path="/careers" element={<Suspense fallback={<div>Loading...</div>}><Careers /></Suspense>} />
                <Route path="/company" element={<Suspense fallback={<div>Loading...</div>}><Company /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>} />
                <Route path="/support" element={<Suspense fallback={<div>Loading...</div>}><Support /></Suspense>} />
                <Route path="/faq" element={<Suspense fallback={<div>Loading...</div>}><FAQ /></Suspense>} />
                <Route path="/blog" element={<Suspense fallback={<div>Loading...</div>}><Blog /></Suspense>} />
                <Route path="/blog/:slug" element={<Suspense fallback={<div>Loading...</div>}><BlogPostPage /></Suspense>} />
                <Route path="/waitlist" element={<Suspense fallback={<div>Loading...</div>}><WaitlistSubscription /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<div>Loading...</div>}><Privacy /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<div>Loading...</div>}><Terms /></Suspense>} />
                <Route path="/cookies" element={<Suspense fallback={<div>Loading...</div>}><Cookies /></Suspense>} />
                
                {/* Admin routes - only for super admin waitlist management */}
                <Route path="/waitlist-management" element={
                  <ProtectedRoute>
                    <SuperadminGuard>
                      <Suspense fallback={<div>Loading...</div>}>
                        <WaitlistManagement />
                      </Suspense>
                    </SuperadminGuard>
                  </ProtectedRoute>
                } />
                
                {/* Auth callback routes */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/confirm" element={<AuthConfirm />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Router>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
