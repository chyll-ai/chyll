
import React from 'react';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfoSection } from '@/components/contact/contact-info-section';
import { useLanguage } from '@/context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t.contact.title}</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <ContactInfoSection />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">{t.contact.form.title}</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Contact;
