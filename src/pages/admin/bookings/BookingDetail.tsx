import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, CreditCard, Check, X, Send, MessageSquare } from 'lucide-react';
import { bookingService } from '../../../services/bookingService';
import { useToast } from '../../../contexts/ToastContext';
import type { Booking } from '../../../types';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);  // ← YENİ STATE
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (id) loadInitialData();
  }, [id]);

  // İlk yükleme için ayrı fonksiyon
  async function loadInitialData() {
    setLoading(true);
    await fetchBooking();
    setLoading(false);
  }

  // Sadece veri çekme (loading değiştirmeyen)
  async function fetchBooking() {
    try {
      const data = await bookingService.getBookingById(id!);
      setBooking(data);
      console.log('📄 Booking yüklendi:', data?.status);
    } catch (error) {
      console.error('Booking yüklenemedi:', error);
    }
  }

async function handleStatusChange(newStatus: Booking['status']) {
  if (!confirm(`Rezervasyon durumunu "${newStatus}" olarak değiştirmek istediğinizden emin misiniz?`)) return;
  
  setUpdating(true);
  console.log('🎬 handleStatusChange BAŞLADI');
  console.log('📍 Mevcut booking:', booking?.id, booking?.status);
  console.log('🎯 Hedef status:', newStatus);
  
  try {
    const success = await bookingService.updateBookingStatus(id!, newStatus);
    console.log('📤 updateBookingStatus döndü:', success);
    
    if (success) {
      // 300ms bekle
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Yeniden çek
      console.log('🔄 fetchBooking çağrılıyor...');
      await fetchBooking();
      console.log('📥 fetchBooking tamamlandı, yeni booking:', booking?.status);
      
      showToast(`Durum "${newStatus}" olarak güncellendi!` as const, 'success' as const);
    } else {
      showToast('Durum güncellenemedi!' as const, 'error' as const);
    }
  } catch (error) {
    console.error('💥 CATCH BLOĞU:', error);
    showToast('Durum güncellenemedi!' as const, 'error' as const);
  } finally {
    setUpdating(false);
    console.log('🏁 handleStatusChange BİTTİ');
  }
}



  async function handleAddNote() {
    if (!newNote.trim()) return;
    
    setUpdating(true);
    try {
      const success = await bookingService.updateNotes(id!, newNote);
      if (success) {
        await fetchBooking();  // ← Yeniden çek
        setNewNote('');
        showToast('Not başarıyla eklendi!' as const, 'success' as const);
      } else {
        showToast('Not eklenemedi!' as const, 'error' as const);
      }
    } catch (error) {
      console.error('Not ekleme hatası:', error);
      showToast('Not eklenemedi!' as const, 'error' as const);
    } finally {
      setUpdating(false);
    }
  }

  const handleSendEmail = () => {
    if (booking) {
      window.location.href = `mailto:${booking.email}`;
      showToast('E-posta istemcisi açılıyor...' as const, 'info' as const);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'confirmed': return 'Onaylandı';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rezervasyon Bulunamadı</h2>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="text-blue-600 hover:underline"
          >
            Rezervasyonlara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Updating Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">Güncelleniyor...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Geri
        </button>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Müşteri Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {booking.customer_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium text-gray-900">{booking.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium text-gray-900">{booking.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Tur Bilgileri
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tur Adı</p>
                <p className="text-lg font-semibold text-gray-900">{booking.tour?.title_tr || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Tarih</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.tour_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Süre</p>
                    <p className="font-medium text-gray-900">{booking.tour?.duration || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Misafir Sayısı</p>
                <p className="text-2xl font-bold text-gray-900">{booking.guests} kişi</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Ödeme Bilgileri
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Kişi Başı Ücret</span>
                <span className="font-semibold">${(booking.total_price / booking.guests).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Misafir Sayısı</span>
                <span className="font-semibold">{booking.guests}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-gray-900">Toplam Tutar</span>
                <span className="text-2xl font-bold text-blue-600">${booking.total_price}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Notlar
            </h2>
            {booking.special_requests && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{booking.special_requests}</p>
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yeni not ekle..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Durum Değiştir</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleStatusChange('confirmed')}
                className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Onayla
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Tamamlandı
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                İptal Et
              </button>
            </div>
          </div>

          {/* Communication */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">İletişim</h3>
            <div className="space-y-3">
              <button
                onClick={handleSendEmail}
                className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                E-posta Gönder
              </button>
              <a
                href={`tel:${booking.phone}`}
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Telefon Et
              </a>
              <a
                href={`https://wa.me/${booking.phone.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
