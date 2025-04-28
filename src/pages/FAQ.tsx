
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { DefaultDemo } from '@/components/ui/faq-chat-accordion-demo';
import { FAQSection } from '@/components/ui/faq-section';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const FAQ = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  
  // Default text in case translations are missing
  const defaultTexts = {
    generalTitle: "General Questions",
    aiEmployeesTitle: "AI Employee Questions",
    stillHaveQuestionsTitle: "Still have questions?",
    stillHaveQuestionsDescription: "Our support team is here to help. Contact us for personalized assistance with your specific questions."
  };
  
  // Check if French FAQ translations are available with safe optional chaining
  const hasFrenchFaqGeneral = language === 'fr' && t.faq?.general?.title !== undefined;
  const hasFrenchFaqAiEmployees = language === 'fr' && t.faq?.aiEmployees?.title !== undefined;
  const hasFrenchFaqStillQuestions = language === 'fr' && t.faq?.stillHaveQuestions?.title !== undefined;
  const hasFrenchFaqStillQuestionsDesc = language === 'fr' && t.faq?.stillHaveQuestions?.description !== undefined;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.home.faq.title}</h1>
            <p className="text-lg text-gray-700 mb-8">
              {t.home.faq.subtitle}
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {hasFrenchFaqGeneral ? t.faq?.general?.title : defaultTexts.generalTitle}
            </h2>
            <FAQSection />
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-center">
                {hasFrenchFaqAiEmployees ? t.faq?.aiEmployees?.title : defaultTexts.aiEmployeesTitle}
              </h2>
              <DefaultDemo />
            </div>
            
            <div className="mt-16 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                {hasFrenchFaqStillQuestions ? t.faq?.stillHaveQuestions?.title : defaultTexts.stillHaveQuestionsTitle}
              </h3>
              <p className="text-gray-600 mb-6">
                {hasFrenchFaqStillQuestionsDesc 
                  ? t.faq?.stillHaveQuestions?.description 
                  : defaultTexts.stillHaveQuestionsDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/support" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  {t.common.contactUs} <ArrowRight size={16} className="ml-2" />
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
