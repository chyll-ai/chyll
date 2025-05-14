
import React, { createContext, useContext, ReactNode } from 'react';
import { fr } from '@/translations/fr';
import type { TranslationKeys } from '@/translations';

interface LanguageContextType {
  t: TranslationKeys;
  language: string; // Add the language property
}

// Add required properties for the pricing.plans.growth (which replaced automate)
const translationWithRequiredFields = {
  ...fr,
  pricing: {
    ...fr.pricing,
    plans: {
      ...fr.pricing.plans,
      growth: {
        ...fr.pricing.plans.growth,
        badge: fr.pricing.plans.growth.badge || "Plus populaire", 
        trial: fr.pricing.plans.growth.trial || "Essai gratuit de 14 jours"
      }
    }
  }
} as TranslationKeys;

const LanguageContext = createContext<LanguageContextType>({
  t: translationWithRequiredFields,
  language: 'fr' // Set default language to French
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageContext.Provider value={{ 
      t: translationWithRequiredFields,
      language: 'fr' // Since we're keeping French only
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
