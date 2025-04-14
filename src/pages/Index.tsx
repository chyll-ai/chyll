
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsWithMarqueeDemo } from '@/components/ui/testimonials-with-marquee-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2Demo } from '@/components/ui/footer-translated';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'react-router-dom';

// Section components to better organize the page
const FeatureSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('ai_employees_transform')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('digital_workers_description')}
          </p>
        </div>
        <FeaturesSectionWithHoverEffectsDemo />
      </div>
    </section>
  );
};

const PartnersSection = () => {
  return (
    <section className="py-10 bg-gray-50 border-y border-gray-100">
      <div className="container-custom">
        <PartnerCompaniesDemo />
      </div>
    </section>
  );
};

const AIEmployeesSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('meet_ai_employees')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('botis_description')}
          </p>
        </div>
        <BentoDemo />
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('how_it_works')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('how_it_works_description')}
          </p>
        </div>
        <HowItWorks />
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="section-padding gradient-bg">
      <div className="container-custom">
        <TestimonialsWithMarqueeDemo />
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container-custom">
        <PricingBasic />
      </div>
    </section>
  );
};

const FAQSection = () => {
  const { t } = useTranslation();
  
  return (
    <section id="faq" className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq_title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq_description')}
          </p>
        </div>
        <div className="flex justify-center">
          <FaqAccordionDemo />
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Lazy load sections as they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('section');
      sections.forEach(section => {
        section.classList.add('opacity-0');
        observer.observe(section);
      });
    }

    return () => {
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('section');
        sections.forEach(section => {
          observer.unobserve(section);
        });
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      {/* Hero Section */}
      <section id="home">
        <HeroDemo />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0 mx-auto -z-10"
          id="canvas"
        ></canvas>
      </section>
      
      <div ref={sectionsRef}>
        <FeatureSection />
        <PartnersSection />
        <AIEmployeesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </div>
      
      <Footer2Demo />
    </div>
  );
};

export default Index;
