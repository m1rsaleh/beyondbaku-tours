import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white shadow-md"
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">B</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900">
              BeyondBaku
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <Link to="/" className="font-medium text-gray-700 hover:text-gold transition">
              {t('nav.home')}
            </Link>
            <Link to="/tours" className="font-medium text-gray-700 hover:text-gold transition">
              {t('nav.tours')}
            </Link>
            <Link to="/about" className="font-medium text-gray-700 hover:text-gold transition">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="font-medium text-gray-700 hover:text-gold transition">
              {t('nav.contact')}
            </Link>

            {/* Language Selector */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg font-medium cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="az">AZ</option>
            </select>

            {/* Book Button */}
            <Link
              to="/tours"
              className="px-4 lg:px-6 py-2 lg:py-2.5 bg-gold text-white font-semibold rounded-full hover:bg-gold/90 transition shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Rezervasyon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="px-2 py-1 text-xs sm:text-sm rounded-lg font-medium cursor-pointer bg-gray-100 text-gray-700"
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="az">AZ</option>
            </select>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
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
              <div className="py-4 space-y-2 border-t border-gray-100 mt-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/tours" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {t('nav.tours')}
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {t('nav.about')}
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {t('nav.contact')}
                </Link>

                <div className="pt-3">
                  <Link
                    to="/tours"
                    onClick={() => setIsMenuOpen(false)}
                    className="block mx-4 px-6 py-3 bg-gold text-white font-semibold rounded-full hover:bg-gold/90 transition text-center"
                  >
                    Rezervasyon
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
