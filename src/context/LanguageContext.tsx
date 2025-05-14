
import React, { createContext, useContext, ReactNode } from 'react';
import { fr } from '@/translations/fr';
import type { TranslationKeys } from '@/translations';

interface LanguageContextType {
  t: TranslationKeys;
  language: 'fr'; // Keep language property but fix it to 'fr'
}

// Add missing properties to ensure TranslationKeys compatibility
const placeholderData = {
  about: {
    title: "",
    story: {
      title: "",
      text1: "",
      text2: ""
    },
    mission: {
      title: "",
      text1: "",
      text2: ""
    },
    unique: {
      title: "",
      items: [""]
    },
    cta: {
      title: "",
      text: "",
      button: ""
    }
  },
  blog: {
    title: "",
    subtitle: "",
    loadMore: "",
    allLoaded: "",
    endReached: ""
  }
};

// Add required properties for the pricing.plans.automate
const frWithRequiredFields = {
  ...fr,
  pricing: {
    ...fr.pricing,
    plans: {
      ...fr.pricing.plans,
      automate: {
        ...fr.pricing.plans.automate,
        badge: "Plus populaire", // Add required badge field
        trial: "Essai gratuit de 14 jours" // Add required trial field
      }
    }
  }
};

const translationWithDefaults = {
  ...frWithRequiredFields,
  ...placeholderData
} as TranslationKeys;

const LanguageContext = createContext<LanguageContextType>({
  t: translationWithDefaults,
  language: 'fr'
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageContext.Provider value={{ 
      t: translationWithDefaults,
      language: 'fr'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
