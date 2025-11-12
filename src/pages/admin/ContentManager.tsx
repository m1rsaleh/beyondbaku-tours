import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface Content {
  id: string
  key: string
  value_tr: string
  value_en: string
  value_ru: string
  value_az: string
  type: string
  category: string
}

export default function ContentManager() {
  const [contents, setContents] = useState<Content[]>([])
  const [selectedCategory, setSelectedCategory] = useState('hero')
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  const categories = ['hero', 'about', 'contact', 'footer']

  useEffect(() => {
    fetchContents()
  }, [])

  async function fetchContents() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .order('category')
    
    if (data) setContents(data)
  }

  async function updateContent(content: Content) {
    const { error } = await supabase
      .from('site_settings')
      .update({
        value_tr: content.value_tr,
        value_en: content.value_en,
        value_ru: content.value_ru,
        value_az: content.value_az
      })
      .eq('id', content.id)

    if (!error) {
      alert('İçerik güncellendi!')
      fetchContents()
      setEditingContent(null)
    }
  }

  const filteredContents = contents.filter(c => c.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Site İçerik Yönetimi</h1>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="grid gap-6">
          {filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{content.key}</h3>
                <button
                  onClick={() => setEditingContent(content)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Düzenle
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Türkçe</p>
                  <p className="text-gray-800">{content.value_tr}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">English</p>
                  <p className="text-gray-800">{content.value_en}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Русский</p>
                  <p className="text-gray-800">{content.value_ru}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Azərbaycanca</p>
                  <p className="text-gray-800">{content.value_az}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">İçeriği Düzenle: {editingContent.key}</h2>

              <div className="space-y-4">
                {['tr', 'en', 'ru', 'az'].map(lang => (
                  <div key={lang}>
                    <label className="block text-sm font-semibold mb-2">
                      {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : 'Azərbaycanca'}
                    </label>
                    <textarea
                      value={editingContent[`value_${lang}` as keyof Content] as string}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        [`value_${lang}`]: e.target.value
                      })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => updateContent(editingContent)}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setEditingContent(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
