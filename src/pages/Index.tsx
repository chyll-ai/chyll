
import React from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { DisplayCardsDemo } from '@/components/ui/display-cards-demo';
import Benefits from '@/components/Benefits';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsSectionDemo } from '@/components/ui/testimonials-section-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2Demo } from '@/components/ui/footer2-demo';

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
      <section id="benefits" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover the Benefits of Automating Your Business with botis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Imagine having an employee that works non-stop, tackles complex tasks, and makes your customers feel like VIPs.
            </p>
          </div>
          <Benefits />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered Tools to Streamline Your Workflows, Voice Calls, and More
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              botis isn't just automation — it's your business's competitive advantage.
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Businesses of all sizes are transforming their operations with botis.
            </p>
          </div>
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
