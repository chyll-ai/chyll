
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
}

const SEOMetadata = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/lovable-uploads/860cdec8-1919-4afc-928c-cbfa116c2f7b.png', // Updated to use the new image
  articlePublishedTime,
  articleModifiedTime,
  structuredData,
  keywords = ['chyll.ai', 'chyll', 'prospection B2B', 'SDR agent', 'enrichissement de leads'],
  author = 'chyll.ai',
  language = 'fr',
}: SEOMetadataProps) => {
  const fullTitle = title ? `${title} | chyll.ai` : 'chyll.ai | La prospection B2B, automatisée';
  const siteUrl = 'https://chyll.ai';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  
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
  
  // Merge structured data
  const combinedStructuredData = {
    website: websiteStructuredData,
    software: softwareStructuredData,
    ...structuredData
  };
  
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
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:site_name" content="chyll.ai" />
      <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@chyllai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {fullCanonicalUrl && <meta name="twitter:url" content={fullCanonicalUrl} />}
      
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
      
      {/* Structured Data / JSON-LD */}
      {Object.values(combinedStructuredData).map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOMetadata;
