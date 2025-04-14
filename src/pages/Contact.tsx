
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfoSection } from '@/components/contact/contact-info-section';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Have questions about our AI solutions? Ready to transform your business? 
              Get in touch with our team and we'll be happy to help.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <ContactInfoSection />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Contact;
