
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { DefaultDemo } from '@/components/ui/faq-chat-accordion-demo';
import { FAQSection } from '@/components/ui/faq-section';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const FAQ = () => {
  const location = useLocation();
  
  // Textes par défaut en français
  const defaultTexts = {
    generalTitle: "Questions générales",
    aiEmployeesTitle: "Questions sur l'agent IA",
    stillHaveQuestionsTitle: "D'autres questions ?",
    stillHaveQuestionsDescription: "Notre équipe support est là pour t'aider. Contacte-nous pour une assistance personnalisée."
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-indigo-50 py-12 sm:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">Questions fréquentes</h1>
            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Vous avez des questions sur chyll.ai ? Voici les réponses aux interrogations les plus courantes.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-10 sm:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
              {defaultTexts.generalTitle}
            </h2>
            <FAQSection />
            
            <div className="mt-12 sm:mt-16">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
                {defaultTexts.aiEmployeesTitle}
              </h2>
              <DefaultDemo />
            </div>
            
            <div className="mt-12 sm:mt-16 bg-gray-50 p-5 sm:p-8 rounded-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {defaultTexts.stillHaveQuestionsTitle}
              </h3>
              <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
                {defaultTexts.stillHaveQuestionsDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/support" 
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Nous contacter <ArrowRight size={16} className="ml-2" />
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
