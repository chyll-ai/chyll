
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

import { LanguageProvider } from '@/context/LanguageContext';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/faq" element={<FAQ />} />
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
