import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import de from './de.json';
import fr from './fr.json';

export const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
];

const resources = {
    en,
    es,
    de,
    fr,
};

const browserLanguage = navigator.language.split('-')[0];

let initialLanguage = localStorage.getItem('language');

if (!initialLanguage) {
  if (Object.keys(resources).includes(browserLanguage)) {
    initialLanguage = browserLanguage;
  } else {
    initialLanguage = 'en';
  }
  localStorage.setItem('language', initialLanguage);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
