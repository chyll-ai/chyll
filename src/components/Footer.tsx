
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-brand-blue mb-4">
              <span className="text-gray-800">chyll.ai</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              {t.footer.tagline}
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 chyll.ai
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">{t.footer.menuTitles.product}</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-brand-blue transition-colors">{t.nav.features}</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-brand-blue transition-colors">{t.nav.howItWorks}</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-blue transition-colors">{t.nav.pricing}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">{t.footer.menuTitles.company}</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-600 hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">{t.common.contactUs}</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue transition-colors">FAQ</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-brand-blue transition-colors">Support</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-blue transition-colors">{t.footer.links.privacy}</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-blue transition-colors">{t.footer.links.terms}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
