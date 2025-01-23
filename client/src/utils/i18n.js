import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import enTranslation from '../../public/locales/en/translation.json';
import bnTranslation from '../../public/locales/bn/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  bn: {
    translation: bnTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'bn',
    fallbackLng: 'bn',
    supportedLngs: ['en', 'bn'],
    debug: false,
    detection: {
      order: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      wait: true
    }
  });

// Force set default language to Bangla
if (i18n.language !== 'bn') {
  i18n.changeLanguage('bn');
}

export default i18n; 