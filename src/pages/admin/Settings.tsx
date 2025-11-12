import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface Settings {
  whatsapp: string
  phone: string
  email: string
  address_tr: string
  address_en: string
  facebook: string
  instagram: string
  twitter: string
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    whatsapp: '+994501234567',
    phone: '+994501234567',
    email: 'info@beyondbaku.com',
    address_tr: 'Nizami Street 123, Baku, Azerbaijan',
    address_en: 'Nizami Street 123, Baku, Azerbaijan',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com'
  })

  const [saved, setSaved] = useState(false)

  async function saveSettings() {
    // Supabase'e kaydet
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        { key: 'whatsapp', value_tr: settings.whatsapp, category: 'contact' },
        { key: 'phone', value_tr: settings.phone, category: 'contact' },
        { key: 'email', value_tr: settings.email, category: 'contact' },
        { key: 'address', value_tr: settings.address_tr, value_en: settings.address_en, category: 'contact' },
        { key: 'facebook', value_tr: settings.facebook, category: 'social' },
        { key: 'instagram', value_tr: settings.instagram, category: 'social' },
        { key: 'twitter', value_tr: settings.twitter, category: 'social' }
      ])

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Site Ayarları</h1>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
          >
            ✓ Ayarlar kaydedildi!
          </motion.div>
        )}

        <div className="space-y-6">
          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">İletişim Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">WhatsApp</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+994 50 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Telefon</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adres (Türkçe)</label>
                <textarea
                  value={settings.address_tr}
                  onChange={(e) => setSettings({ ...settings, address_tr: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adres (English)</label>
                <textarea
                  value={settings.address_en}
                  onChange={(e) => setSettings({ ...settings, address_en: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sosyal Medya</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Twitter</label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold text-lg"
          >
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
