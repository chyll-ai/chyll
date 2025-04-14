
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-brand-blue mb-4">
              <span className="text-gray-800">GenerativSchool</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              {t('footer_description')}
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} GenerativSchool. {t('copyright_text')}
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">{t('product')}</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-brand-blue transition-colors">{t('features')}</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-brand-blue transition-colors">{t('how_it_works')}</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-blue transition-colors">{t('pricing')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">{t('company')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-600 hover:text-brand-blue transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue transition-colors">{t('careers')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">{t('contact')}</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue transition-colors">{t('blog')}</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue transition-colors">{t('faq')}</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-brand-blue transition-colors">{t('support')}</Link></li>
              <li><Link to="/documentation" className="text-gray-600 hover:text-brand-blue transition-colors">{t('documentation')}</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-blue transition-colors">{t('privacy')}</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-blue transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
