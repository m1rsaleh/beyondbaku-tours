import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFacebook, FaInstagram, FaTwitter, FaChevronDown } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

interface ContactContent {
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  working_hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  map_lat: string;
  map_lng: string;
  map_embed_url: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-primary pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <FaChevronDown className="text-gold" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 sm:p-5 pt-0 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Contact() {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadContactContent();
  }, []);

  async function loadContactContent() {
    try {
      const [contentData, faqsData] = await Promise.all([
        supabase.from('contact_page_content').select('*').single(),
        supabase.from('contact_faqs').select('*').order('order_index')
      ]);

      if (contentData.data) setContent(contentData.data);
      if (faqsData.data) setFaqs(faqsData.data);
    } catch (error) {
      console.error('Contact content yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'new'
        }]);

      if (error) throw error;

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section - DİNAMİK */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={content.hero_image}
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/90"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
              {content.hero_badge}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6">
              <span className="text-gold">{content.hero_title.split(' ')[0]}</span> {content.hero_title.split(' ').slice(1).join(' ')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
              {content.hero_subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards - DİNAMİK */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: FaPhone,
                title: 'Telefon',
                info: content.phone,
                link: `tel:${content.phone.replace(/\s/g, '')}`
              },
              {
                icon: FaWhatsapp,
                title: 'WhatsApp',
                info: 'Anında Mesaj',
                link: content.whatsapp
              },
              {
                icon: FaEnvelope,
                title: 'Email',
                info: content.email,
                link: `mailto:${content.email}`
              },
              {
                icon: FaClock,
                title: 'Çalışma Saatleri',
                info: content.working_hours,
                link: null
              }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link || undefined}
                target={item.link?.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition ${item.link ? 'cursor-pointer' : ''}`}
              >
                <div className="text-gold group-hover:text-primary transition-colors mb-4">
                  <item.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{item.info}</p>
              </motion.a>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form - DİNAMİK */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10"
            >
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-6">
                Mesaj Gönderin
              </h2>
              <p className="text-gray-600 mb-8">
                Size en kısa sürede geri dönüş yapacağız
              </p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                >
                  ✓ Mesajınız başarıyla gönderildi!
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İsim Soyisim
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Adınız Soyadınız"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="+994 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konu
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="">Konu seçin</option>
                    <option value="booking">Rezervasyon</option>
                    <option value="info">Genel Bilgi</option>
                    <option value="custom">Özel Tur Talebi</option>
                    <option value="feedback">Geri Bildirim</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition text-lg disabled:opacity-50"
                >
                  {submitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </motion.div>

                        {/* Map & More */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Google Map - DİNAMİK */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <iframe
                  src={content.map_embed_url || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194472.8861494!2d${content.map_lng}!3d${content.map_lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1234567890`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full"
                ></iframe>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gold text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-primary mb-1">Ofis Adresimiz</h3>
                      <p className="text-gray-600 text-sm">
                        {content.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media - DİNAMİK */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Bizi Takip Edin
                </h3>
                <div className="flex gap-4">
                  {[
                    { icon: FaFacebook, link: content.facebook, color: 'hover:text-blue-600' },
                    { icon: FaInstagram, link: content.instagram, color: 'hover:text-pink-600' },
                    { icon: FaTwitter, link: content.twitter, color: 'hover:text-blue-400' },
                    { icon: FaWhatsapp, link: content.whatsapp, color: 'hover:text-green-500' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 ${social.color} transition`}
                    >
                      <social.icon className="text-2xl" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion - DİNAMİK */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Sıkça Sorulan Sorular
                </h3>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem key={faq.id} question={faq.question} answer={faq.answer} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

