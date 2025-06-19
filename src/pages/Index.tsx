import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RootLayout } from '@/components/RootLayout';
import { SEOMetadata } from '@/components/SEOMetadata';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Rocket } from 'lucide-react';
import { Pricing } from '@/components/Pricing';
import { Testimonials } from '@/components/Testimonials';
import { Features } from '@/components/Features';
import { FAQ } from '@/components/FAQ';
import { WaitlistForm } from '@/components/WaitlistForm';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <RootLayout>
      <SEOMetadata
        title="Chyll - AI-Powered CRM for Modern Business"
        description="Revolutionize your customer relationships with Chyll, the AI-driven CRM designed to streamline your sales process and boost productivity."
        keywords="CRM, AI, Sales, Automation, Lead Management, Customer Relationship Management"
      />
      
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                AI-Powered CRM for Modern Business
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Revolutionize your customer relationships with Chyll, the AI-driven CRM designed to streamline your sales process and boost productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link to="/workspace">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                  <Link to="/contact">
                    Schedule Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <Rocket className="w-full h-auto max-h-[400px] text-primary" />
            </div>
          </div>
        </div>
      </section>
      
      <Features />
      
      <Pricing />
      
      <Testimonials />
      
      <FAQ />

      <WaitlistForm />
    </RootLayout>
  );
};

export default Index;
