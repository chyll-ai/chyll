import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';
import HowItWorks from '@/components/HowItWorks';
import { Hero } from '@/components/ui/animated-hero';
import { FeaturesSectionWithHoverEffectsDemo } from '@/components/ui/feature-section-with-hover-effects-demo';
import { PricingBasic } from '@/components/ui/pricing-basic';
import { DefaultDemo as FaqAccordionDemo } from '@/components/ui/faq-chat-accordion-demo';
import { Footer2 } from '@/components/ui/footer2';
import { PartnerCompaniesDemo } from '@/components/ui/partner-companies-demo';
import SEOMetadata from '@/components/SEOMetadata';
import { getOrganizationSchema, getFAQSchema, getChyllAiSchema } from '@/utils/structuredData';
import { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TestimonialsCarousel } from '@/components/ui/testimonials-carousel';
import { FAQSection } from '@/components/ui/faq-section';

// Sample FAQ data for structured data - this is the ONLY FAQPage schema we'll keep
const faqData = [
  {
    question: "C'est quoi chyll ?",
    answer: "chyll est un assistant commercial IA pour les entreprises modernes. Il automatise votre prospection B2B sans nécessiter de compétences techniques."
  },
  {
    question: "Combien de temps faut-il pour déployer chyll ?",
    answer: "Votre assistant chyll est prêt en 48h maximum. Notre équipe s'occupe de toute la configuration et l'intégration pour vous."
  },
  {
    question: "Quelles données vais-je recevoir avec chyll ?",
    answer: "chyll enrichit les profils professionnels avec emails, numéros de téléphone directs et autres informations pertinentes pour votre prospection."
  },
  {
    question: "Comment fonctionne la création de personas LinkedIn ?",
    answer: "chyll vous permet de créer des personas précis en définissant des critères comme le poste, l'industrie, la taille d'entreprise et d'autres attributs professionnels pertinents."
  },
  {
    question: "Est-ce que chyll s'intègre avec mon CRM ?",
    answer: "Oui, chyll propose une interface CRM personnalisée ou s'intègre avec les principaux CRM du marché pour une synchronisation automatique des données."
  },
  {
    question: "Pourquoi choisir chyll plutôt qu'une autre solution ?",
    answer: "chyll se distingue par sa simplicité d'utilisation, son intelligence artificielle avancée et son approche entièrement automatisée de la prospection B2B, sans nécessiter de compétences techniques."
  }
];

// Offres pour le SEO et le contenu sans JavaScript
const offersData = [
  {
    name: "Starter",
    price: "99€",
    period: "/mois",
    description: "Parfait pour les petites équipes",
    features: [
      "50 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "2 utilisateurs",
      "Interface CRM personnalisée",
      "Support par email",
      "Mise à jour quotidienne"
    ],
    url: "https://chyll.ai/offres/starter",
    action: "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
    actionText: "Commencer l'essai"
  },
  {
    name: "Growth",
    price: "200€",
    period: "/mois",
    description: "Pour les équipes en croissance",
    features: [
      "100 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "3 utilisateurs",
      "Interface CRM personnalisée",
      "Support prioritaire",
      "Mises à jour en temps réel",
      "Export et import de data"
    ],
    url: "https://chyll.ai/offres/growth",
    action: "https://cal.com/chyll.ai/30min",
    actionText: "Réserver une démo"
  },
  {
    name: "Scale",
    price: "300€",
    period: "/mois",
    description: "Pour les équipes commerciales établies",
    features: [
      "200 numéros de téléphone ET adresses email par mois",
      "Personas illimités (LinkedIn)",
      "5 utilisateurs",
      "Interface CRM sur mesure",
      "Support dédié",
      "Mises à jour en temps réel",
      "Export et import de data",
      "Critères de recherche illimités",
      "Rapports de performance"
    ],
    url: "https://chyll.ai/offres/scale",
    action: "https://cal.com/chyll.ai/30min",
    actionText: "Réserver une démo"
  }
];

export default function Index() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Generate structured data
  const organizationSchema = getOrganizationSchema();
  const faqSchema = getFAQSchema(faqData);
  const chyllAiSchema = getChyllAiSchema();
  
  // SEO keywords focused on brand and B2B prospection
  const seoKeywords = [
    'chyll', 
    'chyll assistant commercial',
    'chyll.ai', 
    'chyll logiciel',
    'application chyll',
    'outil chyll',
    'plateforme chyll',
    'automatisation des ventes',
    'outil IA pour la prospection',
    'assistant de vente intelligent',
    'prospection B2B',
    'enrichissement de leads',
    'IA commerciale',
    'génération de leads B2B',
    'startups',
    'PME',
    'équipes commerciales'
  ];
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if this is an OAuth callback
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const error_description = searchParams.get('error_description');

      if (code || error || error_description) {
        console.log('OAuth callback detected:', {
          hasCode: !!code,
          error,
          error_description,
          currentUrl: window.location.href
        });

        try {
          // Handle OAuth errors
          if (error || error_description) {
            console.error('OAuth error:', { error, error_description });
            toast.error(error_description || error || 'Authentication failed');
            navigate('/login', { replace: true });
            return;
          }

          // Exchange code for session
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('Error exchanging code for session:', error);
              toast.error(error.message || 'Authentication failed');
              navigate('/login', { replace: true });
              return;
            }

            if (data.session) {
              console.log('OAuth authentication successful:', {
                userId: data.session.user.id,
                email: data.session.user.email
              });
              toast.success('Successfully signed in!');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          toast.error('Authentication failed');
          navigate('/login', { replace: true });
        }
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <SEOMetadata 
        title="chyll - Assistant commercial IA pour automatiser votre prospection B2B"
        description="chyll automatise la génération de leads et les relances commerciales grâce à l'intelligence artificielle. Gagnez du temps et accélérez vos ventes avec chyll."
        canonicalUrl="/"
        pageUrl="https://chyll.ai/"
        keywords={seoKeywords}
        offers={offersData}
        structuredData={{
          organization: organizationSchema,
          faq: faqSchema,
          software: chyllAiSchema
        }}
      />
      
      {/* Contenu pour les navigateurs sans JavaScript */}
      <noscript>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          <header style={{ textAlign: 'center', margin: '20px 0' }}>
            <h1>chyll - Assistant commercial IA pour les startups et PME</h1>
            <p>chyll automatise la génération de leads et les relances commerciales grâce à l'intelligence artificielle.</p>
          </header>
          
          <section style={{ margin: '30px 0' }}>
            <h2 style={{ textAlign: 'center' }}>Les offres chyll</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {offersData.map((offer, index) => (
                <div key={index} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                  <h3>{offer.name} — {offer.price}{offer.period}</h3>
                  <p>{offer.description}</p>
                  <ul>
                    {offer.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <p>
                    <a href={offer.action} style={{ fontWeight: 'bold', color: '#4F46E5' }}>
                      {offer.actionText}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          <section style={{ margin: '30px 0' }}>
            <h2 style={{ textAlign: 'center' }}>Comment fonctionne chyll</h2>
            <ol>
              <li>Nous configurons votre assistant commercial chyll selon vos besoins</li>
              <li>L'assistant chyll identifie et enrichit automatiquement les prospects pertinents</li>
              <li>Les données enrichies sont synchronisées avec votre CRM</li>
              <li>Vous concentrez votre temps sur les conversations qui comptent</li>
            </ol>
          </section>
          
          <section style={{ margin: '30px 0' }}>
            <h2 style={{ textAlign: 'center' }}>Questions fréquentes sur chyll</h2>
            <dl>
              {faqData.map((faq, index) => (
                <div key={index} style={{ margin: '10px 0' }}>
                  <dt style={{ fontWeight: 'bold' }}>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
          
          <footer style={{ textAlign: 'center', margin: '30px 0', padding: '20px', borderTop: '1px solid #ddd' }}>
            <p>Contact: contact@chyll.ai | +33 1 23 45 67 89</p>
            <p>60 RUE FRANCOIS IER, 75008 PARIS</p>
            <p>© 2025 chyll - Tous droits réservés</p>
          </footer>
        </div>
      </noscript>
      
      <Header />
      
      {/* Hero Section with Canvas */}
      <section id="home" aria-label="Accueil" className="relative">
        <Hero />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0 mx-auto -z-10"
          id="canvas"
          aria-hidden="true"
        ></canvas>
      </section>
      
      {/* Pricing Section - Moved up to be right after hero */}
      <section id="pricing" className="section-padding bg-white" aria-label="Tarifs">
        <div className="container-custom">
          <PricingBasic />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section-padding bg-white" aria-label="Fonctionnalités">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">chyll révolutionne votre prospection B2B</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution complète pour automatiser votre prospection B2B et maximiser votre productivité commerciale
            </p>
          </div>
          <FeaturesSectionWithHoverEffectsDemo />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding gradient-bg" aria-label="Comment ça marche">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">Comment fonctionne chyll</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Démarrer avec chyll est simple. Suivez ces étapes pour transformer votre approche commerciale.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
      
      {/* Partner Companies Section */}
      <section className="py-10 bg-gray-50 border-y border-gray-100" aria-label="Nos clients">
        <div className="container-custom">
          <PartnerCompaniesDemo />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-padding bg-white" aria-label="Témoignages">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">Des clients conquis par chyll</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez les startups et PME qui ont transformé leur prospection grâce à chyll
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="section-padding gradient-bg" aria-label="Questions fréquentes">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title rainbow-text-static">Questions fréquentes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur notre assistant commercial IA et comment il transforme la prospection B2B.
            </p>
          </div>
          <div className="flex justify-center">
            <FAQSection />
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
}
