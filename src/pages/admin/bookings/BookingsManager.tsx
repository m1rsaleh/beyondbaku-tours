// src/pages/admin/bookings/BookingsManager.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export default function BookingsManager() {
   const navigate = useNavigate();
  const [bookings] = useState<Booking[]>([
    {
      id: 'BK001',
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+994 50 123 45 67',
      tour: 'Gobustan & Mud Volcanoes',
      date: '2025-11-20',
      time: '09:00',
      guests: 2,
      amount: 90,
      status: 'pending',
      payment: 'pending',
      createdAt: '2025-11-13'
    },
    {
      id: 'BK002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+994 50 234 56 78',
      tour: 'Baku City Tour',
      date: '2025-11-21',
      time: '10:00',
      guests: 4,
      amount: 140,
      status: 'confirmed',
      payment: 'paid',
      createdAt: '2025-11-12'
    },
    {
      id: 'BK003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+994 50 345 67 89',
      tour: 'Gabala Adventure',
      date: '2025-11-22',
      time: '08:00',
      guests: 3,
      amount: 165,
      status: 'confirmed',
      payment: 'paid',
      createdAt: '2025-11-11'
    },
    {
      id: 'BK004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+994 50 456 78 90',
      tour: 'Sheki Culture Tour',
      date: '2025-11-18',
      time: '09:30',
      guests: 2,
      amount: 100,
      status: 'completed',
      payment: 'paid',
      createdAt: '2025-11-10'
    },
    {
      id: 'BK005',
      customer: 'David Brown',
      email: 'david@example.com',
      phone: '+994 50 567 89 01',
      tour: 'Gobustan & Mud Volcanoes',
      date: '2025-11-15',
      time: '09:00',
      guests: 1,
      amount: 45,
      status: 'cancelled',
      payment: 'refunded',
      createdAt: '2025-11-09'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.payment === 'paid')
      .reduce((sum, b) => sum + b.amount, 0)
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
      case 'pending': return '⏳ Beklemede';
      case 'confirmed': return '✓ Onaylandı';
      case 'completed': return '✓ Tamamlandı';
      case 'cancelled': return '✗ İptal';
      default: return status;
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

  const getPaymentText = (payment: string) => {
    switch (payment) {
      case 'paid': return '✓ Ödendi';
      case 'pending': return '⏳ Beklemede';
      case 'refunded': return '↩ İade';
      default: return payment;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
          <p className="text-gray-600 mt-1">Tüm rezervasyonları görüntüleyin ve yönetin</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <span>📥</span>
          Excel'e Aktar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Beklemede</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">✓</div>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
          <p className="text-sm text-gray-600">Onaylandı</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600">Tamamlandı</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">✗</div>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-gray-600">İptal</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">💰</div>
          <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</p>
          <p className="text-sm text-gray-600">Toplam Gelir</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Müşteri, email, tur veya ID ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Beklemede ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'confirmed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Onaylandı ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tamamlandı ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih & Saat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kişi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{booking.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{booking.customer}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{booking.tour}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(booking.date).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{booking.guests}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">${booking.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getPaymentColor(booking.payment)}`}>
                      {getPaymentText(booking.payment)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/bookings/${booking.id}`)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors" title="Detay" > 👁️ </button>
                      <button 
                        className="p-1.5 hover:bg-green-50 text-green-600 rounded transition-colors"
                        title="Onayla"
                      >
                        ✓
                      </button>
                      <button 
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="İptal"
                      >
                        ✗
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rezervasyon Bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinize uygun rezervasyon bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
