import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaUsers, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { tourService } from '../services/tourService';
import type { Tour } from '../types';

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
    // eslint-disable-next-line
  }, [tours, searchTerm, selectedCategory, priceRange, sortBy]);

  async function fetchTours() {
    setLoading(true);
    try {
      const data = await tourService.getAllTours();
      setTours(data);
      setFilteredTours(data);
    } finally {
      setLoading(false);
    }
  }

  function filterTours() {
    let filtered = [...tours];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.title_tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedCategory);
    }

    // Price
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(tour => {
        const price = Number(tour.price); // price string gelebilir
        if (max) return price >= min && price <= max;
        return price >= min;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

    setFilteredTours(filtered);
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Header */}
      <section className="relative h-[40vh] sm:h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
            alt="Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-secondary/90"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-semibold mb-3 sm:mb-4">
              Discover Azerbaijan
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6">
              Premium <span className="text-gold">Turlar</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
              Size özel tasarlanmış unutulmaz deneyimler
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="relative -mt-12 sm:-mt-16 z-30 mb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
          >
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tur veya destinasyon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 block">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="Şehir">Şehir Turları</option>
                  <option value="Doğa">Doğa Turları</option>
                  <option value="Kültür">Kültür Turları</option>
                  <option value="Macera">Macera Turları</option>
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 block">Fiyat Aralığı</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                >
                  <option value="all">Tümü</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200-500">$200 - $500</option>
                  <option value="500">$500+</option>
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 block">Sıralama</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                >
                  <option value="popular">Popüler</option>
                  <option value="price-low">Fiyat (Düşük)</option>
                  <option value="price-high">Fiyat (Yüksek)</option>
                  <option value="duration">Süre</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSortBy('popular');
                  }}
                  className="w-full px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-primary">{filteredTours.length}</span> tur bulundu
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">Tur bulunamadı</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="px-6 py-3 bg-gold text-white rounded-full hover:bg-gold/90 transition"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/tours/${tour.id}`} className="group block">
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                      <div className="relative h-64 sm:h-80 overflow-hidden">
                        <img
                          src={tour.images[0]}
                          alt={tour.title_tr}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 sm:py-2.5">
                          <span className="text-xl sm:text-2xl font-bold text-primary">${tour.price}</span>
                          <p className="text-[10px] sm:text-xs text-gray-500">/ kişi</p>
                        </div>
                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                          <FaMapMarkerAlt className="text-gold" />
                          <span className="text-white font-medium text-sm">{tour.location}</span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3 sm:mb-4 group-hover:text-gold transition leading-tight">
                          {tour.title_tr}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
                          {tour.description_tr}
                        </p>
                        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                              <FaClock className="text-gold" />
                              <span>{tour.duration}</span>
                            </div>
                            <div className="w-px h-3 sm:h-4 bg-gray-300"></div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                              <FaUsers className="text-gold" />
                              <span>Max {tour.max_group}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-gold" size={14} />
                            <span className="text-base sm:text-lg font-bold text-primary">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
