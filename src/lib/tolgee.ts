
import { Tolgee, DevTools, FormatSimple } from '@tolgee/react';

export const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: 'fr',
    defaultLanguage: 'fr',
    apiUrl: import.meta.env.REACT_APP_TOLGEE_API_URL || 'https://app.tolgee.io',
    apiKey: import.meta.env.REACT_APP_TOLGEE_API_KEY,
    fallbackLanguage: 'fr',
  });
