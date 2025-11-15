// src/pages/admin/bookings/BookingDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, CreditCard, Check, X, Send, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    country: string;
  };
  tour: {
    name: string;
    date: string;
    time: string;
    duration: string;
    pickupLocation: string;
  };
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  notes: string;
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking] = useState<Booking>({
    id: 'BK001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+994 50 123 45 67',
      country: 'USA'
    },
    tour: {
      name: 'Gobustan & Mud Volcanoes',
      date: '2025-11-20',
      time: '09:00',
      duration: '6 hours',
      pickupLocation: 'Hotel pickup in Baku'
    },
    guests: 2,
    amount: 90,
    status: 'pending',
    payment: 'pending',
    createdAt: '2025-11-13',
    notes: 'Customer requested vegetarian meal options.'
  });

  const [newNote, setNewNote] = useState('');

  const handleStatusChange = (newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (window.confirm(`Rezervasyon durumunu "${newStatus}" olarak değiştirmek istediğinizden emin misiniz?`)) {
      alert(`Durum "${newStatus}" olarak güncellendi!`);
    }
  };

  const handleSendEmail = () => {
    alert(`${booking.customer.email} adresine e-posta gönderildi!`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Not eklendi: ${newNote}`);
      setNewNote('');
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

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Rezervasyonlara Dön
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Rezervasyon #{booking.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date(booking.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturuldu
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(booking.status)}`}>
              {booking.status === 'pending' && '⏳ Beklemede'}
              {booking.status === 'confirmed' && '✓ Onaylandı'}
              {booking.status === 'completed' && '✓ Tamamlandı'}
              {booking.status === 'cancelled' && '✗ İptal'}
            </span>
            <span className={`px-4 py-2 rounded-xl font-semibold ${getPaymentColor(booking.payment)}`}>
              {booking.payment === 'paid' && '✓ Ödendi'}
              {booking.payment === 'pending' && '⏳ Ödeme Bekliyor'}
              {booking.payment === 'refunded' && '↩ İade Edildi'}
            </span>
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {booking.customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.customer.name}</p>
                  <p className="text-sm text-gray-500">{booking.customer.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium text-gray-900">{booking.customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium text-gray-900">{booking.customer.phone}</p>
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
                <p className="text-lg font-semibold text-gray-900">{booking.tour.name}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Tarih</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.tour.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Saat</p>
                    <p className="font-medium text-gray-900">{booking.tour.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Süre</p>
                    <p className="font-medium text-gray-900">{booking.tour.duration}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alınma Noktası</p>
                <p className="font-medium text-gray-900">{booking.tour.pickupLocation}</p>
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
                <span className="font-semibold">${booking.amount / booking.guests}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Misafir Sayısı</span>
                <span className="font-semibold">{booking.guests}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-gray-900">Toplam Tutar</span>
                <span className="text-2xl font-bold text-blue-600">${booking.amount}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Notlar
            </h2>
            {booking.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{booking.notes}</p>
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
                href={`tel:${booking.customer.phone}`}
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Telefon Et
              </a>
              <a
                href={`https://wa.me/${booking.customer.phone.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium flex items-center justify-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Özet Bilgiler</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rezervasyon ID</span>
                <span className="font-semibold">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturulma</span>
                <span className="font-semibold">
                  {new Date(booking.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum</span>
                <span className="font-semibold capitalize">{booking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme</span>
                <span className="font-semibold capitalize">{booking.payment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
