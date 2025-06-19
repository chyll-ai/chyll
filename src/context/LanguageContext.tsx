
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr'
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageContext.Provider value={{ language: 'fr' }}>
      {children}
    </LanguageContext.Provider>
  );
};
