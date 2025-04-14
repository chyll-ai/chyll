
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsWithMarqueeDemo } from '@/components/ui/testimonials-with-marquee-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';
import { useTranslation } from '@/contexts/TranslationContext';

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('ai_employees_transform')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('digital_workers_description')}
            </p>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>
      
      {/* Partner Companies Section */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="container-custom">
          <PartnerCompaniesDemo />
        </div>
      </section>
      
      {/* Features Details Section */}
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
      
      {/* How It Works Section */}
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
      
      {/* Testimonials Section */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <TestimonialsWithMarqueeDemo />
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <PricingBasic />
        </div>
      </section>
      
      {/* FAQ Section */}
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
      
      <Footer2Demo />
    </div>
  );
};

export default Index;
