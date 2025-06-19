
import React from 'react';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { FAQSection } from '@/components/ui/faq-section';

const Index = () => {
  return (
    <>
      <Header />
      <SEOMetadata
        title="chyll | La prospection B2B, automatisée"
        description="chyll - L'assistant commercial IA qui automatise votre prospection B2B. Trouvez les bons prospects et enrichissez votre CRM sans effort."
        keywords={["chyll", "prospection B2B", "assistant commercial IA", "automatisation ventes", "CRM", "leads B2B"]}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroDemo />
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez les réponses aux questions les plus courantes sur chyll
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>
      
      <Footer2 />
    </>
  );
};

export default Index;
