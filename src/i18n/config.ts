import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: { nav: { home: 'Ana Sayfa', tours: 'Turlar', about: 'Hakkımızda', contact: 'İletişim' }}},
    en: { translation: { nav: { home: 'Home', tours: 'Tours', about: 'About', contact: 'Contact' }}}
  },
  lng: 'tr',
  fallbackLng: 'tr',
  interpolation: { escapeValue: false }
})

export default i18n
