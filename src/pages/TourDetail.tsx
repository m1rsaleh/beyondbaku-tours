import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaCalendar,
  FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaWhatsapp,
  FaPhone, FaEnvelope
} from 'react-icons/fa';
import { tourService } from '../services/tourService';
import { reviewService } from '../services/reviewService';
import { bookingService } from '../services/bookingService';
import { useToast } from '../contexts/ToastContext';
import type { Tour, Review } from '../types';
import ReviewCard from '../components/ReviewCard';
import { supabase } from '../lib/supabase';

export default function TourDetail() {
  const { id } = useParams();
  const { showToast } = useToast();
  
  // Tour & Reviews State
  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'includes' | 'reviews'>('overview');
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    date: '',
    guests: 1,
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    location: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);

  // Load tour & reviews
  useEffect(() => {
    if (id) {
      fetchAll();
    }
  }, [id]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [tourData, reviewData] = await Promise.all([
        tourService.getTourById(id!),
        reviewService.getReviewsByTourId(id!)
      ]);
      
      if (tourData) {
        setTour(tourData);
      }
      
      setReviews(reviewData || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setTour(null);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  // 🖼️ GÖRSEL GALERİSİ FONKSİYONLARI
  const nextImage = () => {
    if (tour?.images && Array.isArray(tour.images) && tour.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === tour.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (tour?.images && Array.isArray(tour.images) && tour.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? tour.images!.length - 1 : prev - 1
      );
    }
  };

  // Handle Booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.name || !bookingData.email || !bookingData.phone) {
      showToast('Lütfen tüm alanları doldurun!', 'error');
      return;
    }

    if (bookingData.guests < 1) {
      showToast('En az 1 kişi seçmelisiniz!', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const booking = await bookingService.createBooking({
        tour_id: tour!.id,
        customer_name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        tour_date: bookingData.date,
        guests: bookingData.guests,
        total_price: Number(tour!.price) * bookingData.guests,
        status: 'pending',
        special_requests: ''
      });

      if (booking) {
        showToast(
          'Rezervasyon talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.',
          'success'
        );
        
        // Form reset
        setBookingData({
          date: '',
          guests: 1,
          name: '',
          email: '',
          phone: ''
        });
      }
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      showToast(
        'Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle Review Submit - FIXED!
  // ✅ Handle Review Submit - LOCATION İLE
const handleReviewSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!reviewForm.name || !reviewForm.email || !reviewForm.comment || !reviewForm.location) {
    showToast('Lütfen tüm alanları doldurun!', 'error');
    return;
  }

  if (selectedRating < 1 || selectedRating > 5) {
    showToast('Lütfen 1-5 arası puan verin!', 'error');
    return;
  }

  setSubmittingReview(true);

  try {
    console.log('🔵 Gönderilen data:', {
      tour_id: tour?.id,
      name: reviewForm.name,
      email: reviewForm.email,
      rating: selectedRating,
      comment: reviewForm.comment,
      location: reviewForm.location,
      is_approved: false,
      is_featured: false
    });

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        tour_id: tour?.id || null,  // ✅ optional chaining
        name: reviewForm.name,
        email: reviewForm.email,
        rating: selectedRating,
        comment: reviewForm.comment,
        location: reviewForm.location,
        is_approved: false,
        is_featured: false
      }])
      .select();  // ✅ EKLE - Eklenen kaydı döndür

    console.log('✅ Supabase response:', { data, error });

    if (error) {
      console.error('❌ Insert hatası:', error);
      throw error;
    }

    if (data) {
      console.log('✅ Yorum eklendi:', data);
      showToast(
        'Yorumunuz başarıyla gönderildi! Admin onayından sonra yayınlanacaktır.',
        'success'
      );
      
      // Form reset
      setReviewForm({
        name: '',
        email: '',
        rating: 5,
        comment: '',
        location: ''
      });
      setSelectedRating(5);
    }
  } catch (error: any) {
    console.error('❌ Catch bloğu:', error);
    showToast(
      `Yorum gönderilemedi: ${error.message || 'Bilinmeyen hata'}`,
      'error'
    );
  } finally {
    setSubmittingReview(false);
  }
};



  // Calculate average rating
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Hangi görseli göstereceğimizi belirle
  const getCurrentImage = () => {
    if (tour?.images && Array.isArray(tour.images) && tour.images.length > 0) {
      return tour.images[currentImageIndex];
    }
    return tour?.image || 'https://via.placeholder.com/1600x600';
  };

  // Galeri butonlarını göster mi?
  const hasMultipleImages = tour?.images && Array.isArray(tour.images) && tour.images.length > 1;

  // Loading state
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

  // Not found state
  if (!tour) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Tur Bulunamadı</h2>
          <Link to="/tours" className="text-gold hover:underline">
            Turlar sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* IMAGE GALLERY */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={getCurrentImage()}
            alt={tour.title_tr}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* PREV/NEXT Buttons */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"
            >
              <FaChevronLeft className="text-white text-lg sm:text-xl" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"
            >
              <FaChevronRight className="text-white text-lg sm:text-xl" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {Array.isArray(tour.images) && tour.images.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`transition-all ${
                    idx === currentImageIndex 
                      ? 'w-8 h-2 bg-white rounded-full' 
                      : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
                  }`}
                  aria-label={`Görsel ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <FaMapMarkerAlt className="text-gold text-sm" />
                  <span className="text-white font-medium text-sm sm:text-base">{tour.location}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <FaStar className="text-gold text-sm" />
                  <span className="text-white font-bold text-sm sm:text-base">{average}</span>
                  <span className="text-white/70 text-xs sm:text-sm">({reviews.length})</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-3 sm:mb-4">
                {tour.title_tr}
              </h1>
              <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 text-white/90 text-sm sm:text-base">
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

      {/* CONTENT */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* SOL: Tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8">
                <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'overview', label: 'Genel Bakış' },
                    { id: 'itinerary', label: 'Program' },
                    { id: 'includes', label: 'Dahil/Hariç' },
                    { id: 'reviews', label: 'Yorumlar' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                        activeTab === tab.id
                          ? 'text-gold border-b-2 border-gold'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3 sm:mb-4">Tur Hakkında</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{tour.description_tr}</p>
                      <h4 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">Öne Çıkan Özellikler</h4>
                      <ul className="space-y-2 sm:space-y-3">
                        {(Array.isArray(tour.features_tr) ? tour.features_tr : []).map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3">
                            <FaCheck className="text-gold mt-1 flex-shrink-0 text-sm" />
                            <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'itinerary' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-4 sm:mb-6">Günlük Program</h3>
                      <div className="space-y-4 sm:space-y-6">
                        {(Array.isArray(tour.itinerary_tr) ? tour.itinerary_tr : []).map((day: any, idx: number) => (
                          <div key={idx} className="relative pl-6 sm:pl-8 border-l-2 border-gold pb-4 sm:pb-6 last:pb-0">
                            <div className="absolute -left-2.5 sm:-left-3 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-gold rounded-full border-4 border-white"></div>
                            <h4 className="text-base sm:text-lg font-bold text-primary mb-2">
                              Gün {idx + 1}: {day.title}
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base">{day.description}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'includes' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            Dahil Olan
                          </h3>
                          <ul className="space-y-2">
                            {(Array.isArray(tour.included_tr) ? tour.included_tr : []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                                <FaCheck className="text-green-500 mt-1 flex-shrink-0 text-sm" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                            <FaTimes className="text-red-500" />
                            Dahil Olmayan
                          </h3>
                          <ul className="space-y-2">
                            {(Array.isArray(tour.excluded_tr) ? tour.excluded_tr : []).map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                                <FaTimes className="text-red-500 mt-1 flex-shrink-0 text-sm" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    {/* İSTATİSTİKLER */}
    <div className="text-center mb-6 sm:mb-8">
      <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">{average}</div>
      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`text-xl ${i < Math.round(Number(average)) ? 'text-gold' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      <p className="text-gray-600 text-sm sm:text-base">{reviews.length} değerlendirme</p>
    </div>

    {/* ✅ YORUM YAZMA FORMU - LOCATION EKLİ */}
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-4">
        ✍️ Deneyiminizi Paylaşın
      </h3>
      
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        {/* İsim & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İsminiz *
            </label>
            <input
              type="text"
              required
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
              disabled={submittingReview}
              placeholder="Adınız Soyadınız"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={reviewForm.email}
              onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
              disabled={submittingReview}
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* ✅ LOCATION - YENİ ALAN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Konum (Şehir, Ülke) *
          </label>
          <input
            type="text"
            required
            value={reviewForm.location}
            onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
            disabled={submittingReview}
            placeholder="İstanbul, Türkiye"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Puanınız *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                disabled={submittingReview}
                className="focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
              >
                <FaStar
                  className={`text-3xl ${
                    star <= selectedRating
                      ? 'text-gold'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Seçilen puan: {selectedRating} / 5
          </p>
        </div>

        {/* Yorum */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Yorumunuz *
          </label>
          <textarea
            required
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            disabled={submittingReview}
            placeholder="Bu tur hakkındaki düşüncelerinizi paylaşın..."
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-gray-100 resize-none"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Yorumunuz onaylandıktan sonra yayınlanacaktır.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submittingReview}
          className="w-full py-3 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submittingReview ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Gönderiliyor...
            </>
          ) : (
            <>
              ✍️ Yorumu Gönder
            </>
          )}
        </button>
      </form>
    </div>

    {/* YORUMLAR LİSTESİ */}
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Müşteri Yorumları</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500 text-lg">
            Henüz yorum yapılmamış. İlk yorumu siz yapın!
          </p>
        </div>
      )}
    </div>
  </motion.div>
)}

                </div>
              </div>
            </div>

            {/* SAĞ PANEL */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-24"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-md mx-3 lg:mx-auto lg:max-w-none">
                  <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6 text-white">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-3xl sm:text-4xl font-bold">${tour.price}</span>
                        <span className="text-base sm:text-lg ml-2">/ kişi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-gold text-sm sm:text-base" />
                        <span className="font-bold text-sm sm:text-base">{average}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80">Tüm vergiler dahil</p>
                  </div>

                  <form onSubmit={handleBooking} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Tarih Seçin</label>
                      <input
                        type="date"
                        required
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        disabled={submitting}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Misafir Sayısı</label>
                      <select
                        required
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                        disabled={submitting}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {[...Array(tour.max_group)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} Kişi</option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">İsim</label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        disabled={submitting}
                        placeholder="Adınız Soyadınız"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        disabled={submitting}
                        placeholder="email@example.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        required
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        disabled={submitting}
                        placeholder="+90 5XX XXX XX XX"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">${tour.price} x {bookingData.guests} kişi</span>
                        <span className="font-semibold">${Number(tour.price) * bookingData.guests}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Hizmet bedeli</span>
                        <span className="font-semibold">$0</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-bold text-primary text-sm sm:text-base">Toplam</span>
                        <span className="font-bold text-xl sm:text-2xl text-primary">${Number(tour.price) * bookingData.guests}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-gold to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg transition text-base sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <FaCalendar />
                          Rezervasyon Yap
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Rezervasyon sonrası iptal ücretsizdir
                    </p>
                  </form>

                  <div className="border-t border-gray-200 p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Yardıma mı ihtiyacınız var?</p>
                    <a
                      href="https://wa.me/994501234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
                    >
                      <FaWhatsapp className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">WhatsApp</p>
                        <p className="text-xs text-gray-600">Anında cevap</p>
                      </div>
                    </a>
                    <a
                      href="tel:+994501234567"
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <FaPhone className="text-blue-500 text-lg sm:text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">Telefon</p>
                        <p className="text-xs text-gray-600">+994 50 123 45 67</p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@beyondbaku.com"
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gold/10 hover:bg-gold/20 rounded-lg transition"
                    >
                      <FaEnvelope className="text-gold text-lg sm:text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">Email</p>
                        <p className="text-xs text-gray-600 truncate">info@beyondbaku.com</p>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
