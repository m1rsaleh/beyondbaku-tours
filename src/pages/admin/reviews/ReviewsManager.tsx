import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Testimonial {
  id: string;
  tour_id?: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  location: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function ReviewsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    featured: 0,
    avgRating: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setTestimonials(data);
        
        // Stats hesapla
        const total = data.length;
        const pending = data.filter(t => !t.is_approved).length;
        const approved = data.filter(t => t.is_approved).length;
        const featured = data.filter(t => t.is_featured).length;
        const avgRating = total > 0 
          ? (data.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1)
          : 0;
        
        setStats({ total, pending, approved, featured, avgRating: Number(avgRating) });
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  // Onay/Reddet
  async function toggleApproval(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      loadData();
      alert(!currentStatus ? '✅ Yorum onaylandı!' : '❌ Yorum onayı kaldırıldı!');
    }
  }

  // Ana sayfa toggle
  async function toggleFeatured(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_featured: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      loadData();
      alert(!currentStatus ? '⭐ Ana sayfaya eklendi!' : '✓ Ana sayfadan kaldırıldı!');
    }
  }

  // Sil
  async function handleDelete(id: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (!error) {
      loadData();
      alert('🗑️ Yorum silindi!');
    }
  }

  const filteredTestimonials = testimonials.filter(t => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !t.is_approved;
    if (filterStatus === 'approved') return t.is_approved;
    if (filterStatus === 'featured') return t.is_featured;
    return true;
  });

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Yorum Yönetimi</h1>
        <p className="text-gray-600 mt-1">Müşteri yorumlarını görüntüleyin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam</p>
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
          <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
          <p className="text-sm text-gray-600">Ana Sayfa</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-2xl font-bold text-blue-600">{stats.avgRating}</p>
          <p className="text-sm text-gray-600">Ort. Puan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Beklemede ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Onaylandı ({stats.approved})
          </button>
          <button
            onClick={() => setFilterStatus('featured')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'featured'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ana Sayfa ({stats.featured})
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">Yorum bulunamadı</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => {
            const initials = testimonial.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* İsmin baş harfi */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">📍 {testimonial.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 text-xs rounded-full font-semibold bg-purple-100 text-purple-700">
                        ⭐ Ana Sayfada
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      testimonial.is_approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {testimonial.is_approved ? '✅ Onaylı' : '⏳ Beklemede'}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl mb-2">{renderStars(testimonial.rating)}</div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => toggleApproval(testimonial.id, testimonial.is_approved)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      testimonial.is_approved
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {testimonial.is_approved ? '❌ Onayı Kaldır' : '✅ Onayla'}
                  </button>

                  {testimonial.is_approved && (
                    <button 
                      onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                        testimonial.is_featured
                          ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {testimonial.is_featured ? '⭐ Ana Sayfada' : '☆ Ana Sayfaya Ekle'}
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
