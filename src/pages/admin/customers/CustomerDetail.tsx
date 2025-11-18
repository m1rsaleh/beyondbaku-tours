// src/pages/admin/customers/CustomerDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Star, MessageSquare } from 'lucide-react';
import { customerService } from '../../../services/customerService';
import { supabase } from '../../../lib/supabase';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  registeredDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  notes: string;
}

interface Booking {
  id: string;
  tour: any;
  tour_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface Review {
  id: string;
  tour_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function CustomerDetail() {
  const { id } = useParams(); // id = email
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (id) {
      loadCustomerData(id);
    }
  }, [id]);

  async function loadCustomerData(email: string) {
    try {
      setLoading(true);
      
      // Müşteri verilerini çek
      const data = await customerService.getCustomerByEmail(email);
      
      if (data) {
        setCustomer(data.customer);
        setBookings(data.bookings);
        
        // Yorumları çek
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false });
        
        setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error('Müşteri verisi yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Not eklendi: ${newNote}`);
      setNewNote('');
    }
  };

  const handleSendEmail = () => {
    if (customer) {
      alert(`${customer.email} adresine e-posta gönderildi!`);
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

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-lg font-semibold">Müşteri bulunamadı.</p>
        <button 
          onClick={() => navigate('/admin/customers')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Müşterilere Dön
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/customers')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Müşterilere Dön
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">{customer.email}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl font-semibold ${
            customer.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {customer.status === 'active' ? '✓ Aktif Müşteri' : '○ Pasif'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{customer.totalBookings}</p>
              <p className="text-sm text-gray-600">Toplam Rezervasyon</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${customer.totalSpent}</p>
              <p className="text-sm text-gray-600">Toplam Harcama</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              <p className="text-sm text-gray-600">Yorum Sayısı</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-sm text-gray-600">Ortalama Rating</p>
            </div>
          </div>
        </div>
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
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Ülke</p>
                  <p className="font-medium text-gray-900">{customer.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(customer.registeredDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Rezervasyon Geçmişi
            </h2>
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {booking.tour?.title_tr || 'Bilinmeyen Tur'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.tour_date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900">${booking.total_price}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Henüz rezervasyon yok</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Yorumlar
            </h2>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Tur ID: {review.tour_id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-xl">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Henüz yorum yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>
            <div className="space-y-3">
              <button
                onClick={handleSendEmail}
                className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                E-posta Gönder
              </button>
              <a
                href={`tel:${customer.phone}`}
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Telefon Et
              </a>
              <a
                href={`https://wa.me/${customer.phone.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Notlar
            </h3>
            {customer.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">{customer.notes}</p>
              </div>
            )}
            <div className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Yeni not ekle..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleAddNote}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Not Ekle
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Özet İstatistikler</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Müşteri ID</span>
                <span className="font-semibold">{customer.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum</span>
                <span className="font-semibold capitalize">{customer.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Rezervasyon</span>
                <span className="font-semibold">{customer.totalBookings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Harcama</span>
                <span className="font-semibold">${customer.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ortalama Harcama</span>
                <span className="font-semibold">
                  ${customer.totalBookings > 0 ? Math.round(customer.totalSpent / customer.totalBookings) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
