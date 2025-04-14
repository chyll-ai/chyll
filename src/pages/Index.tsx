
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoForm from '@/components/DemoForm';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import PricingCards from '@/components/PricingCards';
import FeatureCards from '@/components/FeatureCards';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 md:py-28">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 animate-fade-in">
                Your New <span className="text-brand-blue">AI EMPLOYEE</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-up">
                Smart Solutions, Big Business Impact
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-primary text-lg px-8 py-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  Book a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  Learn More
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="AI Workspace" 
                  className="w-full h-auto" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover the Benefits of Automating Your Business with AI</h2>
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
              AI Employee isn't just automation — it's your business's competitive advantage.
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with AI Employee is simple. Follow these steps to transform your business operations.
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
              Businesses of all sizes are transforming their operations with AI Employee.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose the Right AI Employee for Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're just getting started or scaling fast, we've got the AI employee that fits your workflow.
            </p>
          </div>
          <PricingCards />
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Hire Your First AI Employee?
              </h2>
              <p className="text-xl mb-6 text-blue-100">
                Join hundreds of businesses already transforming their operations with our AI-powered solutions.
              </p>
              <ul className="text-left space-y-3 mb-8 max-w-md">
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>No setup fees or long-term contracts</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>Easy integration with your existing systems</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>Free personalized onboarding and training</span>
                </li>
              </ul>
            </div>
            
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
