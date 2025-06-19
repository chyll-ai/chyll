
import React from 'react';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfoSection } from '@/components/contact/contact-info-section';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contactez-nous</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Nous sommes là pour répondre à vos questions et vous aider à découvrir comment chyll peut transformer votre approche commerciale.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <ContactInfoSection />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
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
