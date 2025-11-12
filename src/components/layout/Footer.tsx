import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary via-dark-blue to-primary text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-serif font-bold mb-4 text-gold">
                Özel Fırsatlardan Haberdar Ol
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Yeni turlar ve indirimli fiyatlar için e-bültenimize katıl
              </p>
              
              <form className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-gold hover:bg-gold/90 text-dark-blue font-bold rounded-full transition shadow-lg hover:shadow-gold/50"
                >
                  Abone Ol
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-gold/50">
                <span className="text-dark-blue font-bold text-3xl">B</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold block">BeyondBaku</span>
                <span className="text-xs text-gold">Premium Travel</span>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Azerbaycan'ın en güzel rotalarını keşfedin. Premium seyahat deneyimi için biz yanınızdayız.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, url: 'https://facebook.com', label: 'Facebook' },
                { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
                { icon: FaTiktok, url: 'https://tiktok.com', label: 'TikTok' },
                { icon: FaWhatsapp, url: 'https://wa.me/994XXXXXXXXX', label: 'WhatsApp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 bg-white/10 hover:bg-gold hover:text-dark-blue rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-gold border-b border-gold/30 pb-3">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Turlarımız', path: '/tours' },
                { name: 'Hakkımızda', path: '/about' },
                { name: 'İletişim', path: '/contact' },
                { name: 'Blog', path: '/blog' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-300 hover:text-gold transition hover:translate-x-2 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-gold border-b border-gold/30 pb-3">
              Popüler Destinasyonlar
            </h4>
            <ul className="space-y-3">
              {['Bakü', 'Quba', 'Şəki', 'Qəbələ', 'Lahıc'].map((dest) => (
                <li key={dest}>
                  <Link 
                    to={`/tours?dest=${dest}`} 
                    className="text-gray-300 hover:text-gold transition hover:translate-x-2 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {dest} Turları
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-gold border-b border-gold/30 pb-3">
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <FaMapMarkerAlt className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition" />
                <span className="text-gray-300">
                  28 May Mall, 3rd Floor<br />
                  Bakü, Azerbaycan
                </span>
              </li>
              <li>
                <a
                  href="tel:+994501234567"
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaPhone className="text-gold group-hover:rotate-12 transition" />
                  +994 50 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/994501234567"
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaWhatsapp className="text-gold group-hover:scale-110 transition" />
                  WhatsApp Destek
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@beyondbaku.az"
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaEnvelope className="text-gold group-hover:scale-110 transition" />
                  info@beyondbaku.az
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-dark-blue/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              © {new Date().getFullYear()} BeyondBaku. Tüm hakları saklıdır.
            </p>

            <div className="flex gap-6">
              {['Gizlilik Politikası', 'Kullanım Şartları', 'Çerez Politikası'].map((item) => (
                <Link 
                  key={item} 
                  to={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                  className="text-gray-400 hover:text-gold transition"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400">Güvenli Ödeme:</span>
              <div className="flex gap-2">
                {['VISA', 'MC', 'PayPal'].map((payment) => (
                  <div 
                    key={payment} 
                    className="px-3 py-1.5 bg-white rounded-md text-xs font-bold text-dark-blue shadow"
                  >
                    {payment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/994501234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all z-50 group"
      >
        <FaWhatsapp size={32} className="text-white group-hover:scale-110 transition" />
      </a>
    </footer>
  )
}
