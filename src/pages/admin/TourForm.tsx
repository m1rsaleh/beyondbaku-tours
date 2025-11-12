import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function TourForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    price: 0,
    duration: '',
    category: '',
    location: '',
    images: [''],
    features_tr: ['']
  })

  useEffect(() => {
    if (id && id !== 'new') {
      fetchTour()
    }
  }, [id])

  async function fetchTour() {
    const { data } = await supabase.from('tours').select('*').eq('id', id).single()
    if (data) setForm(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const tourData = {
      ...form,
      title_ru: form.title_en,
      title_az: form.title_tr,
      description_ru: form.description_en,
      description_az: form.description_tr,
      features_en: form.features_tr,
      features_ru: form.features_tr,
      features_az: form.features_tr,
      max_group: 12,
      is_active: true
    }

    if (id === 'new') {
      const { error } = await supabase.from('tours').insert(tourData)
      if (error) {
        alert('Hata: ' + error.message)
      } else {
        navigate('/admin')
      }
    } else {
      const { error } = await supabase.from('tours').update(tourData).eq('id', id)
      if (error) {
        alert('Hata: ' + error.message)
      } else {
        navigate('/admin')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <button onClick={() => navigate('/admin')} className="text-blue-600">
          ← Geri
        </button>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {id === 'new' ? 'Yeni Tur Ekle' : 'Tur Düzenle'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık (TR)</label>
              <input
                type="text"
                required
                value={form.title_tr}
                onChange={(e) => setForm({ ...form, title_tr: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title (EN)</label>
              <input
                type="text"
                required
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Açıklama (TR)</label>
              <textarea
                required
                value={form.description_tr}
                onChange={(e) => setForm({ ...form, description_tr: e.target.value })}
                className="w-full px-3 py-2 border rounded h-24"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (EN)</label>
              <textarea
                required
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                className="w-full px-3 py-2 border rounded h-24"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fiyat ($)</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Süre</label>
                <input
                  type="text"
                  required
                  placeholder="1 Gün"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Doğa, Şehir, Kültür"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lokasyon</label>
                <input
                  type="text"
                  required
                  placeholder="Bakü, Quba, Şəki"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Resim URL</label>
              <input
                type="url"
                value={form.images[0]}
                onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Özellikler (virgülle ayır)</label>
              <input
                type="text"
                value={form.features_tr.join(', ')}
                onChange={(e) => setForm({ ...form, features_tr: e.target.value.split(', ') })}
                placeholder="Rehber, Öğle yemeği, Küçük grup"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded hover:bg-opacity-90 disabled:bg-gray-400"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
