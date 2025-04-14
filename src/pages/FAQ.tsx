
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { DefaultDemo } from '@/components/ui/faq-chat-accordion-demo';
import { FAQSection } from '@/components/ui/faq-section';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const FAQ = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-700 mb-8">
              Find answers to common questions about GenerativSchool's AI solutions, implementation process, and support.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">General Questions</h2>
            <FAQSection />
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-center">AI Employee Questions</h2>
              <DefaultDemo />
            </div>
            
            <div className="mt-16 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help. Contact us for personalized assistance with your specific questions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/support" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Contact Support <ArrowRight size={16} className="ml-2" />
                </a>
                <a 
                  href="/documentation" 
                  className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
                >
                  Browse Documentation <ArrowRight size={16} className="ml-2" />
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
