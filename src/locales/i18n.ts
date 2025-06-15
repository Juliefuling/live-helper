import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-fs-backend";
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './index';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    ns: ['common', 'app', 'electron'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React已经处理XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`[i18n] Missing translation: ${lng}.${ns}.${key}`);
    }
  });

export default i18n;