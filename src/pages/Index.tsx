
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';
import { getOrganizationSchema } from '@/utils/structuredData';
import { Hero } from '@/components/ui/animated-hero';
import { TestimonialsSectionDemo } from '@/components/ui/testimonials-section-demo';
import { TestimonialsWithMarqueeDemo } from '@/components/ui/testimonials-with-marquee-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';

const Index = () => {
  // Generate organization structured data
  const organizationSchema = getOrganizationSchema();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="chyll.ai - La prospection B2B, automatisée"
        description="chyll.ai trouve les bons prospects, les enrichit avec emails et téléphones vérifiés, et met à jour ton CRM."
        canonicalUrl="/"
        pageUrl="https://chyll.ai/"
        structuredData={{
          organization: organizationSchema
        }}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-10 flex items-center justify-center flex-col text-center">
        <Hero />
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Comment ça fonctionne</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Bento Grid Section - Our Agents */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Nos Agents IA</h2>
            <p className="text-lg text-gray-700">
              Découvrez notre suite d'agents IA spécialisés pour révolutionner votre prospection commerciale
            </p>
          </div>
          <BentoDemo />
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Les avantages de chyll.ai</h2>
          </div>
          <Benefits />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Fonctionnalités principales</h2>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Ce que disent nos clients</h2>
          </div>
          <TestimonialsSectionDemo />
        </div>
      </section>
      
      {/* Testimonials Marquee */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <TestimonialsWithMarqueeDemo />
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">À propos de chyll.ai</h2>
            <p className="text-lg text-gray-700 mb-8">
              chyll.ai est une solution d'automatisation de prospection commerciale qui vous permet de
              gagner du temps et d'optimiser votre processus de vente. Notre plateforme trouve et enrichit
              vos prospects avec des données vérifiées, facilitant ainsi vos efforts de prospection.
            </p>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Index;
