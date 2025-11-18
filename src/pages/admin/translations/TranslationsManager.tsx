// src/pages/admin/translations/TranslationsManager.tsx
import { useState } from 'react';
import { Save, Search, Plus, Edit2, Trash2, Languages } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface Translation {
  id: string;
  key: string;
  az: string;
  en: string;
  ru: string;
  section: string;
  description: string;
}

export default function TranslationsManager() {
  const { showToast } = useToast();
  const [translations, setTranslations] = useState<Translation[]>([
    // Home Page
    {
      id: '1',
      key: 'home.hero.title',
      az: 'Azərbaycanda Unudulmaz Səyahət',
      en: 'Unforgettable Journey in Azerbaijan',
      ru: 'Незабываемое путешествие по Азербайджану',
      section: 'home',
      description: 'Ana sayfa hero başlığı'
    },
    {
      id: '2',
      key: 'home.hero.subtitle',
      az: 'Qafqazın incisini kəşf edin',
      en: 'Discover the pearl of the Caucasus',
      ru: 'Откройте для себя жемчужину Кавказа',
      section: 'home',
      description: 'Ana sayfa hero alt başlığı'
    },
    {
      id: '3',
      key: 'home.hero.cta',
      az: 'Turları Kəşf Et',
      en: 'Explore Tours',
      ru: 'Исследуйте туры',
      section: 'home',
      description: 'Ana sayfa hero butonu'
    },
    {
      id: '4',
      key: 'home.about.title',
      az: 'Haqqımızda',
      en: 'About Us',
      ru: 'О нас',
      section: 'home',
      description: 'Ana sayfa hakkımızda başlığı'
    },
    {
      id: '5',
      key: 'home.tours.title',
      az: 'Məşhur Turlar',
      en: 'Popular Tours',
      ru: 'Популярные туры',
      section: 'home',
      description: 'Ana sayfa turlar bölümü başlığı'
    },
    // Footer
    {
      id: '6',
      key: 'footer.about.title',
      az: 'Haqqımızda',
      en: 'About',
      ru: 'О нас',
      section: 'footer',
      description: 'Footer hakkımızda başlığı'
    },
    {
      id: '7',
      key: 'footer.contact.title',
      az: 'Əlaqə',
      en: 'Contact',
      ru: 'Контакты',
      section: 'footer',
      description: 'Footer iletişim başlığı'
    },
    {
      id: '8',
      key: 'footer.rights',
      az: 'Bütün hüquqlar qorunur',
      en: 'All rights reserved',
      ru: 'Все права защищены',
      section: 'footer',
      description: 'Footer telif hakkı'
    },
    // About Page
    {
      id: '9',
      key: 'about.title',
      az: 'Haqqımızda',
      en: 'About Us',
      ru: 'О нас',
      section: 'about',
      description: 'Hakkımızda sayfa başlığı'
    },
    {
      id: '10',
      key: 'about.description',
      az: 'Biz Azərbaycanda ən yaxşı tur xidmətlərini təqdim edirik',
      en: 'We provide the best tour services in Azerbaijan',
      ru: 'Мы предоставляем лучшие туристические услуги в Азербайджане',
      section: 'about',
      description: 'Hakkımızda açıklaması'
    },
    // Contact Page
    {
      id: '11',
      key: 'contact.title',
      az: 'Bizimlə Əlaqə',
      en: 'Contact Us',
      ru: 'Свяжитесь с нами',
      section: 'contact',
      description: 'İletişim sayfa başlığı'
    },
    {
      id: '12',
      key: 'contact.form.name',
      az: 'Adınız',
      en: 'Your Name',
      ru: 'Ваше имя',
      section: 'contact',
      description: 'İletişim formu ad alanı'
    }
  ]);

  const [selectedSection, setSelectedSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    az: '',
    en: '',
    ru: '',
    section: 'home',
    description: ''
  });

  const sections = [
    { value: 'all', label: 'Tümü', icon: '🌐' },
    { value: 'home', label: 'Ana Sayfa', icon: '🏠' },
    { value: 'about', label: 'Hakkımızda', icon: 'ℹ️' },
    { value: 'contact', label: 'İletişim', icon: '📞' },
    { value: 'footer', label: 'Footer', icon: '⬇️' },
    { value: 'common', label: 'Genel', icon: '⚙️' }
  ];

  const filteredTranslations = translations.filter(t => {
    const matchesSection = selectedSection === 'all' || t.section === selectedSection;
    const matchesSearch = 
      t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.az.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ru.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const stats = {
    total: translations.length,
    home: translations.filter(t => t.section === 'home').length,
    about: translations.filter(t => t.section === 'about').length,
    contact: translations.filter(t => t.section === 'contact').length,
    footer: translations.filter(t => t.section === 'footer').length
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTranslation) {
      setTranslations(translations.map(t =>
        t.id === editingTranslation.id
          ? { ...t, ...formData }
          : t
      ));
       showToast('Çeviri güncellendi!', 'success');
    } else {
      const newTranslation: Translation = {
        id: Date.now().toString(),
        ...formData
      };
      setTranslations([...translations, newTranslation]);
      showToast('Yeni çeviri eklendi!', 'success');
    }

    setShowAddModal(false);
    setEditingTranslation(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      key: '',
      az: '',
      en: '',
      ru: '',
      section: 'home',
      description: ''
    });
  };

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation);
    setFormData({
      key: translation.key,
      az: translation.az,
      en: translation.en,
      ru: translation.ru,
      section: translation.section,
      description: translation.description
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu çeviriyi silmek istediğinizden emin misiniz?')) {
      setTranslations(translations.filter(t => t.id !== id));
    }
  };

  const handleSaveAll = () => {
    // Backend'e tüm çevirileri kaydet
    console.log('Saving all translations:', translations);
    showToast('Tüm çeviriler başarıyla kaydedildi!', 'success');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Languages className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Çeviri Yönetimi</h1>
          </div>
          <p className="text-gray-600">Site içeriklerini 3 dilde yönetin</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setEditingTranslation(null);
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Çeviri
          </button>
          <button
            onClick={handleSaveAll}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Tümünü Kaydet
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">🌐</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam Çeviri</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">🏠</div>
          <p className="text-2xl font-bold text-blue-600">{stats.home}</p>
          <p className="text-sm text-gray-600">Ana Sayfa</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">ℹ️</div>
          <p className="text-2xl font-bold text-purple-600">{stats.about}</p>
          <p className="text-sm text-gray-600">Hakkımızda</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">📞</div>
          <p className="text-2xl font-bold text-green-600">{stats.contact}</p>
          <p className="text-sm text-gray-600">İletişim</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">⬇️</div>
          <p className="text-2xl font-bold text-orange-600">{stats.footer}</p>
          <p className="text-sm text-gray-600">Footer</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Key veya metin ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.value}
                onClick={() => setSelectedSection(section.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedSection === section.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">🇦🇿 Azərbaycan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">🇬🇧 English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">🇷🇺 Русский</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bölüm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTranslations.map((translation) => (
                <tr key={translation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {translation.key}
                      </code>
                      {translation.description && (
                        <p className="text-xs text-gray-500 mt-1">{translation.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{translation.az}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{translation.en}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{translation.ru}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-700">
                      {sections.find(s => s.value === translation.section)?.icon} {translation.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(translation)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(translation.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTranslation ? 'Çeviri Düzenle' : 'Yeni Çeviri Ekle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key *</label>
                  <input
                    type="text"
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="home.hero.title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm *</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sections.filter(s => s.value !== 'all').map((section) => (
                      <option key={section.value} value={section.value}>
                        {section.icon} {section.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bu çevirinin ne için olduğunu açıklayın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🇦🇿 Azərbaycan *</label>
                <textarea
                  name="az"
                  value={formData.az}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Azərbaycan dilində mətn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🇬🇧 English *</label>
                <textarea
                  name="en"
                  value={formData.en}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Text in English..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🇷🇺 Русский *</label>
                <textarea
                  name="ru"
                  value={formData.ru}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Текст на русском..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingTranslation ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTranslation(null);
                    resetForm();
                  }}
                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
