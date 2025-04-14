import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoForm from '@/components/DemoForm';
import HowItWorks from '@/components/HowItWorks';
import { Hero } from '@/components/ui/hero';
import { DisplayCardsDemo } from '@/components/ui/display-cards-demo';
import Benefits from '@/components/Benefits';
import { BentoDemo } from '@/components/ui/bento-demo';
import { TestimonialsSectionDemo } from '@/components/ui/testimonials-section-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
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
      
      {/* Final CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
            <div className="md:w-1/2 max-w-md w-full">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-gray-900 font-bold text-xl mb-4">Schedule Your Demo</h3>
                <DemoForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
