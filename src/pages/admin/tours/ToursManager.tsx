// src/pages/admin/tours/ToursManager.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../../services/tourService';
import type { Tour } from '../../../types';

export default function ToursManager() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTours();
  }, []);

  async function loadTours() {
    setLoading(true);
    try {
      const data = await tourService.getAllTours();
      setTours(data);
    } finally {
      setLoading(false);
    }
  }

  const filteredTours = tours.filter(tour => {
    const matchesSearch =
      (tour.title_tr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (tour.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteTour = async (id: string) => {
    if (window.confirm('Bu turu silmek istediğinizden emin misiniz?')) {
      await tourService.deleteTour(id);
      loadTours();
    }
  };

  const toggleTourStatus = async (id: string, isActive: boolean) => {
    await tourService.updateTour(id, { is_active: !isActive });
    loadTours();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tur Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Toplam {tours.length} tur • {tours.filter(t => t.is_active).length} aktif
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/tours/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Yeni Tur Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Tur ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Adventure">Adventure</option>
              <option value="City">City Tours</option>
              <option value="Nature">Nature</option>
              <option value="Cultural">Cultural</option>
              <option value="Food">Food & Wine</option>
            </select>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <span className="text-lg">⊞</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <span className="text-lg">☰</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div 
              key={tour.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={tour.image || 'https://via.placeholder.com/400x300'} 
                  alt={tour.title_tr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    tour.is_active 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-gray-500/90 text-white'
                  }`}>
                    {tour.is_active ? '✓ Aktif' : '○ Pasif'}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                    {tour.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {tour.title_tr}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="font-semibold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-500">(0)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">${tour.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <span>⏱️</span>
                  <span>{tour.duration}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => toggleTourStatus(tour.id, !!tour.is_active)}
                    className={`py-2 px-3 rounded-lg transition-colors font-medium text-sm ${
                      tour.is_active
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-green-50 hover:bg-green-100 text-green-600'
                    }`}
                  >
                    {tour.is_active ? '⏸️' : '▶️'}
                  </button>
                  <button 
                    onClick={() => handleDeleteTour(tour.id)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Süre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={tour.images?.[0] || 'https://via.placeholder.com/80x80?text=Tour'} 
                        alt={tour.title_tr}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900">{tour.title_tr}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tour.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${tour.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tour.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      tour.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tour.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => toggleTourStatus(tour.id, !!tour.is_active)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                      >
                        {tour.is_active ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        onClick={() => handleDeleteTour(tour.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTours.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tur Bulunamadı</h3>
          <p className="text-gray-600 mb-6">Arama kriterlerinize uygun tur bulunamadı.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
