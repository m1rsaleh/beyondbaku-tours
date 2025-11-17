import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaStar, FaArrowRight, FaClock, FaUsers, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'
import { supabase } from '../lib/supabase'
import { pageContentService } from '../services/pageContentService'
import type { Tour, HomePageContent } from '../types'

interface Testimonial {
  id: string;
  tour_id?: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  location: string;
  is_approved: boolean;
  created_at: string;
}

export default function Home() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([])
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  

  useEffect(() => {
  loadTestimonials();
  }, []);

   const avgRating = testimonials.length > 0
  ? (testimonials.reduce((sum: number, t: any) => sum + t.rating, 0) / testimonials.length).toFixed(1)
  : '0.0';
 
   async function loadTestimonials() {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)      // ✅ Onaylı olanlar
    .eq('is_featured', true)       // ✅ Ana sayfaya eklenmiş olanlar
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (data) {
    console.log('✅ Featured Testimonials:', data);
    setTestimonials(data);
  }
}



  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
  setLoading(true);
  const [toursData, pageData] = await Promise.all([
    supabase
      .from('tours')
      .select('*')  // ✅ Tüm alanları çek
      .eq('is_active', true)
      .limit(6),
    pageContentService.getPageContent<HomePageContent>('home')
  ]);
  
  if (toursData.data) {
    
    setFeaturedTours(toursData.data);
  }
  if (pageData) setContent(pageData.content);
  
  setLoading(false);
}


  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream">
            {/* HERO SECTION */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={content.hero.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </motion.div>

        <div className="relative container mx-auto px-4 sm:px-6 z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                <span className="text-white text-xs sm:text-sm font-medium">{content.hero.premiumBadge}</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                <TypeAnimation
                  sequence={[content.hero.heading1, 3000, content.hero.heading2, 3000, content.hero.heading3, 3000]}
                  wrapper="span"
                  repeat={Infinity}
                  className="text-gold"
                />
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 font-light">{content.hero.subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link to="/tours" className="group px-6 sm:px-8 py-3 sm:py-4 bg-gold text-white font-semibold rounded-full hover:bg-gold/90 transition flex items-center justify-center gap-2">
                  {content.hero.ctaButton1}
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition">
                  {content.hero.ctaButton2}
                </button>
              </div>

              <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
                <div className="flex gap-4 sm:gap-6">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{content.hero.statsCustomers}</div>
                    <div className="text-gray-300 text-xs sm:text-sm">{content.hero.statsCustomersLabel}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">{content.hero.statsTours}</div>
                    <div className="text-gray-300 text-xs sm:text-sm">{content.hero.statsToursLabel}</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-1">
                      {content.hero.statsRating} <FaStar className="text-gold text-lg sm:text-xl" />
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">{content.hero.statsRatingLabel}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reservation Widget (Önceki kodun aynen) */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute bottom-20 right-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 hidden lg:block z-20">
          <h3 className="text-xl font-serif font-bold text-primary mb-4">Hızlı Rezervasyon</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Destinasyon</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                <option>Bakü</option>
                <option>Quba</option>
                <option>Şəki</option>
                <option>Qəbələ</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tarih</label>
              <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Kişi Sayısı</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                <option>1 Kişi</option>
                <option>2 Kişi</option>
                <option>3-5 Kişi</option>
                <option>6+ Kişi</option>
              </select>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 text-white font-semibold rounded-lg hover:shadow-lg transition">Turları Ara</button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">⚡ Anında onay • 💳 Güvenli ödeme</p>
        </motion.div>
      </section>

            {/* QUICK DESTINATIONS */}
      <section className="relative -mt-16 z-30 mb-20">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }} className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">{content.destinations.sectionTitle}</h2>
            <p className="text-gray-600 text-center mb-6">{content.destinations.sectionSubtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((num) => {
                const dest = content.destinations[`destination${num}Name` as keyof typeof content.destinations] as string;
                const img = content.destinations[`destination${num}Image` as keyof typeof content.destinations] as string;
                return (
                  <button key={num} className="group relative h-28 sm:h-32 rounded-xl overflow-hidden hover:shadow-lg transition">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={dest} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4">
                      <span className="text-white font-bold text-base sm:text-lg">{dest}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

     {/* FEATURED TOURS - DİNAMİK */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-cream to-white"></div>
  
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      animate={{ x: [0, 50, 0], y: [0, -30, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 20, repeat: Infinity }}
      className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-gold/5 to-primary/5 rounded-full blur-3xl"
    ></motion.div>
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 1 }}
        className="inline-block mb-6 sm:mb-8"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto">
          <motion.path
            d="M30 10 L35 25 L50 27 L40 37 L43 52 L30 43 L17 52 L20 37 L10 27 L25 25 Z"
            stroke="url(#tourGrad)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="tourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#1E3A5F" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* ✅ DİNAMİK - Curated Collection Badge */}
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
        {content.featuredTours.badgeText || 'Curated Collection'}
      </p>
      
      {/* ✅ DİNAMİK - Section Title */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary mb-4 sm:mb-6">
        {content.featuredTours.sectionTitle}
      </h2>
      
      {/* ✅ DİNAMİK - Section Subtitle */}
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed px-4">
        {content.featuredTours.sectionSubtitle}
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      {featuredTours.map((tour, index) => (
        <motion.div
          key={tour.id}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
        >
          <Link to={`/tour/${tour.id}`} className="group block">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={
                    Array.isArray(tour.images) && tour.images.length > 0
                      ? tour.images[0]
                      : typeof tour.images === 'string' && tour.images
                      ? tour.images
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
                  }
                  alt={tour.title_tr}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold blur-lg opacity-50 rounded-full"></div>
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 sm:py-2.5 border border-gold/20">
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl font-bold text-primary">${tour.price}</span>
                        <p className="text-[10px] sm:text-xs text-gray-500">/ kişi</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <FaMapMarkerAlt className="text-gold text-sm sm:text-base" />
                  <span className="text-white font-medium text-sm sm:text-base">{tour.location}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="inline-block mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gold font-semibold">
                    Premium Experience
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3 sm:mb-4 group-hover:text-gold transition leading-tight">
                  {tour.title_tr}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 leading-relaxed font-light">
                  {tour.description_tr}
                </p>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <FaClock className="text-gold" size={14} />
                      <span className="font-medium">{tour.duration}</span>
                    </div>
                    <div className="w-px h-3 sm:h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                      <FaUsers className="text-gold" size={14} />
                      <span className="font-medium">Max {tour.max_group}</span>
                    </div>
                  </div>
                  
                  {/* ✅ DİNAMİK RATING - Review yoksa 5.0, varsa gerçek rating */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <FaStar className="text-gold" size={16} />
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {tour.rating && tour.review_count && tour.review_count > 0 
                        ? tour.rating.toFixed(1) 
                        : '5.0'}
                    </span>
                  </div>
                </div>

                {/* ✅ DİNAMİK - Detay Butonu */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl group-hover:from-gold group-hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl text-sm sm:text-base"
                >
                  <span>{content.featuredTours.detailButtonText || 'Detayları İncele'}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-yellow-500 to-gold"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      {/* ✅ DİNAMİK - View All Button */}
      <Link
        to="/tours"
        className="group inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-lg"
      >
        <span>{content.featuredTours.viewAllButton}</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  </div>
      </section>

      {/* PREMIUM EXPERIENCE - DİNAMİK */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-white via-cream to-white relative overflow-hidden">
  <div className="absolute inset-0">
    <motion.div
      animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 20, repeat: Infinity }}
      className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-gold/10 to-primary/10 rounded-full blur-3xl"
    ></motion.div>
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      {/* ✅ DİNAMİK - Excellence Badge */}
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
        {content.premiumExperience.badgeText || 'Excellence Defined'}
      </p>
      
      {/* ✅ DİNAMİK - Section Title */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary mb-4 sm:mb-6">
        {content.premiumExperience.sectionTitle}
      </h2>
      
      {/* ✅ DİNAMİK - Section Subtitle */}
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light px-4">
        {content.premiumExperience.sectionSubtitle}
      </p>
    </motion.div>

    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative order-2 lg:order-1"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* ✅ DİNAMİK SLIDER - Admin panelden eklenebilir */}
          <motion.div
            animate={{ x: ['0%', '-200%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="flex"
          >
            {(content.premiumExperience.sliderImages || [
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=500&fit=crop',
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=500&fit=crop',
              'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=700&h=500&fit=crop',
              'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&h=500&fit=crop'
            ]).map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full">
                <img
                  src={img}
                  alt={`Luxury Travel ${i + 1}`}
                  className="w-full h-80 sm:h-96 lg:h-[500px] object-cover"
                />
              </div>
            ))}
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5"
          >
            {/* ✅ DİNAMİK - Slider Badge */}
            <p className="text-white text-xs sm:text-sm tracking-wider uppercase mb-1">
              {content.premiumExperience.sliderBadge || 'Premium Collection'}
            </p>
            <p className="text-white/70 text-[10px] sm:text-xs font-light">
              {content.premiumExperience.sliderSubtext || 'Özenle seçilmiş destinasyonlar'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 sm:gap-6 order-1 lg:order-2"
      >
        {/* ✅ DİNAMİK FEATURES - 6 adet */}
        {[
          {
            title: content.premiumExperience.feature1Title || 'Kişiye Özel Turlar',
            desc: content.premiumExperience.feature1Desc || 'İlgi alanlarınıza göre tasarlanmış rotalar',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )
          },
          {
            title: content.premiumExperience.feature2Title || 'Benzersiz Deneyimler',
            desc: content.premiumExperience.feature2Desc || 'Turistik olmayan özel rotalar',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )
          },
          {
            title: content.premiumExperience.feature3Title || 'Online Rezervasyon',
            desc: content.premiumExperience.feature3Desc || 'Anında onay, kolay iptal',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          {
            title: content.premiumExperience.feature4Title || 'Premium Araçlar',
            desc: content.premiumExperience.feature4Desc || 'VIP transfer ve lüks konaklama',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            )
          },
          {
            title: content.premiumExperience.feature5Title || 'Ücretsiz Danışmanlık',
            desc: content.premiumExperience.feature5Desc || 'Uzman ekibimizle planlayın',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            )
          },
          {
            title: content.premiumExperience.feature6Title || 'Fırsat İndirimleri',
            desc: content.premiumExperience.feature6Desc || 'Düzenli kampanyalar ve avantajlar',
            icon: (
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
          >
            <div className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-cream rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-primary group-hover:text-gold transition-colors mb-4 sm:mb-6"
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-primary mb-2 sm:mb-3 group-hover:text-gold transition">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
      </section>


      {/* EXPERT GUIDES - DİNAMİK */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      {/* ✅ DİNAMİK - Meet The Team Badge */}
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
        {content.expertGuides.badgeText || 'Meet The Team'}
      </p>
      
      {/* ✅ DİNAMİK - Section Title */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary mb-4 sm:mb-6">
        {content.expertGuides.sectionTitle}
      </h2>
      
      {/* ✅ DİNAMİK - Section Subtitle */}
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light px-4">
        {content.expertGuides.sectionSubtitle}
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
      {/* ✅ DİNAMİK GUIDE CARDS - 3 adet */}
      {[
        {
          name: content.expertGuides.guide1Name || 'Aytən Məmmədova',
          role: content.expertGuides.guide1Role || 'Baş Rehber',
          languages: content.expertGuides.guide1Languages || 'TR • EN • RU • AZ',
          image: content.expertGuides.guide1Image || 'https://i.pravatar.cc/400?img=5',
          experience: content.expertGuides.guide1Experience || '12 Yıl'
        },
        {
          name: content.expertGuides.guide2Name || 'Elvin Quliyev',
          role: content.expertGuides.guide2Role || 'Kültür Uzmanı',
          languages: content.expertGuides.guide2Languages || 'TR • EN • AZ',
          image: content.expertGuides.guide2Image || 'https://i.pravatar.cc/400?img=12',
          experience: content.expertGuides.guide2Experience || '10 Yıl'
        },
        {
          name: content.expertGuides.guide3Name || 'Nigar Həsənova',
          role: content.expertGuides.guide3Role || 'Tarih Rehberi',
          languages: content.expertGuides.guide3Languages || 'TR • RU • AZ',
          image: content.expertGuides.guide3Image || 'https://i.pravatar.cc/400?img=9',
          experience: content.expertGuides.guide3Experience || '8 Yıl'
        }
      ].map((guide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ y: -10 }}
          className="group"
        >
          <div className="relative bg-cream rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-gold text-dark-blue px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                {guide.experience}
              </div>
            </div>

            <div className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-2 group-hover:text-gold transition">
                {guide.name}
              </h3>
              <p className="text-gold font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{guide.role}</p>
              <p className="text-xs sm:text-sm text-gray-500 tracking-wider">{guide.languages}</p>
              
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mt-4 sm:mt-6"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.5 }}
              ></motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
      </section>

      {/* TESTIMONIALS - TAM DİNAMİK */}
<section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-cream via-white to-cream relative overflow-hidden">
  <div className="absolute inset-0">
    <motion.div
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 25, repeat: Infinity }}
      className="absolute top-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-gold/10 to-primary/10 rounded-full blur-3xl"
    ></motion.div>
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
        {content.testimonials?.badgeText || 'Testimonials'}
      </p>
      
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary mb-4 sm:mb-6">
        {content.testimonials?.sectionTitle || 'Müşterilerimiz Ne Diyor?'}
      </h2>
      
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light px-4">
        {content.testimonials?.sectionSubtitle || 'Binlerce mutlu gezginden gelen gerçek değerlendirmeler'}
      </p>
    </motion.div>

    <div className="relative max-w-6xl mx-auto">
      {testimonials && testimonials.length > 0 ? (
        <>
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-66.66%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 sm:gap-8"
            >
              {testimonials.map((testimonial: any, index: number) => {
                const initials = testimonial.name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || '??';

                return (
                  <div key={testimonial.id} className="flex-shrink-0 w-80 sm:w-96">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all h-full border border-gray-100"
                    >
                      <div className="flex gap-1 mb-4 sm:mb-6">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 italic text-base sm:text-lg">
                        "{testimonial.comment}"
                      </p>

                      <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm sm:text-base">{initials}</span>
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm sm:text-base">{testimonial.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {testimonial.location || 'Türkiye'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-lg">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* ✅ DİNAMİK RATING */}
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {testimonials.length > 0
                  ? (testimonials.reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
                  : '0.0'}
              </span>
              <span className="text-gray-500 text-sm sm:text-base">/ 5</span>
              <span className="text-gray-400 ml-2">|</span>
              <span className="text-gray-600 font-semibold text-sm sm:text-base">
                {testimonials.length}+ Değerlendirme
              </span>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500 text-lg">Henüz öne çıkan yorum yok.</p>
          <p className="text-gray-400 text-sm mt-2">Admin panelden yorumları ana sayfaya ekleyebilirsiniz.</p>
        </div>
      )}
    </div>
  </div>
</section>


      {/* Premium CTA - TAM DİNAMİK */}
<section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
  <div className="absolute inset-0">
    <motion.img
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      src={content.cta?.backgroundImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop'}
      alt="Luxury Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/98 via-dark-blue/95 to-primary/98"></div>
  </div>

  <div className="absolute inset-0">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          x: [0, Math.random() * 50 - 25, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      >
        <div className="w-2 h-2 bg-gold rounded-full blur-sm"></div>
      </motion.div>
    ))}
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto text-center"
    >
      {/* ✅ DİNAMİK - Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", duration: 1 }}
        className="inline-block mb-6 sm:mb-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full blur-lg opacity-50"
          ></motion.div>
          
          <div className="relative bg-white/10 backdrop-blur-md border-2 border-gold/50 rounded-full px-6 sm:px-8 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 sm:w-3 sm:h-3 bg-gold rounded-full"
            ></motion.span>
            <span className="text-white font-bold text-sm sm:text-lg">
              {content.cta?.badgeText || '🎁 İlk Rezervasyonunuzda %25 İndirim'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ✅ DİNAMİK - Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 leading-tight"
      >
        <span className="text-white">{content.cta?.title1 || 'Hayalleriniz'}</span>
        <br />
        <motion.span
          animate={{
            backgroundPosition: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="bg-gradient-to-r from-gold via-yellow-300 to-gold bg-[length:200%_auto] bg-clip-text text-transparent"
        >
          {content.cta?.title2 || 'Gerçek Olsun'}
        </motion.span>
      </motion.h2>

      {/* ✅ DİNAMİK - Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 sm:mb-12 leading-relaxed px-4"
      >
        {content.cta?.subtitle || 'Premium seyahat deneyimi, özel tasarım rotalar, unutulmaz anılar. Hepsi sizin için.'}
      </motion.p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/tours"
            className="group relative px-10 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-gold via-yellow-500 to-gold text-dark-blue font-bold text-base sm:text-xl rounded-full overflow-hidden shadow-2xl w-full sm:w-auto block"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-gold to-yellow-500"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            ></motion.div>
            
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              {content.cta?.button1Text || 'Hayalini Planla'}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href={content.cta?.whatsappLink || 'https://wa.me/994501234567'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 sm:px-12 py-5 sm:py-6 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold text-base sm:text-xl rounded-full border-2 border-white/30 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-2xl w-full sm:w-auto"
          >
            <FaWhatsapp size={24} className="sm:w-7 sm:h-7" />
            {content.cta?.button2Text || 'WhatsApp ile Danış'}
          </a>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-6 sm:gap-10 text-white/90 text-sm sm:text-lg"
      >
        {[
          { icon: '⚡', text: content.cta?.feature1 || 'Anında Onay' },
          { icon: '🔒', text: content.cta?.feature2 || 'Güvenli Ödeme' },
          { icon: '🎯', text: content.cta?.feature3 || 'Ücretsiz İptal' },
          { icon: '💬', text: content.cta?.feature4 || '7/24 Destek' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 + i * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="text-xl sm:text-2xl"
            >
              {item.icon}
            </motion.span>
            {item.text}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </div>
</section>

    </div>
  )
}
