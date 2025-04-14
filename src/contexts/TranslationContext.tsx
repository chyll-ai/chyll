
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultValue: TranslationContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
};

const TranslationContext = createContext<TranslationContextType>(defaultValue);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.ts`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setTranslations({});
      }
    };

    loadTranslations();

    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Initialize language from localStorage or browser setting
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'fr')) {
      setLanguage(storedLanguage);
    } else {
      // Try to detect from browser
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        setLanguage('fr');
      }
    }
  }, []);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
