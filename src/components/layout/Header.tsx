import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className={`text-xl sm:text-2xl font-serif font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              BeyondBaku
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-gold transition ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/tours" 
              className={`font-medium hover:text-gold transition ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {t('nav.tours')}
            </Link>
            <Link 
              to="/about" 
              className={`font-medium hover:text-gold transition ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium hover:text-gold transition ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {t('nav.contact')}
            </Link>

            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition ${
                scrolled 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="az">AZ</option>
            </select>

            {/* Book Button */}
            <Link
              to="/tours"
              className="px-6 py-2.5 bg-gold text-white font-semibold rounded-full hover:bg-gold/90 transition shadow-lg hover:shadow-xl"
            >
              Rezervasyon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Language */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className={`px-2 py-1 rounded-lg text-sm font-medium ${
                scrolled ? 'bg-gray-100 text-gray-700' : 'bg-white/20 text-white'
              }`}
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="az">AZ</option>
            </select>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
              }`}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className={`py-4 space-y-3 ${scrolled ? 'border-t border-gray-100 mt-4' : ''}`}>
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/tours" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('nav.tours')}
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('nav.about')}
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('nav.contact')}
                </Link>

                <Link
                  to="/tours"
                  onClick={() => setIsMenuOpen(false)}
                  className="block mx-4 px-6 py-3 bg-gold text-white font-semibold rounded-full hover:bg-gold/90 transition text-center"
                >
                  Rezervasyon
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
