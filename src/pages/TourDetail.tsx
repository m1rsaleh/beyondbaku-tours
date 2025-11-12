import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCalendar, 
  FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaWhatsapp,
  FaPhone, FaEnvelope, FaShareAlt
} from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import type { Tour } from '../types'

export default function TourDetail() {
  const { id } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'includes' | 'reviews'>('overview')
  const [bookingData, setBookingData] = useState({
    date: '',
    guests: 1,
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (id) fetchTour()
  }, [id])

  async function fetchTour() {
    setLoading(true)
    const { data } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setTour(data)
    setLoading(false)
  }

  const nextImage = () => {
    if (tour) {
      setCurrentImageIndex((prev) => (prev + 1) % tour.images.length)
    }
  }

  const prevImage = () => {
    if (tour) {
      setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    // Booking logic here
    alert('Rezervasyon talebi alındı! Kısa süre içinde sizinle iletişime geçeceğiz.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Tur Bulunamadı</h2>
          <Link to="/tours" className="text-gold hover:underline">Turlar sayfasına dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Image Gallery */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={tour.images[currentImageIndex]}
            alt={tour.title_tr}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"
        >
          <FaChevronLeft className="text-white text-xl" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"
        >
          <FaChevronRight className="text-white text-xl" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {tour.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentImageIndex ? 'bg-gold w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Tour Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 z-10">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <FaMapMarkerAlt className="text-gold" />
                  <span className="text-white font-medium">{tour.location}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                  <FaStar className="text-gold" />
                  <span className="text-white font-bold">4.9</span>
                  <span className="text-white/70 text-sm">(125)</span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
                {tour.title_tr}
              </h1>
              <div className="flex flex-wrap gap-4 sm:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <FaClock className="text-gold" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-gold" />
                  <span>Max {tour.max_group} kişi</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-gold" />
                  <span>Her gün</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Tour Details */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg mb-8">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Genel Bakış' },
                    { id: 'itinerary', label: 'Program' },
                    { id: 'includes', label: 'Dahil/Hariç' },
                    { id: 'reviews', label: 'Yorumlar' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-gold border-b-2 border-gold'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6 sm:p-8">
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-2xl font-serif font-bold text-primary mb-4">Tur Hakkında</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {tour.description_tr}
                      </p>

                      <h4 className="text-xl font-bold text-primary mb-4">Öne Çıkan Özellikler</h4>
                      <ul className="space-y-3">
                        {tour.highlights?.map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <FaCheck className="text-gold mt-1 flex-shrink-0" />
                            <span className="text-gray-600">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'itinerary' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-2xl font-serif font-bold text-primary mb-6">Günlük Program</h3>
                      <div className="space-y-6">
                        {tour.itinerary?.map((day: any, index: number) => (
                          <div key={index} className="relative pl-8 border-l-2 border-gold pb-6 last:pb-0">
                            <div className="absolute -left-3 top-0 w-6 h-6 bg-gold rounded-full border-4 border-white"></div>
                            <h4 className="text-lg font-bold text-primary mb-2">Gün {index + 1}: {day.title}</h4>
                            <p className="text-gray-600">{day.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'includes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            Dahil Olan
                          </h3>
                          <ul className="space-y-2">
                            {tour.included?.map((item: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-gray-600">
                                <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            Dahil Olmayan
                          </h3>
                          <ul className="space-y-2">
                            {tour.excluded?.map((item: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-gray-600">
                                <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-center mb-8">
                        <div className="text-5xl font-bold text-primary mb-2">4.9</div>
                        <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-gold text-xl" />
                          ))}
                        </div>
                        <p className="text-gray-600">125 değerlendirme</p>
                      </div>

                      <div className="space-y-6">
                        {/* Sample reviews */}
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-start gap-4 mb-3">
                              <img
                                src={`https://i.pravatar.cc/60?img=${i}`}
                                alt="User"
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-primary">Müşteri {i}</h4>
                                  <span className="text-sm text-gray-500">2 gün önce</span>
                                </div>
                                <div className="flex gap-1 mb-2">
                                  {[...Array(5)].map((_, j) => (
                                    <FaStar key={j} className="text-gold text-sm" />
                                  ))}
                                </div>
                                <p className="text-gray-600">
                                  Harika bir deneyimdi! Rehberimiz çok bilgiliydi ve her şey kusursuzdu.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Sticky Booking Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Price Header */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-4xl font-bold">${tour.price}</span>
                        <span className="text-lg ml-2">/ kişi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-gold" />
                        <span className="font-bold">4.9</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/80">Tüm vergiler dahil</p>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleBooking} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tarih Seçin
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Misafir Sayısı
                      </label>
                      <select
                        required
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      >
                        {[...Array(tour.max_group)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'Kişi' : 'Kişi'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        İsim
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        placeholder="Adınız Soyadınız"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        placeholder="+90 5XX XXX XX XX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>

                    {/* Total Price */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">${tour.price} x {bookingData.guests} kişi</span>
                        <span className="font-semibold">${tour.price * bookingData.guests}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hizmet bedeli</span>
                        <span className="font-semibold">$0</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-bold text-primary">Toplam</span>
                        <span className="font-bold text-2xl text-primary">
                          ${tour.price * bookingData.guests}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition text-lg"
                    >
                      Rezervasyon Yap
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Rezervasyon sonrası iptal ücretsizdir
                    </p>
                  </form>

                  {/* Contact Options */}
                  <div className="border-t border-gray-200 p-6 space-y-3">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Yardıma mı ihtiyacınız var?
                    </p>
                    <a
                      href="https://wa.me/994501234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
                    >
                      <FaWhatsapp className="text-green-500 text-xl" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
                        <p className="text-xs text-gray-600">Anında cevap</p>
                      </div>
                    </a>
                    <a
                      href="tel:+994501234567"
                      className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <FaPhone className="text-blue-500 text-xl" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Telefon</p>
                        <p className="text-xs text-gray-600">+994 50 123 45 67</p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@beyondbaku.com"
                      className="flex items-center gap-3 p-3 bg-gold/10 hover:bg-gold/20 rounded-lg transition"
                    >
                      <FaEnvelope className="text-gold text-xl" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Email</p>
                        <p className="text-xs text-gray-600">info@beyondbaku.com</p>
                      </div>
                    </a>
                  </div>

                  {/* Share */}
                  <div className="border-t border-gray-200 p-6">
                    <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-lg hover:border-gold hover:text-gold transition font-semibold">
                      <FaShareAlt />
                      Paylaş
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Tours */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-serif font-bold text-primary mb-8 text-center">
            Benzer <span className="text-gold">Turlar</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* You can fetch and display similar tours here */}
            <div className="text-center text-gray-500 py-12 col-span-full">
              Benzer turlar yükleniyor...
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
