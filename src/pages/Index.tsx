
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
import { getOrganizationSchema, getFAQSchema, getChyllAiSchema } from '@/utils/structuredData';
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
  },
  {
    question: "Comment chyll.ai trouve-t-il mes prospects ?",
    answer: "Notre agent utilise l'IA pour identifier les entreprises et décideurs correspondant à tes critères, puis enrichit les données avec des emails et numéros vérifiés."
  },
  {
    question: "Est-ce que chyll.ai s'intègre avec mon CRM ?",
    answer: "Oui, chyll.ai s'intègre nativement avec HubSpot, Pipedrive, Salesforce et d'autres CRM majeurs pour une synchronisation automatique des données."
  }
];

const Index = () => {
  const { t } = useLanguage();
  
  // Generate structured data
  const organizationSchema = getOrganizationSchema();
  const faqSchema = getFAQSchema(faqData);
  const chyllAiSchema = getChyllAiSchema();
  
  // SEO keywords focused on brand and B2B prospection
  const seoKeywords = [
    'chyll.ai', 
    'chyll', 
    'agent SDR', 
    'prospection B2B',
    'enrichissement de leads',
    'automation commerciale',
    'SDR automatisé',
    'génération de leads B2B',
    'numéros de téléphone professionnels',
    'emails professionnels',
    'personas LinkedIn',
    'trouver des prospects B2B',
    'automation prospection',
    'leads qualifiés B2B',
    'intégration CRM'
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="chyll.ai - La prospection B2B, automatisée"
        description="chyll.ai trouve les bons prospects, les enrichit avec emails et téléphones vérifiés, et met à jour ton CRM pendant que tu bosses sur autre chose."
        canonicalUrl="/"
        pageUrl="https://chyll.ai/"
        keywords={seoKeywords}
        structuredData={{
          organization: organizationSchema,
          faq: faqSchema,
          software: chyllAiSchema
        }}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" aria-label="Accueil">
        <Hero />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0 mx-auto -z-10"
          id="canvas"
          aria-hidden="true"
        ></canvas>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section-padding bg-white" aria-label="Fonctionnalités">
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
      <section id="how-it-works" className="section-padding gradient-bg" aria-label="Comment ça marche">
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
      <section id="pricing" className="section-padding bg-white" aria-label="Tarifs">
        <div className="container-custom">
          <PricingBasic />
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-10 bg-gray-50 border-y border-gray-100" aria-label="Nos clients">
        <div className="container-custom">
          <PartnerCompaniesDemo />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding bg-white" aria-label="Témoignages">
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
      <section id="faq" className="section-padding gradient-bg" aria-label="Questions fréquentes">
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

export default Index;
