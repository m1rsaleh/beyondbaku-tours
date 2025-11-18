import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';

i18n
  .use(LanguageDetector) // Tarayıcı dilini otomatik algıla
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: translations.tr },
      en: { translation: translations.en },
      ru: { translation: translations.ru },
      az: { translation: translations.az }
    },
    fallbackLng: 'az', // Varsayılan dil Azerbaycan
    lng: localStorage.getItem('language') || 'az', // Kaydedilmiş dili yükle
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

// Dil değiştiğinde localStorage'a kaydet
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
