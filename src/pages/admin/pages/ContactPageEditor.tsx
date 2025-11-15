// src/pages/admin/pages/ContactPageEditor.tsx
import { useState } from 'react';
import { Save, Eye } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface ContactPageContent {
  titleAZ: string;
  titleEN: string;
  titleRU: string;
  descriptionAZ: string;
  descriptionEN: string;
  descriptionRU: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapLat: string;
  mapLng: string;
}

export default function ContactPageEditor() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');

  const [content, setContent] = useState<ContactPageContent>({
    titleAZ: 'Bizimlə Əlaqə',
    titleEN: 'Contact Us',
    titleRU: 'Свяжитесь с нами',
    descriptionAZ: 'Sizə kömək etməkdən məmnun olarıq. Bizimlə əlaqə saxlayın.',
    descriptionEN: 'We would be happy to help you. Get in touch with us.',
    descriptionRU: 'Мы будем рады помочь вам. Свяжитесь с нами.',
    address: 'Baku, Azerbaijan',
    phone: '+994 50 123 45 67',
    email: 'info@beyondbaku.com',
    workingHours: '09:00 - 18:00',
    mapLat: '40.4093',
    mapLng: '49.8671'
  });

  const handleChange = (field: keyof ContactPageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving contact page:', content);
    showToast('success', 'İletişim sayfası başarıyla kaydedildi!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">İletişim Sayfa Editörü</h1>
        <p className="text-gray-600 mt-1">İletişim sayfası içeriklerini düzenleyin</p>
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('az')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'az'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🇦🇿 Azərbaycan
          </button>
          <button
            onClick={() => setActiveTab('en')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setActiveTab('ru')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ru'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🇷🇺 Русский
          </button>
        </div>
      </div>

      {/* Text Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sayfa İçeriği</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık ({activeTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={content[`title${activeTab.toUpperCase()}` as keyof ContactPageContent] as string}
            onChange={(e) => handleChange(`title${activeTab.toUpperCase()}` as keyof ContactPageContent, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama ({activeTab.toUpperCase()})
          </label>
          <textarea
            value={content[`description${activeTab.toUpperCase()}` as keyof ContactPageContent] as string}
            onChange={(e) => handleChange(`description${activeTab.toUpperCase()}` as keyof ContactPageContent, e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <input
              type="text"
              value={content.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={content.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              value={content.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
            <input
              type="text"
              value={content.workingHours}
              onChange={(e) => handleChange('workingHours', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Map Coordinates */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Harita Koordinatları</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enlem (Latitude)</label>
            <input
              type="text"
              value={content.mapLat}
              onChange={(e) => handleChange('mapLat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="40.4093"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Boylam (Longitude)</label>
            <input
              type="text"
              value={content.mapLng}
              onChange={(e) => handleChange('mapLng', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="49.8671"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Değişiklikleri Kaydet
          </button>
          <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Eye className="w-5 h-5" />
            Önizle
          </button>
        </div>
      </div>
    </div>
  );
}
