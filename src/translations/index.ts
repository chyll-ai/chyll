
import { en } from './en';
import { fr } from './fr';

// Ensure TypeScript knows the complete structure of translations
export type TranslationKeys = typeof en;

export const translations = {
  en,
  fr,
};

export type SupportedLanguage = keyof typeof translations;
