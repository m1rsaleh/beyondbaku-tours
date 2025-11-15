// src/pages/admin/pages/HomePageEditor.tsx
import { useState } from 'react';
import { Save, Eye, Image as ImageIcon } from 'lucide-react';

interface HomePageContent {
  hero: {
    titleAZ: string;
    titleEN: string;
    titleRU: string;
    subtitleAZ: string;
    subtitleEN: string;
    subtitleRU: string;
    ctaTextAZ: string;
    ctaTextEN: string;
    ctaTextRU: string;
    backgroundImage: string;
  };
  about: {
    titleAZ: string;
    titleEN: string;
    titleRU: string;
    descriptionAZ: string;
    descriptionEN: string;
    descriptionRU: string;
    image: string;
  };
  features: {
    feature1TitleAZ: string;
    feature1TitleEN: string;
    feature1TitleRU: string;
    feature1DescAZ: string;
    feature1DescEN: string;
    feature1DescRU: string;
    feature2TitleAZ: string;
    feature2TitleEN: string;
    feature2TitleRU: string;
    feature2DescAZ: string;
    feature2DescEN: string;
    feature2DescRU: string;
    feature3TitleAZ: string;
    feature3TitleEN: string;
    feature3TitleRU: string;
    feature3DescAZ: string;
    feature3DescEN: string;
    feature3DescRU: string;
  };
  tours: {
    titleAZ: string;
    titleEN: string;
    titleRU: string;
  };
}

export default function HomePageEditor() {
  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'features' | 'tours'>('hero');

  const [content, setContent] = useState<HomePageContent>({
    hero: {
      titleAZ: 'Azərbaycanda Unudulmaz Səyahət',
      titleEN: 'Unforgettable Journey in Azerbaijan',
      titleRU: 'Незабываемое путешествие по Азербайджану',
      subtitleAZ: 'Qafqazın incisini kəşf edin',
      subtitleEN: 'Discover the pearl of the Caucasus',
      subtitleRU: 'Откройте для себя жемчужину Кавказа',
      ctaTextAZ: 'Turları Kəşf Et',
      ctaTextEN: 'Explore Tours',
      ctaTextRU: 'Исследуйте туры',
      backgroundImage: '/images/hero-bg.jpg'
    },
    about: {
      titleAZ: 'Haqqımızda',
      titleEN: 'About Us',
      titleRU: 'О нас',
      descriptionAZ: 'Biz Azərbaycanda ən yaxşı tur təcrübələrini təqdim edirik...',
      descriptionEN: 'We provide the best tour experiences in Azerbaijan...',
      descriptionRU: 'Мы предлагаем лучшие туры по Азербайджану...',
      image: '/images/about.jpg'
    },
    features: {
      feature1TitleAZ: 'Peşəkar Bələdçilər',
      feature1TitleEN: 'Professional Guides',
      feature1TitleRU: 'Профессиональные гиды',
      feature1DescAZ: 'Təcrübəli və bilikli bələdçilərimiz',
      feature1DescEN: 'Our experienced and knowledgeable guides',
      feature1DescRU: 'Наши опытные и знающие гиды',
      feature2TitleAZ: 'Rahat Nəqliyyat',
      feature2TitleEN: 'Comfortable Transport',
      feature2TitleRU: 'Комфортный транспорт',
      feature2DescAZ: 'Modern və rahat avtomobillərimiz',
      feature2DescEN: 'Our modern and comfortable vehicles',
      feature2DescRU: 'Наши современные и комфортные автомобили',
      feature3TitleAZ: 'Sərfəli Qiymətlər',
      feature3TitleEN: 'Affordable Prices',
      feature3TitleRU: 'Доступные цены',
      feature3DescAZ: 'Rəqabətli qiymətlərimiz',
      feature3DescEN: 'Our competitive prices',
      feature3DescRU: 'Наши конкурентные цены'
    },
    tours: {
      titleAZ: 'Məşhur Turlar',
      titleEN: 'Popular Tours',
      titleRU: 'Популярные туры'
    }
  });

  const handleChange = (section: keyof HomePageContent, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving content:', content);
    alert('Ana sayfa içeriği kaydedildi!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ana Sayfa Editörü</h1>
        <p className="text-gray-600 mt-1">Ana sayfa içeriklerini düzenleyin</p>
      </div>

      {/* Language & Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Language Tabs */}
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

          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSection('hero')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeSection === 'hero'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Hero
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeSection === 'about'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ℹ️ Hakkımızda
            </button>
            <button
              onClick={() => setActiveSection('features')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeSection === 'features'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Özellikler
            </button>
            <button
              onClick={() => setActiveSection('tours')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeSection === 'tours'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗺️ Turlar
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Bölümü</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ana Başlık ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.hero[`title${activeTab.toUpperCase()}` as keyof typeof content.hero] as string}
              onChange={(e) => handleChange('hero', `title${activeTab.toUpperCase()}`, e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Başlık ({activeTab.toUpperCase()})
            </label>
            <textarea
              value={content.hero[`subtitle${activeTab.toUpperCase()}` as keyof typeof content.hero] as string}
              onChange={(e) => handleChange('hero', `subtitle${activeTab.toUpperCase()}`, e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buton Metni ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.hero[`ctaText${activeTab.toUpperCase()}` as keyof typeof content.hero] as string}
              onChange={(e) => handleChange('hero', `ctaText${activeTab.toUpperCase()}`, e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {activeTab === 'az' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arka Plan Görseli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Görsel yükle</p>
                <p className="text-sm text-gray-500">1920x1080 önerilir</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hakkımızda Bölümü</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.about[`title${activeTab.toUpperCase()}` as keyof typeof content.about] as string}
              onChange={(e) => handleChange('about', `title${activeTab.toUpperCase()}`, e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama ({activeTab.toUpperCase()})
            </label>
            <textarea
              value={content.about[`description${activeTab.toUpperCase()}` as keyof typeof content.about] as string}
              onChange={(e) => handleChange('about', `description${activeTab.toUpperCase()}`, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Features Section */}
      {activeSection === 'features' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Özellikler Bölümü</h2>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Özellik {num}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık ({activeTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={content.features[`feature${num}Title${activeTab.toUpperCase()}` as keyof typeof content.features] as string}
                  onChange={(e) => handleChange('features', `feature${num}Title${activeTab.toUpperCase()}`, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama ({activeTab.toUpperCase()})
                </label>
                <textarea
                  value={content.features[`feature${num}Desc${activeTab.toUpperCase()}` as keyof typeof content.features] as string}
                  onChange={(e) => handleChange('features', `feature${num}Desc${activeTab.toUpperCase()}`, e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tours Section */}
      {activeSection === 'tours' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Turlar Bölümü</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık ({activeTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.tours[`title${activeTab.toUpperCase()}` as keyof typeof content.tours] as string}
              onChange={(e) => handleChange('tours', `title${activeTab.toUpperCase()}`, e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

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
