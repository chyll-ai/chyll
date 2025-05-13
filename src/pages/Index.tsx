
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { Hero } from '@/components/ui/animated-hero';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2 } from '@/components/ui/footer2';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';
import SEOMetadata from '@/components/SEOMetadata';
import { getOrganizationSchema, getFAQSchema } from '@/utils/structuredData';
import { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TestimonialsCarousel } from '@/components/ui/testimonials-carousel';

// Sample FAQ data for structured data
const faqData = [
  {
    question: "Ai-je besoin de savoir coder pour utiliser chyll.ai ?",
    answer: "Non, aucune compétence technique n'est nécessaire. Notre équipe s'occupe de toute la configuration pour toi."
  },
  {
    question: "Combien de temps faut-il pour mettre en place chyll.ai ?",
    answer: "Ton agent chyll.ai est prêt en 48h maximum. Nous nous occupons de toute la configuration et l'intégration."
  },
  {
    question: "Quelles données vais-je recevoir exactement ?",
    answer: "Des profils LinkedIn enrichis avec emails professionnels, numéros de téléphone, taille d'entreprise, secteur et autres informations pertinentes pour ta prospection."
  }
];

const Index = () => {
  const { t } = useLanguage();
  
  // Generate structured data
  const organizationSchema = getOrganizationSchema();
  const faqSchema = getFAQSchema(faqData);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="chyll.ai - La prospection B2B, automatisée"
        description="chyll.ai trouve les bons prospects, les enrichit, et met à jour ton CRM pendant que tu bosses sur autre chose."
        canonicalUrl="/"
        structuredData={{
          organization: organizationSchema,
          faq: faqSchema
        }}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <Hero />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0 mx-auto -z-10"
          id="canvas"
        ></canvas>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">{t.home.features.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.features.subtitle}
            </p>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">{t.home.howItWorks.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.howItWorks.subtitle}
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <PricingBasic />
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 rainbow-text-static">{t.home.partners.title}</h2>
          </div>
          <PartnerCompaniesDemo />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">{t.home.testimonials.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.testimonials.subtitle}
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">{t.home.faq.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.faq.subtitle}
            </p>
          </div>
          <div className="flex justify-center">
            <FaqAccordionDemo />
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

// Helper function to get avatar based on name
function getAvatarForName(name: string) {
  const avatarMap: {[key: string]: string} = {
    "Thomas Martin": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Sophie Dubois": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    "Marc Leroy": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  };
  
  return avatarMap[name] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
}

export default Index;
