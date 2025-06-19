
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage();

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent border-none text-sm focus:outline-none cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
