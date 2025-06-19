
import { Tolgee, DevTools, FormatSimple } from '@tolgee/i18n';
import { TolgeeProvider } from '@tolgee/react';

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: 'fr',
    defaultLanguage: 'fr',
    apiUrl: process.env.REACT_APP_TOLGEE_API_URL || 'https://app.tolgee.io',
    apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
    fallbackLanguage: 'fr',
  });
