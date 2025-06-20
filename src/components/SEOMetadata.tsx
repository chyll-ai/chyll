
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetadataProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  structuredData?: object;
  keywords?: string[];
  author?: string;
  language?: 'fr' | 'en';
  pageUrl?: string;
  offers?: {
    name: string;
    price: string;
    description: string;
    url: string;
  }[];
}

const SEOMetadata = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/lovable-uploads/dd35b91f-36a3-4849-ab8e-6941ead9b4f4.png',
  articlePublishedTime,
  articleModifiedTime,
  structuredData,
  keywords = ['chyll', 'chyll.ai', 'assistant commercial chyll', 'logiciel chyll', 'automatisation des ventes', 'outil IA pour la prospection'],
  author = 'chyll',
  language = 'fr',
  pageUrl,
  offers
}: SEOMetadataProps) => {
  const fullTitle = title ? `${title} | chyll` : 'chyll - Assistant commercial IA pour les startups et PME';
  const siteUrl = 'https://chyll.ai';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  const fullPageUrl = pageUrl || fullCanonicalUrl || siteUrl;
  
  // Default structured data for WebSite
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'chyll',
    alternateName: ['chyll.ai', 'Chyll AI', 'plateforme chyll', 'assistant commercial chyll'],
    url: siteUrl,
    description: 'chyll est un assistant commercial IA qui automatise la prospection B2B pour les startups et PME. Trouvez les bons prospects, enrichissez leurs données, et mettez à jour votre CRM.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
  
  // SoftwareApplication structured data specifically for chyll
  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'chyll',
    alternateName: ['chyll.ai', 'Chyll AI', 'plateforme chyll'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Sales Development Tool',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '99.00',
      priceCurrency: 'EUR'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '215'
    }
  };
  
  // Generate service/product schemas from offers
  const servicesStructuredData = offers ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: offers.map((offer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: offer.name,
        description: offer.description,
        url: offer.url,
        offers: {
          '@type': 'Offer',
          price: offer.price.replace('€', ''),
          priceCurrency: 'EUR',
          url: offer.url
        }
      }
    }))
  } : null;
  
  // Update pricing information for structured data
  const pricingPlans = [
    {
      name: "Starter",
      price: "99€",
      description: "Parfait pour les petites équipes",
      url: "https://chyll.ai/offres/starter",
      actionUrl: "https://buy.stripe.com/5kAeWh18h6cOenSeUV"
    },
    {
      name: "Growth",
      price: "200€",
      description: "Pour les équipes en croissance",
      url: "https://chyll.ai/offres/growth",
      actionUrl: "https://cal.com/chyll.ai/30min"
    },
    {
      name: "Scale",
      price: "300€",
      description: "Pour les équipes commerciales établies",
      url: "https://chyll.ai/offres/scale",
      actionUrl: "https://cal.com/chyll.ai/30min"
    }
  ];
  
  // Business info structured data
  const businessStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'chyll',
    alternateName: ['chyll.ai', 'Chyll AI', 'plateforme chyll'],
    image: `${siteUrl}/lovable-uploads/860cdec8-1919-4afc-928c-cbfa116c2f7b.png`,
    url: siteUrl,
    telephone: '+33 6 99 40 76 73',
    email: 'contact@chyll.ai',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60 RUE FRANCOIS IER',
      addressLocality: 'PARIS',
      postalCode: '75008',
      addressCountry: 'FR'
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    priceRange: '€€',
    sameAs: [
      'https://twitter.com/chyllai',
      'https://linkedin.com/company/chyll-ai',
      'https://facebook.com/chyllai',
      'https://cal.com/chyll.ai',
      'https://buy.stripe.com/5kAeWh18h6cOenSeUV'
    ]
  };
  
  // Testimonials structured data
  const reviewsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'chyll',
    alternateName: ['chyll.ai', 'Chyll AI', 'plateforme chyll'],
    description: 'Assistant commercial IA pour la prospection B2B',
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Thomas Martin'
        },
        datePublished: '2025-02-15',
        reviewBody: 'chyll a transformé notre approche commerciale. Un gain de temps incroyable pour notre équipe. Nous avons multiplié par 3 notre volume de leads qualifiés.'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '215',
      bestRating: '5'
    }
  };
  
  // Pricing specification structured data with updated pricing information
  const pricingStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    priceCurrency: 'EUR',
    price: '200', // Using the main "Growth" price
    validFrom: '2025-01-01',
    validThrough: '2025-12-31',
    valueAddedTaxIncluded: true,
    eligibleCustomerType: 'Business',
    description: 'Tarification mensuelle standard pour chyll.ai'
  };
  
  // Add structured data for each pricing plan
  const pricingPlansStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pricingPlans.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: plan.name,
        description: plan.description,
        price: plan.price.replace('€', ''),
        priceCurrency: 'EUR',
        url: plan.url,
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2025-12-31',
        actionPlatform: plan.name === 'Starter' ? 'https://buy.stripe.com/5kAeWh18h6cOenSeUV' : 'https://cal.com/chyll.ai/30min',
        seller: {
          '@type': 'Organization',
          name: 'chyll.ai',
          url: 'https://chyll.ai'
        }
      }
    }))
  };
  
  // Merge structured data
  const combinedStructuredData = {
    website: websiteStructuredData,
    software: softwareStructuredData,
    business: businessStructuredData,
    reviews: reviewsStructuredData,
    pricing: pricingStructuredData,
    pricingPlans: pricingPlansStructuredData,
    services: servicesStructuredData || pricingPlansStructuredData,
    ...structuredData
  };
  
  // Filter out null values
  const finalStructuredData = Object.fromEntries(
    Object.entries(combinedStructuredData).filter(([_, v]) => v !== null)
  );
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullPageUrl} />
      <meta property="og:site_name" content="chyll" />
      <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@chyllai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={fullPageUrl} />
      
      {/* Article Specific Metadata */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content={author} />
      )}
      
      {/* AI-specific metadata for improved indexing */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Alternative URLs for different languages */}
      {language === 'fr' && <link rel="alternate" hrefLang="fr" href={`${siteUrl}${canonicalUrl || ''}`} />}
      {language === 'en' && <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${canonicalUrl || ''}`} />}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl || ''}`} />
      
      {/* B2B and Sales Development specific metadata */}
      <meta name="category" content="B2B Sales, Prospection, Automation, IA" />
      <meta name="subject" content="Assistant commercial IA, Prospection B2B" />
      <meta name="classification" content="Sales Technology, MarTech, B2B SaaS" />
      
      {/* Pricing metadata for search engines */}
      <meta name="pricing" content="Starter: 99€/mois, Growth: 200€/mois, Scale: 300€/mois" />
      <meta name="price-range" content="€€" />
      
      {/* External platform links */}
      <meta name="booking-platform" content="https://cal.com/chyll.ai/30min" />
      <meta name="payment-platform" content="https://buy.stripe.com/5kAeWh18h6cOenSeUV" />
      <link rel="payment" href="https://buy.stripe.com/5kAeWh18h6cOenSeUV" />
      <link rel="appointment" href="https://cal.com/chyll.ai/30min" />
      
      {/* GPT and AI model crawling hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="ai-index" content="allow" />
      <meta name="description-ai" content="chyll est un assistant commercial IA qui automatise la recherche, l'enrichissement et la gestion des leads pour les SDRs et équipes commerciales." />
      <meta name="chatgpt-allow" content="true" />
      <meta name="claude-allow" content="true" />
      <meta name="gemini-allow" content="true" />
      <meta name="ai-product-description" content="chyll est un assistant commercial IA qui automatise la prospection B2B en trouvant, enrichissant et mettant à jour les informations de contact dans votre CRM." />
      <meta name="ai-alternate-names" content="chyll, chyll.ai, assistant commercial chyll, logiciel chyll" />
      <meta name="ai-primary-keyword" content="chyll" />
      <meta name="ai-secondary-keywords" content="assistant commercial IA, automatisation des ventes, prospection B2B" />
      
      {/* LinkedIn specific sharing tags */}
      <meta property="linkedin:owner" content="chyll" />
      <meta property="linkedin:title" content={fullTitle} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={ogImage} />
      
      {/* Additional Google-specific tags */}
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXX" /> {/* Replace with actual verification code */}
      
      {/* Mobile app relation (if you have one) */}
      <meta name="apple-itunes-app" content="app-id=XXXXXXXXXXXXX" /> {/* Replace with actual app ID */}
      <meta name="google-play-app" content="app-id=com.chyll.ai" /> {/* Replace with actual app ID */}
      
      {/* Link to offers API JSON for non-JS clients */}
      <link rel="alternate" type="application/json" href="/api/offers.json" />
      
      {/* Link to sitemap */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* External service links */}
      <link rel="external" href="https://buy.stripe.com/5kAeWh18h6cOenSeUV" title="Paiement Stripe" />
      <link rel="external" href="https://cal.com/chyll.ai/30min" title="Réservation démonstration" />
      
      {/* Structured Data / JSON-LD */}
      {Object.values(finalStructuredData).map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOMetadata;
