
import React, { createContext, useContext, ReactNode } from 'react';
import { fr } from '@/translations/fr';
import type { TranslationKeys } from '@/translations';

interface LanguageContextType {
  t: TranslationKeys;
}

// Add required properties for the pricing.plans.automate
const translationWithRequiredFields = {
  ...fr,
  pricing: {
    ...fr.pricing,
    plans: {
      ...fr.pricing.plans,
      automate: {
        ...fr.pricing.plans.automate,
        badge: fr.pricing.plans.automate.badge || "Plus populaire", 
        trial: fr.pricing.plans.automate.trial || "Essai gratuit de 14 jours"
      }
    }
  }
} as TranslationKeys;

const LanguageContext = createContext<LanguageContextType>({
  t: translationWithRequiredFields
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageContext.Provider value={{ 
      t: translationWithRequiredFields
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
