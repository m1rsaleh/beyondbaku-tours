// src/pages/admin/pages/AboutPageEditor.tsx
import { useState } from 'react';
import { Save, Eye, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface AboutPageContent {
  titleAZ: string;
  titleEN: string;
  titleRU: string;
  contentAZ: string;
  contentEN: string;
  contentRU: string;
  missionTitleAZ: string;
  missionTitleEN: string;
  missionTitleRU: string;
  missionDescAZ: string;
  missionDescEN: string;
  missionDescRU: string;
  visionTitleAZ: string;
  visionTitleEN: string;
  visionTitleRU: string;
  visionDescAZ: string;
  visionDescEN: string;
  visionDescRU: string;
  image: string;
}

export default function AboutPageEditor() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');

  const [content, setContent] = useState<AboutPageContent>({
    titleAZ: 'Haqqımızda',
    titleEN: 'About Us',
    titleRU: 'О нас',
    contentAZ: 'Biz Azərbaycanda ən yaxşı tur təcrübələrini təqdim edirik. 2020-ci ildən bəri minlərlə səyahətçiyə xidmət göstəririk və onların Azərbaycanı kəşf etməsinə kömək edirik.',
    contentEN: 'We provide the best tour experiences in Azerbaijan. Since 2020, we have served thousands of travelers and helped them discover Azerbaijan.',
    contentRU: 'Мы предлагаем лучшие туры по Азербайджану. С 2020 года мы обслужили тысячи путешественников и помогли им открыть для себя Азербайджан.',
    missionTitleAZ: 'Missiyamız',
    missionTitleEN: 'Our Mission',
    missionTitleRU: 'Наша миссия',
    missionDescAZ: 'Azərbaycanın gözəlliklərini dünyaya tanıtmaq və unudulmaz səyahət təcrübələri yaratmaq.',
    missionDescEN: 'To introduce the beauties of Azerbaijan to the world and create unforgettable travel experiences.',
    missionDescRU: 'Представить красоты Азербайджана миру и создать незабываемые впечатления от путешествий.',
    visionTitleAZ: 'Vizyonumuz',
    visionTitleEN: 'Our Vision',
    visionTitleRU: 'Наше видение',
    visionDescAZ: 'Qafqazın aparıcı tur operatoru olmaq və beynəlxalq standartlarda xidmət göstərmək.',
    visionDescEN: 'To become the leading tour operator in the Caucasus and provide international standard services.',
    visionDescRU: 'Стать ведущим туроператором на Кавказе и предоставлять услуги международного уровня.',
    image: '/images/about.jpg'
  });

  const handleChange = (field: keyof AboutPageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving about page:', content);
    showToast('success', 'Hakkımızda sayfası başarıyla kaydedildi!');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hakkımızda Sayfa Editörü</h1>
        <p className="text-gray-600 mt-1">Hakkımızda sayfası içeriklerini düzenleyin</p>
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

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ana İçerik</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık ({activeTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={content[`title${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`title${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik ({activeTab.toUpperCase()})
          </label>
          <textarea
            value={content[`content${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`content${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Misyon</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık ({activeTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={content[`missionTitle${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`missionTitle${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama ({activeTab.toUpperCase()})
          </label>
          <textarea
            value={content[`missionDesc${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`missionDesc${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vision */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vizyon</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık ({activeTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={content[`visionTitle${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`visionTitle${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama ({activeTab.toUpperCase()})
          </label>
          <textarea
            value={content[`visionDesc${activeTab.toUpperCase()}` as keyof AboutPageContent] as string}
            onChange={(e) => handleChange(`visionDesc${activeTab.toUpperCase()}` as keyof AboutPageContent, e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Görsel</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Görsel yükle</p>
          <p className="text-sm text-gray-500">1200x800 önerilir</p>
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
