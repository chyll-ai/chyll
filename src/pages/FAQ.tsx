
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer-translated';
import { DefaultDemo } from '@/components/ui/faq-chat-accordion-demo';
import { FAQSection } from '@/components/ui/faq-section';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

const FAQ = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('faq_title')}</h1>
            <p className="text-lg text-gray-700 mb-8">
              {t('faq_description')}
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">{t('general_questions')}</h2>
            <FAQSection />
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-center">{t('ai_employee_questions')}</h2>
              <DefaultDemo />
            </div>
            
            <div className="mt-16 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{t('still_have_questions')}</h3>
              <p className="text-gray-600 mb-6">
                {t('support_description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/support" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  {t('contact_support')} <ArrowRight size={16} className="ml-2" />
                </a>
                <a 
                  href="/documentation" 
                  className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
                >
                  {t('browse_documentation')} <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default FAQ;
