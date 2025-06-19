
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TolgeeProvider } from '@tolgee/react';
import { tolgee } from '@/lib/tolgee';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

// Import all pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Assistant from '@/pages/Assistant';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import FAQ from '@/pages/FAQ';
import Company from '@/pages/Company';
import Support from '@/pages/Support';
import Workspace from '@/pages/Workspace';
import Team from '@/pages/Team';
import Careers from '@/pages/Careers';
import WaitlistSubscription from '@/pages/WaitlistSubscription';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPostPage';
import Terms from '@/pages/Terms';
import AboutUs from '@/pages/AboutUs';
import Cookies from '@/pages/Cookies';
import Onboarding from '@/pages/Onboarding';
import Leads from '@/pages/Leads';

function App() {
  return (
    <TolgeeProvider tolgee={tolgee} fallback="Loading translations...">
      <Suspense fallback="Loading...">
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/company" element={<Company />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/waitlist-subscription" element={<WaitlistSubscription />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </Suspense>
    </TolgeeProvider>
  );
}

export default App;
