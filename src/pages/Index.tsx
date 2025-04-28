
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { DisplayCardsDemo } from '@/components/ui/display-cards-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsWithMarqueeDemo } from '@/components/ui/testimonials-with-marquee-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';
import SEOMetadata from '@/components/SEOMetadata';
import { getOrganizationSchema, getFAQSchema } from '@/utils/structuredData';
import { Suspense, lazy } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Sample FAQ data for structured data
const faqData = [
  {
    question: "What is GenerativSchool?",
    answer: "GenerativSchool provides AI solutions for businesses, helping automate workflows, improve customer experiences, and scale operations with intelligent AI employees."
  },
  {
    question: "How do I get started with GenerativSchool?",
    answer: "You can start by booking a demo through our website to see how our AI solutions can work for your specific business needs."
  },
  {
    question: "What industries does GenerativSchool work with?",
    answer: "We work with businesses across various industries including retail, healthcare, finance, education, and more."
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
        title="Smart Solutions for Your Business"
        description="GenerativSchool - Intelligent automation for your business. Streamline workflows, provide support, and scale operations with AI."
        canonicalUrl="/"
        structuredData={{
          organization: organizationSchema,
          faq: faqSchema
        }}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <HeroDemo />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0 mx-auto -z-10"
          id="canvas"
        ></canvas>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.features.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.features.subtitle}
            </p>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-gray-50">
        <div className="container-custom">
          <PricingBasic />
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container-custom">
          <PartnerCompaniesDemo />
        </div>
      </section>
      
      {/* Features Details Section */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home.meetTeam.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.meetTeam.subtitle}
            </p>
          </div>
          <BentoDemo />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.howItWorks.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.howItWorks.subtitle}
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <TestimonialsWithMarqueeDemo />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.home.faq.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.faq.subtitle}
            </p>
          </div>
          <div className="flex justify-center">
            <FaqAccordionDemo />
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Index;
