
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/context/LanguageContext';
import Container from '@/components/layout/Container';
import FeatureCards from '@/components/FeatureCards';
import HowItWorks from '@/components/HowItWorks';
import PricingCards from '@/components/PricingCards';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import SEOMetadata from '@/components/SEOMetadata';
import CookieConsent from '@/components/CookieConsent';
import ChatButton from '@/components/ChatButton';
import ScheduleCallButton from '@/components/ScheduleCallButton';

const Index = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOMetadata 
        title={t.home.hero.title}
        description={t.home.hero.description}
        keywords="chyll, AI, assistant, prospection, B2B"
        ogTitle={t.home.hero.title}
        ogDescription={t.home.hero.description}
      />
      <Helmet>
        <title>{t.home.hero.title}</title>
        <meta name="description" content={t.home.hero.description} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
          <Container size="xl" className="text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t.home.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t.home.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ScheduleCallButton size="lg" className="w-full sm:w-auto" />
                <ChatButton variant="outline" size="lg" className="w-full sm:w-auto" />
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id="features" className="section-padding bg-white">
          <Container size="xl">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.home.features.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.home.features.subtitle}
              </p>
            </div>
            <FeatureCards />
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-padding gradient-bg">
          <Container size="xl">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.home.howItWorks.title}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.home.howItWorks.subtitle}
              </p>
            </div>
            <HowItWorks />
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-white">
          <Container size="xl">
            <Benefits />
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding gradient-bg">
          <Container size="xl">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.home.testimonials?.title || "Témoignages"}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.home.testimonials?.subtitle || "Ce que nos clients disent"}
              </p>
            </div>
            <TestimonialCarousel />
          </Container>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section-padding bg-white">
          <Container size="xl">
            <div className="text-center mb-12">
              <h2 className="section-title">{t.pricing.title || "Nos tarifs"}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.pricing.description || "Choisissez l'offre qui vous convient"}
              </p>
            </div>
            <PricingCards />
          </Container>
        </section>

        {/* Footer */}
        <Footer />
        
        {/* Cookie Consent */}
        <CookieConsent />
      </div>
    </>
  );
};

export default Index;
