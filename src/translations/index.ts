
import { fr } from './fr';

// Define a more complete type structure for our translations
export interface TranslationKeys {
  common: {
    bookDemo: string;
    learnMore: string;
    contactUs: string;
    viewDetails: string;
    availableNow: string;
  };
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    bookDemo: string;
    home: string;
  };
  home: {
    hero: {
      introducing: string;
      title: string;
      actions: string[];
      subtitle: string;
      description: string;
      buttons: {
        bookDemo: string;
        hireNow: string;
      };
    };
    features: {
      title: string;
      subtitle: string;
    };
    meetTeam: {
      title: string;
      subtitle: string;
    };
    howItWorks: {
      title: string;
      subtitle: string;
      steps: string[];
    };
    faq: {
      title: string;
      subtitle: string;
    };
    testimonials?: {
      title: string;
      subtitle: string;
      quotes?: Array<{
        text: string;
        author: string;
        handle: string;
      }>;
    };
    benefits?: {
      title: string;
      description: string;
      items?: Array<{
        title: string;
        description: string;
      }>;
    };
    aiEmployees?: {
      title: string;
      napoleon?: {
        name: string;
        description: string;
        cta: string;
      };
      talie?: {
        name: string;
        description: string;
        cta: string;
      };
      julienne?: {
        name: string;
        description: string;
        cta: string;
      };
      bastien?: {
        name: string;
        description: string;
        cta: string;
      };
      lafayette?: {
        name: string;
        description: string;
        cta: string;
      };
      voltaire?: {
        name: string;
        description: string;
        cta: string;
      };
    };
    partners: {
      title: string;
    };
  };
  footer: {
    tagline: string;
    copyright: string;
    menuTitles: {
      product: string;
      company: string;
      resources: string;
      connect: string;
    };
    links: {
      terms: string;
      privacy: string;
      cookies: string;
      overview: string;
      aboutUs: string;
      careers: string;
    };
  };
  about: {
    title: string;
    story: {
      title: string;
      text1: string;
      text2: string;
    };
    mission: {
      title: string;
      text1: string;
      text2: string;
    };
    unique: {
      title: string;
      items: string[];
    };
    cta: {
      title: string;
      text: string;
      button: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
    };
  };
  pricing: {
    title?: string;
    description?: string;
    joinText?: string;
    plans: {
      once: {
        name: string;
        price: string;
        period: string;
        description: string;
        features?: string[];
        buttonText?: string;
      };
      automate: {
        name: string;
        price: string;
        period: string;
        description: string;
        badge: string;
        trial: string;
        features?: string[];
        buttonText?: string;
      };
      integrate: {
        name: string;
        price: string;
        period: string;
        description: string;
        trial?: string;
        features?: string[];
        buttonText?: string;
      };
    };
  };
  legal: {
    terms: {
      title: string;
      updated: string;
    };
    privacy: {
      title: string;
      updated: string;
    };
    cookies: {
      title: string;
      updated: string;
      consent: {
        title: string;
        description: string;
        learnMore: string;
        buttons: {
          essentialOnly: string;
          acceptAll: string;
        };
        toast: {
          accepted: string;
          essential: string;
          description: string;
          essentialDescription: string;
        };
      };
    };
  };
  blog: {
    title: string;
    subtitle: string;
    loadMore: string;
    allLoaded: string;
    endReached: string;
    postNotFound: string;
    postNotFoundDesc: string;
    backToBlog: string;
  };
  faq?: {
    general?: {
      title: string;
      items?: Array<{
        question: string;
        answer: string;
      }>;
    };
    aiEmployees?: {
      title: string;
      items?: Array<{
        question: string;
        answer: string;
      }>;
    };
    stillHaveQuestions?: {
      title: string;
      description: string;
    };
    lastUpdated?: string;
  };
  notFound: {
    title: string;
    message: string;
    button: string;
  };
}

export const translations = {
  fr,
};

export type SupportedLanguage = keyof typeof translations;
