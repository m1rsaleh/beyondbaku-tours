import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFacebook, FaInstagram, FaTwitter, FaChevronDown } from 'react-icons/fa'

// FAQ Accordion Component - DOSYANIN EN ÜSTÜNE EKLE
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const faqs = [
    {
      question: 'Rezervasyon nasıl yapılır?',
      answer: 'Websitemizden istediğiniz turu seçip rezervasyon formunu doldurabilir, WhatsApp üzerinden bizimle iletişime geçebilir veya direkt telefon ile arayabilirsiniz. Rezervasyon onayı 24 saat içinde tarafınıza iletilir.'
    },
    {
      question: 'İptal politikası nedir?',
      answer: 'Tur başlangıcından 48 saat öncesine kadar ücretsiz iptal hakkınız bulunmaktadır. 48 saatten sonraki iptallerde %50 kesinti uygulanır. Tur günü yapılan iptallerde ücret iadesi yapılmaz.'
    },
    {
      question: 'Ödeme seçenekleri nelerdir?',
      answer: 'Kredi kartı, banka transferi, havale veya nakit ödeme kabul edilmektedir. Taksitli ödeme seçenekleri için müşteri hizmetlerimizle iletişime geçebilirsiniz.'
    },
    {
      question: 'Grup indirimi var mı?',
      answer: 'Evet! 6 kişi ve üzeri grup rezervasyonlarında %15, 10 kişi ve üzeri rezervasyonlarda %20 indirim uygulanmaktadır. Özel grup turları için özel fiyat teklifi alabilirsiniz.'
    }
  ]

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
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
              Get In Touch
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6">
              <span className="text-gold">İletişime</span> Geçin
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
              Size yardımcı olmak için buradayız
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: FaPhone,
                title: 'Telefon',
                info: '+994 50 123 45 67',
                link: 'tel:+994501234567'
              },
              {
                icon: FaWhatsapp,
                title: 'WhatsApp',
                info: 'Anında Mesaj',
                link: 'https://wa.me/994501234567'
              },
              {
                icon: FaEnvelope,
                title: 'Email',
                info: 'info@beyondbaku.com',
                link: 'mailto:info@beyondbaku.com'
              },
              {
                icon: FaClock,
                title: 'Çalışma Saatleri',
                info: '09:00 - 18:00',
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
            {/* Contact Form */}
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
                      placeholder="+90 5XX XXX XX XX"
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
                  className="w-full py-4 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition text-lg"
                >
                  Mesaj Gönder
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
              {/* Google Map */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194472.8861494!2d49.69315555!3d40.3953868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1234567890"
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
                        Nizami Street 123, Baku, Azerbaijan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Bizi Takip Edin
                </h3>
                <div className="flex gap-4">
                  {[
                    { icon: FaFacebook, link: 'https://facebook.com', color: 'hover:text-blue-600' },
                    { icon: FaInstagram, link: 'https://instagram.com', color: 'hover:text-pink-600' },
                    { icon: FaTwitter, link: 'https://twitter.com', color: 'hover:text-blue-400' },
                    { icon: FaWhatsapp, link: 'https://wa.me/994501234567', color: 'hover:text-green-500' }
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

              {/* FAQ Accordion */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">
                  Sıkça Sorulan Sorular
                </h3>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
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
