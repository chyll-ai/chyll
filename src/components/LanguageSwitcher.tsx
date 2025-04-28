
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'icon';
}

const LanguageSwitcher = ({ variant = 'default' }: LanguageSwitcherProps) => {
  const { language, toggleLanguage } = useLanguage();
  
  if (variant === 'icon') {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleLanguage} 
        className="rounded-full p-2"
        title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
      >
        <Globe size={18} />
      </Button>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <button 
        onClick={toggleLanguage}
        className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <Globe size={16} className="mr-1" />
        <span>{language === 'en' ? 'FR' : 'EN'}</span>
      </button>
    );
  }
  
  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
    >
      <Globe size={16} />
      {language === 'en' ? 'Français' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
