import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationES from "./locales/es.json";
import translationEN from "./locales/en.json";
import translationDE from "./locales/de.json";
import translationFR from "./locales/fr.json";
import translationIT from "./locales/it.json";

const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
  de: { translation: translationDE },
  fr: { translation: translationFR },
  it: { translation: translationIT },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es", // Español as safe fallback
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
