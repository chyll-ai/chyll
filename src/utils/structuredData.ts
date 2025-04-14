
// Organization schema
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GenerativSchool',
    url: 'https://generativschool.com',
    logo: 'https://generativschool.com/logo.png',
    sameAs: [
      'https://twitter.com/generativschool',
      'https://linkedin.com/company/generativschool',
      'https://facebook.com/generativschool'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'contact@generativschool.com',
      availableLanguage: ['English']
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
      url: 'https://generativschool.com/team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'GenerativSchool',
      logo: {
        '@type': 'ImageObject',
        url: 'https://generativschool.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
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
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: product.offers.availability,
      url: product.url
    }
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
