
import React from 'react';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';
import { HeroDemo } from '@/components/ui/animated-hero-demo';
import { BentoDemo } from '@/components/ui/bento-demo';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { TestimonialsCarousel } from '@/components/ui/testimonials-carousel';
import { BlogSectionDemo } from '@/components/ui/blog-section-demo';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

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

      {/* AI Employees Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home?.aiEmployees?.title || "Vos employés IA, toujours à votre service"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home?.aiEmployees?.subtitle || "Une équipe d'agents IA spécialisés pour automatiser toutes vos tâches commerciales"}
            </p>
          </div>
          <BentoDemo />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home?.features?.title || "Pourquoi choisir chyll ?"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home?.features?.subtitle || "Découvrez les fonctionnalités qui font de chyll l'outil indispensable pour votre croissance"}
            </p>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home?.benefits?.title || "Les avantages de chyll"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home?.benefits?.subtitle || "Découvrez comment chyll transforme votre approche commerciale"}
            </p>
          </div>
          <Benefits />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home?.howItWorks?.title || "Comment ça marche"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home?.howItWorks?.subtitle || "3 étapes simples pour automatiser votre prospection"}
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home?.testimonials?.title || "Ce que disent nos clients"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home?.testimonials?.subtitle || "Découvrez comment chyll a transformé leur activité commerciale"}
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="container">
          <BlogSectionDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.home?.cta?.title || "Prêt à automatiser votre prospection ?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.home?.cta?.subtitle || "Rejoignez les entreprises qui ont déjà révolutionné leur approche commerciale avec chyll"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/waitlist-subscription"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Rejoindre la liste d'attente
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Réserver une démo
            </a>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </>
  );
};

export default Index;
