import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from '../../lib/supabase'
import type { Tour } from '../../types'

export default function ToursManager() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTours()
  }, [])

  async function fetchTours() {
    setLoading(true)
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false })
    if (data) setTours(data)
    setLoading(false)
  }

  async function toggleActive(tour: Tour) {
    const { error } = await supabase
      .from('tours')
      .update({ is_active: !tour.is_active })
      .eq('id', tour.id)

    if (!error) {
      fetchTours()
    }
  }

  async function deleteTour(id: string) {
    if (!confirm('Bu turu silmek istediğinizden emin misiniz?')) return

    const { error } = await supabase.from('tours').delete().eq('id', id)
    if (!error) {
      alert('Tur silindi!')
      fetchTours()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Turları Yönet</h1>
            <p className="text-gray-600 mt-2">{tours.length} tur bulundu</p>
          </div>
          <Link
            to="/admin/tour/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            <FaPlus />
            Yeni Tur Ekle
          </Link>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <img
                      src={tour.images[0]}
                      alt={tour.title_tr}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{tour.title_tr}</h2>
                        <p className="text-gray-600 line-clamp-2">{tour.description_tr}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tour.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tour.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>📍 {tour.location}</span>
                      <span>⏱️ {tour.duration}</span>
                      <span>👥 Max {tour.max_group} kişi</span>
                      <span className="font-bold text-blue-600">${tour.price}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/tour/${tour.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <FaEdit />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => toggleActive(tour)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
                          tour.is_active
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {tour.is_active ? <FaEyeSlash /> : <FaEye />}
                        {tour.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                      </button>
                      <button
                        onClick={() => deleteTour(tour.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
