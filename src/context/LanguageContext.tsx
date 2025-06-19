
import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslate, useTolgee } from '@tolgee/react';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: ReturnType<typeof useTranslate>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslate();
  const tolgee = useTolgee(['language']);
  
  const changeLanguage = (lang: string) => {
    tolgee.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      language: tolgee.getLanguage(), 
      changeLanguage,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
