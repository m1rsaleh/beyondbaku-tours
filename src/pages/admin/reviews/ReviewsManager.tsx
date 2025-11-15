// src/pages/admin/reviews/ReviewsManager.tsx
import { useState } from 'react';

interface Review {
  id: string;
  customer: string;
  tour: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewsManager() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      customer: 'John Doe',
      tour: 'Gobustan Tour',
      rating: 5,
      comment: 'Harika bir deneyimdi! Rehber çok bilgiliydi.',
      date: '2025-11-13',
      status: 'pending'
    },
    {
      id: '2',
      customer: 'Jane Smith',
      tour: 'Baku City Tour',
      rating: 4,
      comment: 'Güzel bir turdu, tavsiye ederim.',
      date: '2025-11-12',
      status: 'approved'
    },
    {
      id: '3',
      customer: 'Mike Johnson',
      tour: 'Gabala Adventure',
      rating: 5,
      comment: 'Muhteşem manzaralar ve harika organizasyon!',
      date: '2025-11-11',
      status: 'approved'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReviews = reviews.filter(review =>
    filterStatus === 'all' || review.status === filterStatus
  );

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Yorum Yönetimi</h1>
        <p className="text-gray-600 mt-1">Müşteri yorumlarını görüntüleyin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam Yorum</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Beklemede</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-600">Onaylandı</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-2xl font-bold text-purple-600">{stats.avgRating}</p>
          <p className="text-sm text-gray-600">Ortalama Rating</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Beklemede ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Onaylandı ({stats.approved})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.customer}</h3>
                  <p className="text-sm text-gray-600">{review.tour}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                review.status === 'approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {review.status === 'pending' ? '⏳ Beklemede' :
                 review.status === 'approved' ? '✓ Onaylandı' : '✗ Reddedildi'}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl mb-2">{renderStars(review.rating)}</div>
              <p className="text-gray-700">{review.comment}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm">
                ✓ Onayla
              </button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                ✗ Reddet
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
