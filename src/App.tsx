
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Blog from '@/pages/Blog';
import FAQ from '@/pages/FAQ';
import Careers from '@/pages/Careers';
import Company from '@/pages/Company';
import Support from '@/pages/Support';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import Team from '@/pages/Team';

import { LanguageProvider } from '@/context/LanguageContext';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/team" element={<Team />} />
            <Route path="/company" element={<Company />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
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
