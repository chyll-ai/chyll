
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage, TranslationKeys } from '@/translations';
import { detectCountryFromIP, mapCountryToLanguage } from '@/utils/ipCountry';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationKeys;
  toggleLanguage: () => void;
  isDetectingLanguage: boolean;
}

const defaultLanguage: SupportedLanguage = 'fr'; // Changed to French by default

// Create empty placeholder objects for missing required properties in TranslationKeys
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

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: { ...translations[defaultLanguage], ...placeholderData },
  toggleLanguage: () => {},
  isDetectingLanguage: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(true);

  // Effect for initial language detection
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // First check localStorage (user preference takes priority)
        const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
        
        if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
          setLanguage(savedLanguage);
          setIsDetectingLanguage(false);
          return;
        }
        
        // Then try IP-based detection
        const countryCode = await detectCountryFromIP();
        if (countryCode) {
          const detectedLanguage = mapCountryToLanguage(countryCode);
          if (detectedLanguage && Object.keys(translations).includes(detectedLanguage)) {
            setLanguage(detectedLanguage as SupportedLanguage);
            localStorage.setItem('language', detectedLanguage);
          }
        }
      } catch (error) {
        console.error('Error during language detection:', error);
      } finally {
        setIsDetectingLanguage(false);
      }
    };
    
    detectLanguage();
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (!isDetectingLanguage) {
      localStorage.setItem('language', language);
    }
  }, [language, isDetectingLanguage]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'fr' : 'en');
  };

  // Add missing properties to ensure TranslationKeys compatibility
  const translationWithDefaults = {
    ...translations[language],
    ...placeholderData
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translationWithDefaults as TranslationKeys,
      toggleLanguage,
      isDetectingLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
