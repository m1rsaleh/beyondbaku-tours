import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface FooterSettings {
  company_name: string;
  company_tagline: string;
  company_description: string;
  logo_letter: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  copyright_text: string;
  whatsapp_float_enabled: boolean;
  whatsapp_float_number: string;
  newsletter_button_label: string;
}

interface QuickLink {
  id: string;
  name: string;
  path: string;
  order_index: number;
}
interface Destination {
  id: string;
  name: string;
  order_index: number;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<null | string>(null);
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    loadFooterData();
  }, []);

  async function loadFooterData() {
    try {
      const [settingsData, linksData, destsData] = await Promise.all([
        supabase.from('footer_settings').select('*').single(),
        supabase.from('footer_quick_links').select('*').order('order_index'),
        supabase.from('footer_destinations').select('*').order('order_index')
      ]);
      if (settingsData.data) setSettings(settingsData.data);
      if (linksData.data) setQuickLinks(linksData.data);
      if (destsData.data) setDestinations(destsData.data);
    } catch (error) {
      console.error('Footer veri yükleme hatası:', error);
    }
  }

  // Newsletter kayıt ve feedback sistemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus(null);
    if (!email) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) {
      setNewsletterStatus('Bir hata oluştu! Lütfen tekrar deneyin.');
    } else {
      setNewsletterStatus('Teşekkürler! E-bültenimize kaydoldunuz.');
      setEmail('');
    }
  };

  if (!settings) return null;
  return (
    <footer className="bg-gradient-to-br from-primary via-dark-blue to-primary text-white">
       {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-dark-blue py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gold mb-3 sm:mb-4">
              {settings.newsletter_title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-200 px-2">
              {settings.newsletter_subtitle}
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="flex-1 min-w-0 px-4 py-3 rounded-full text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
  type="submit"
  className="w-full sm:w-auto px-6 py-3 bg-gold hover:bg-gold/90 text-white font-bold rounded-full transition whitespace-nowrap text-sm sm:text-base flex-shrink-0"
>
  {settings.newsletter_button_label}
</button>

              </div>
            </form>
            {newsletterStatus &&
              <div className="mt-4 text-center text-gold text-sm">{newsletterStatus}</div>
            }
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
                <span className="text-dark-blue font-bold text-3xl">{settings.logo_letter}</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-bold block">{settings.company_name}</span>
                <span className="text-xs text-gold">{settings.company_tagline}</span>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {settings.company_description}
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, url: settings.facebook_url, label: 'Facebook' },
                { icon: FaInstagram, url: settings.instagram_url, label: 'Instagram' },
                { icon: FaTiktok, url: settings.tiktok_url, label: 'TikTok' },
                { icon: FaWhatsapp, url: settings.whatsapp_url, label: 'WhatsApp' },
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
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-gold transition hover:translate-x-2 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {link.name}
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
              {destinations.map((dest) => (
                <li key={dest.id}>
                  <Link 
                    to={`/tours?dest=${dest.name}`} 
                    className="text-gray-300 hover:text-gold transition hover:translate-x-2 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {dest.name} Turları
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
                <span className="text-gray-300">{settings.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaPhone className="text-gold group-hover:rotate-12 transition" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={settings.whatsapp}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaWhatsapp className="text-gold group-hover:scale-110 transition" />
                  WhatsApp Destek
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition group"
                >
                  <FaEnvelope className="text-gold group-hover:scale-110 transition" />
                  {settings.email}
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
              © {new Date().getFullYear()} {settings.copyright_text}
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
      {settings.whatsapp_float_enabled && (
        <a
          href={settings.whatsapp_float_number}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all z-50 group"
        >
          <FaWhatsapp size={32} className="text-white group-hover:scale-110 transition" />
        </a>
      )}
    </footer>
  );
}
