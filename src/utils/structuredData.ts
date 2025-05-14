// Organization schema
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'chyll.ai',
    alternateName: ['chyll', 'Chyll AI'],
    url: 'https://chyll.ai',
    logo: 'https://chyll.ai/logo.png',
    sameAs: [
      'https://twitter.com/chyllai',
      'https://linkedin.com/company/chyll-ai',
      'https://facebook.com/chyllai',
      'https://cal.com/chyll.ai',
      'https://buy.stripe.com/5kAeWh18h6cOenSeUV'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33 6 99 40 76 73',
      contactType: 'customer service',
      email: 'contact@chyll.ai',
      availableLanguage: ['French', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60 RUE FRANCOIS IER',
      addressLocality: 'PARIS',
      postalCode: '75008',
      addressCountry: 'FR'
    },
    description: 'chyll.ai est un agent SDR automatisé qui trouve les bons prospects, les enrichit, et met à jour votre CRM pendant que vous travaillez sur autre chose.',
    slogan: 'La prospection B2B, automatisée',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'Soufiane Lemqari',
        jobTitle: 'CEO & Founder',
        sameAs: 'https://linkedin.com/in/soufiane-lemqari'
      }
    ],
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '15'
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '48.8566',
        longitude: '2.3522'
      },
      geoRadius: '5000'
    }
  };
};

// Article schema for blog posts
export const getArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishDate: string;
  modifiedDate?: string;
  authorName: string;
  authorUrl?: string;
  keywords?: string[];
  category?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      '@type': 'Person',
      name: article.authorName,
      url: article.authorUrl || 'https://chyll.ai/team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'chyll.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chyll.ai/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    },
    keywords: article.keywords?.join(', ') || 'prospection B2B, SDR, enrichissement, leads, automation',
    articleSection: article.category || 'Prospection B2B',
    isAccessibleForFree: true,
    inLanguage: 'fr-FR'
  };
};

// FAQPage schema
export const getFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Product schema
export const getProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  url: string;
  sku: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
  }
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name || 'chyll.ai',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: product.description || 'Agent SDR automatisé pour la prospection B2B',
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: product.offers.availability,
      url: product.url,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '215'
    },
    featureList: "Enrichissement de leads, Recherche automatisée de prospects, Export et import de data, Personas LinkedIn illimités, Interface CRM personnalisée",
    keywords: "chyll.ai, prospection B2B, SDR automatisé, enrichissement de leads, automation commerciale"
  };
};

// Breadcrumb schema
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// SoftwareApplication schema specifically for chyll.ai
export const getChyllAiSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'chyll.ai',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Sales Development Tool',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '99.00',
        priceCurrency: 'EUR',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        description: 'Parfait pour les petites équipes',
        url: 'https://chyll.ai/offres/starter',
        availability: 'https://schema.org/InStock',
        actionPlatform: 'https://buy.stripe.com/5kAeWh18h6cOenSeUV'
      },
      {
        '@type': 'Offer',
        name: 'Growth',
        price: '200.00',
        priceCurrency: 'EUR',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        description: 'Pour les équipes en croissance',
        url: 'https://chyll.ai/offres/growth',
        availability: 'https://schema.org/InStock',
        actionPlatform: 'https://cal.com/chyll.ai/30min'
      },
      {
        '@type': 'Offer',
        name: 'Scale',
        price: '300.00',
        priceCurrency: 'EUR',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        description: 'Pour les équipes commerciales établies',
        url: 'https://chyll.ai/offres/scale',
        availability: 'https://schema.org/InStock',
        actionPlatform: 'https://cal.com/chyll.ai/30min'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '215',
      bestRating: '5',
      worstRating: '1'
    },
    description: "chyll.ai est un agent SDR automatisé qui trouve les bons prospects, les enrichit avec des numéros de téléphone et emails, et met à jour votre CRM.",
    featureList: "Enrichissement de leads, Recherche automatisée de prospects, Export et import de data, Personas LinkedIn illimités",
    keywords: "chyll.ai, prospection B2B, SDR automatisé, enrichissement de leads, automation commerciale",
    screenshot: "https://chyll.ai/screenshots/dashboard.png",
    softwareVersion: "2.5.0",
    releaseNotes: "https://chyll.ai/releases",
    downloadUrl: "https://chyll.ai/download",
    requirements: "Navigateur web moderne. Compatible avec Chrome, Firefox, Safari, Edge.",
    review: [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Thomas Martin"
        },
        "datePublished": "2025-02-15",
        "reviewBody": "Un gain de temps incroyable pour notre équipe commerciale. Nous avons multiplié par 3 notre volume de leads qualifiés."
      }
    ],
    externalServices: [
      {
        "@type": "WebApplication",
        "name": "Cal.com",
        "url": "https://cal.com/chyll.ai/30min",
        "description": "Réservation de démonstration"
      },
      {
        "@type": "WebApplication",
        "name": "Stripe",
        "url": "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
        "description": "Plateforme de paiement"
      }
    ]
  };
};

// Local Business schema
export const getLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'chyll.ai',
    image: 'https://chyll.ai/office.jpg',
    '@id': 'https://chyll.ai',
    url: 'https://chyll.ai',
    telephone: '+33 6 99 40 76 73',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60 RUE FRANCOIS IER',
      addressLocality: 'PARIS',
      postalCode: '75008',
      addressCountry: 'FR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '48.8566',
      longitude: '2.3522'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    sameAs: [
      'https://twitter.com/chyllai',
      'https://linkedin.com/company/chyll-ai',
      'https://facebook.com/chyllai'
    ]
  };
};

// Update the JSON offers data in the public folder
export const getOffersJsonData = () => {
  return {
    "offres": [
      {
        "id": "starter",
        "nom": "Starter",
        "prix": "99€",
        "description": "Parfait pour les petites équipes",
        "url": "https://chyll.ai/offres/starter",
        "action": "https://buy.stripe.com/5kAeWh18h6cOenSeUV",
        "texteAction": "Commencer l'essai"
      },
      {
        "id": "growth",
        "nom": "Growth",
        "prix": "200€",
        "description": "Pour les équipes en croissance",
        "url": "https://chyll.ai/offres/growth",
        "action": "https://cal.com/chyll.ai/30min",
        "texteAction": "Réserver une démo"
      },
      {
        "id": "scale",
        "nom": "Scale",
        "prix": "300€",
        "description": "Pour les équipes commerciales établies",
        "url": "https://chyll.ai/offres/scale",
        "action": "https://cal.com/chyll.ai/30min",
        "texteAction": "Réserver une démo"
      }
    ]
  };
};
