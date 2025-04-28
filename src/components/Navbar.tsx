
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavbarProps {
  currentPath?: string;
}

const Navbar = ({ currentPath = '/' }: NavbarProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';
  const { t } = useLanguage();

  // Navigate to specific section if on home page, otherwise navigate to home with section hash
  const getSectionLink = (section: string) => {
    return isHomePage ? `#${section}` : `/${section}`;
  };

  // Handle smooth scrolling when clicking on a link that points to an ID
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash && isHomePage) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Wait a bit for the DOM to fully render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, isHomePage]);

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom flex justify-between items-center py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            GenerativSchool
          </Link>
          
          {/* Home button - only show when not on home page */}
          {!isHomePage && (
            <Link to="/" className="text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1">
              <Home size={18} />
              <span className="hidden sm:inline">{t.nav.home}</span>
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to={getSectionLink("features")} className="text-gray-700 hover:text-brand-blue transition-colors">
            {t.nav.features}
          </Link>
          <Link to={getSectionLink("how-it-works")} className="text-gray-700 hover:text-brand-blue transition-colors">
            {t.nav.howItWorks}
          </Link>
          <Link to={getSectionLink("pricing")} className="text-gray-700 hover:text-brand-blue transition-colors">
            {t.nav.pricing}
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="minimal" />
            <Button variant="rainbow" asChild>
              <a href="https://cal.com/generativschool/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer">
                {t.nav.bookDemo}
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher variant="icon" />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-brand-blue"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            {!isHomePage && (
              <Link 
                to="/"
                className="text-gray-700 hover:text-brand-blue py-2 transition-colors flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                {t.nav.home}
              </Link>
            )}
            
            <Link 
              to={getSectionLink("features")}
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.features}
            </Link>
            <Link 
              to={getSectionLink("how-it-works")}
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.howItWorks}
            </Link>
            <Link 
              to={getSectionLink("pricing")}
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.pricing}
            </Link>
            
            <Button 
              variant="rainbow"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
              asChild
            >
              <a href="https://cal.com/generativschool/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer">
                {t.nav.bookDemo}
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
