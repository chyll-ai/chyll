
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
  keywords = ['chyll.ai', 'chyll', 'prospection B2B', 'SDR agent', 'enrichissement de leads'],
  author = 'chyll.ai',
  language = 'fr',
  pageUrl,
  offers
}: SEOMetadataProps) => {
  const fullTitle = title ? `${title} | chyll.ai` : 'chyll.ai | La prospection B2B, automatisée';
  const siteUrl = 'https://chyll.ai';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  const fullPageUrl = pageUrl || fullCanonicalUrl || siteUrl;
  
  // Default structured data for WebSite
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'chyll.ai',
    url: siteUrl,
    description: 'La prospection B2B, automatisée. chyll.ai trouve les bons prospects, les enrichit, et met à jour ton CRM.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
  
  // SoftwareApplication structured data specifically for chyll.ai
  const softwareStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'chyll.ai',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '199.00',
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
  
  // Business info structured data
  const businessStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'chyll.ai',
    image: `${siteUrl}/lovable-uploads/860cdec8-1919-4afc-928c-cbfa116c2f7b.png`,
    url: siteUrl,
    telephone: '+33 1 23 45 67 89',
    email: 'contact@chyll.ai',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60 RUE FRANCOIS IER',
      addressLocality: 'PARIS',
      postalCode: '75008',
      addressCountry: 'FR'
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    priceRange: '€€'
  };
  
  // Testimonials structured data
  const reviewsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'chyll.ai',
    description: 'Agent SDR automatisé pour la prospection B2B',
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
        reviewBody: 'Un gain de temps incroyable pour notre équipe commerciale. Nous avons multiplié par 3 notre volume de leads qualifiés.'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '215',
      bestRating: '5'
    }
  };
  
  // Pricing specification structured data
  const pricingStructuredData = offers ? {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    priceCurrency: 'EUR',
    price: offers[1].price.replace('€', ''), // Using the main "Automate" price
    validFrom: '2025-01-01',
    validThrough: '2025-12-31',
    valueAddedTaxIncluded: true,
    eligibleCustomerType: 'Business',
    description: 'Tarification mensuelle standard pour chyll.ai'
  } : null;
  
  // Merge structured data
  const combinedStructuredData = {
    website: websiteStructuredData,
    software: softwareStructuredData,
    business: businessStructuredData,
    reviews: reviewsStructuredData,
    pricing: pricingStructuredData,
    services: servicesStructuredData,
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
      <meta property="og:site_name" content="chyll.ai" />
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
      
      {/* Alternative URLs for different languages - Fixed hreflang to hrefLang */}
      {language === 'fr' && <link rel="alternate" hrefLang="fr" href={`${siteUrl}${canonicalUrl || ''}`} />}
      {language === 'en' && <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${canonicalUrl || ''}`} />}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl || ''}`} />
      
      {/* B2B and Sales Development specific metadata */}
      <meta name="category" content="B2B Sales, Prospection, SDR Tools" />
      <meta name="subject" content="Automation pour SDR, Prospection B2B" />
      <meta name="classification" content="Sales Technology, MarTech, B2B SaaS" />
      
      {/* GPT and AI model crawling hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="ai-index" content="allow" />
      <meta name="description-ai" content="chyll.ai est un assistant virtuel de prospection B2B qui automatise la recherche, l'enrichissement et la gestion des leads pour les SDRs et équipes commerciales." />
      <meta name="chatgpt-allow" content="true" />
      <meta name="claude-allow" content="true" />
      <meta name="gemini-allow" content="true" />
      
      {/* LinkedIn specific sharing tags */}
      <meta property="linkedin:owner" content="chyll.ai" />
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
