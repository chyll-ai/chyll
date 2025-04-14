
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { DisplayCardsDemo } from '@/components/ui/display-cards-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsSectionDemo } from '@/components/ui/testimonials-section-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';

const Index = () => {
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
      
      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Employees that Transform Your Business</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Digital workers that never sleep, solve complex problems, and deliver exceptional customer experiences.
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
      
      {/* Features Section */}
      <section id="features" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Your Team of AI Employees
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              botis isn't just automation — it's your digital workforce ready to transform your business.
            </p>
          </div>
          <BentoDemo />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with botis is simple. Follow these steps to transform your business operations.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <TestimonialsSectionDemo />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about botis and how it can transform your business.
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
