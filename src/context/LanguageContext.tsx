
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage, TranslationKeys } from '@/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationKeys;
  toggleLanguage: () => void;
}

const defaultLanguage: SupportedLanguage = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: translations[defaultLanguage],
  toggleLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage, default to 'en'
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    return savedLanguage && Object.keys(translations).includes(savedLanguage) 
      ? savedLanguage 
      : defaultLanguage;
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'fr' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translations[language],
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
