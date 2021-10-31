import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import transEn from './translations/en.json'
import transUrd from './translations/urd.json'

// the translations
const resources = {
    en: {
      translation: transEn
    },
    urd: {
      translation: transUrd
    }
  };

i18n
   .use(LanguageDetector) // passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources,
    //lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });