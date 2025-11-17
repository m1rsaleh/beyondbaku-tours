import { useState, useEffect } from 'react';
import { Save, Eye, Image as ImageIcon, Languages, Sparkles } from 'lucide-react';
import { pageContentService } from '../../../services/pageContentService';
import { translationService } from '../../../services/translationService';
import { useToast } from '../../../contexts/ToastContext';
import type { HomePageContent } from '../../../types';

export default function HomePageEditor() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'destinations' | 'featuredTours' | 'premiumExperience' | 'expertGuides' | 'testimonials' | 'cta'>('hero');

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    setLoading(true);
    const result = await pageContentService.getPageContent<HomePageContent>('home');
    if (result) {
      setContent(result.content);
    }
    setLoading(false);
  }

 const handleChange = (section: keyof HomePageContent, field: string, value: string | string[]) => {
  if (!content) return;
  setContent(prev => ({
    ...prev!,
    [section]: {
      ...prev![section],
      [field]: value
    }
  }));
};


  const handleTranslate = async () => {
    if (!content) return;
    
    setTranslating(true);
    showToast('AI çeviri başlatılıyor...' ,'info');
    
    try {
      const translatedContent = await translationService.translateContent(content);
      setContent(translatedContent);
      showToast('İçerik başarıyla TR ve RU dillerine çevrildi!','success');
    } catch (error) {
      console.error('Translation error:', error);
      showToast('Çeviri sırasında hata oluştu.','error');
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    const success = await pageContentService.updatePageContent<HomePageContent>('home', content);
    setSaving(false);
    if (success) {
      showToast('Ana sayfa içeriği başarıyla kaydedildi!', 'success');
    } else {
      showToast('Bir hata oluştu, tekrar deneyin.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">İçerik bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ana Səhifə Redaktoru</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <span>🇦🇿</span>
            <span>Azərbaycan dilində daxil edin (AI avtomatik tərcümə edəcək)</span>
          </p>
        </div>
        
        {/* AI Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={translating}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium transition flex items-center gap-2 hover:shadow-lg disabled:opacity-50 justify-center"
        >
          <Languages className="w-5 h-5" />
          {translating ? 'Tərcümə olunur...' : 'AI ilə Tərcümə Et (TR+RU)'}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setActiveSection('hero')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'hero' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🎯 Hero</button>
          <button onClick={() => setActiveSection('destinations')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'destinations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🗺️ Destinasiyalar</button>
          <button onClick={() => setActiveSection('featuredTours')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'featuredTours' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>⭐ Turlar</button>
          <button onClick={() => setActiveSection('premiumExperience')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'premiumExperience' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>💎 Premium</button>
          <button onClick={() => setActiveSection('expertGuides')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'expertGuides' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>👨‍🏫 Bələdçilər</button>
          <button onClick={() => setActiveSection('testimonials')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'testimonials' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>💬 Rəylər</button>
          <button onClick={() => setActiveSection('cta')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeSection === 'cta' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>📢 CTA</button>
        </div>
      </div>

      {/* HERO SECTION */}
      {activeSection === 'hero' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Hero Bölməsi</h2>
              <p className="text-sm text-gray-600">Əsas ekran üçün məzmun</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📸 Arxa Plan Şəkli URL</label>
            <input type="url" value={content.hero.backgroundImage} onChange={(e) => handleChange('hero', 'backgroundImage', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="https://example.com/image.jpg" />
            {content.hero.backgroundImage && (
              <img src={content.hero.backgroundImage} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">✨ Premium Badge Mətni</label>
            <input type="text" value={content.hero.premiumBadge} onChange={(e) => handleChange('hero', 'premiumBadge', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>🎭</span>
              <span>TypeAnimation Başlıqları</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq 1</label>
                <input type="text" value={content.hero.heading1} onChange={(e) => handleChange('hero', 'heading1', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq 2</label>
                <input type="text" value={content.hero.heading2} onChange={(e) => handleChange('hero', 'heading2', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlıq 3</label>
                <input type="text" value={content.hero.heading3} onChange={(e) => handleChange('hero', 'heading3', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📝 Alt Başlıq</label>
            <textarea value={content.hero.subtitle} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔘 CTA Düyməsi 1</label>
              <input type="text" value={content.hero.ctaButton1} onChange={(e) => handleChange('hero', 'ctaButton1', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔘 CTA Düyməsi 2</label>
              <input type="text" value={content.hero.ctaButton2} onChange={(e) => handleChange('hero', 'ctaButton2', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Statistikalar</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Müştəri Sayı</label>
                <input type="text" value={content.hero.statsCustomers} onChange={(e) => handleChange('hero', 'statsCustomers', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="1000+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tur Sayı</label>
                <input type="text" value={content.hero.statsTours} onChange={(e) => handleChange('hero', 'statsTours', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="50+" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reytinq</label>
                <input type="text" value={content.hero.statsRating} onChange={(e) => handleChange('hero', 'statsRating', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="4.9" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Müştəri Etiketi</label>
                <input type="text" value={content.hero.statsCustomersLabel} onChange={(e) => handleChange('hero', 'statsCustomersLabel', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Müştəri" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tur Etiketi</label>
                <input type="text" value={content.hero.statsToursLabel} onChange={(e) => handleChange('hero', 'statsToursLabel', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Tur" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reytinq Etiketi</label>
                <input type="text" value={content.hero.statsRatingLabel} onChange={(e) => handleChange('hero', 'statsRatingLabel', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Reytinq" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESTINATIONS SECTION */}
      {activeSection === 'destinations' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-2xl">🗺️</div>
            <div>
              <h2 className="text-xl font-bold">Destinasiyalar Bölməsi</h2>
              <p className="text-sm text-gray-600">Populyar yerləri göstərin</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bölmə Başlığı</label>
            <input type="text" value={content.destinations.sectionTitle} onChange={(e) => handleChange('destinations', 'sectionTitle', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bölmə Alt Başlığı</label>
            <input type="text" value={content.destinations.sectionSubtitle} onChange={(e) => handleChange('destinations', 'sectionSubtitle', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">{num}</span>
                  <span>Destinasiya {num}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input type="text" value={content.destinations[`destination${num}Name` as keyof typeof content.destinations] as string} onChange={(e) => handleChange('destinations', `destination${num}Name`, e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📸 Şəkil URL</label>
                    <input type="url" value={content.destinations[`destination${num}Image` as keyof typeof content.destinations] as string} onChange={(e) => handleChange('destinations', `destination${num}Image`, e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
                {content.destinations[`destination${num}Image` as keyof typeof content.destinations] && (
                  <img src={content.destinations[`destination${num}Image` as keyof typeof content.destinations] as string} alt={`Destination ${num}`} className="mt-4 w-full h-40 object-cover rounded-lg border-2 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED TOURS SECTION */}
    {activeSection === 'featuredTours' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <h2 className="text-xl font-bold">Featured Tours Section</h2>
    
    {/* Badge Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Badge Metni (Curated Collection)
      </label>
      <input
        type="text"
        value={content.featuredTours.badgeText || ''}
        onChange={(e) => handleChange('featuredTours', 'badgeText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Section Title - Türkçe */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Title (TR)
      </label>
      <input
        type="text"
        value={content.featuredTours.sectionTitle || ''}
        onChange={(e) => handleChange('featuredTours', 'sectionTitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Section Subtitle - Türkçe */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Subtitle (TR)
      </label>
      <textarea
        value={content.featuredTours.sectionSubtitle || ''}
        onChange={(e) => handleChange('featuredTours', 'sectionSubtitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        rows={3}
      />
    </div>

    {/* View All Button */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        "Tüm Turları Gör" Buton Metni
      </label>
      <input
        type="text"
        value={content.featuredTours.viewAllButton || ''}
        onChange={(e) => handleChange('featuredTours', 'viewAllButton', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Detail Button */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        "Detayları İncele" Buton Metni
      </label>
      <input
        type="text"
        value={content.featuredTours.detailButtonText || ''}
        onChange={(e) => handleChange('featuredTours', 'detailButtonText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  </div>
)}



      {/* PREMIUM EXPERIENCE SECTION */}
    {activeSection === 'premiumExperience' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <h2 className="text-xl font-bold">Premium Experience Section</h2>
    
    {/* Badge Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Badge Metni (Excellence Defined)
      </label>
      <input
        type="text"
        value={content.premiumExperience.badgeText || ''}
        onChange={(e) => handleChange('premiumExperience', 'badgeText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Excellence Defined"
      />
    </div>

    {/* Section Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Title (Neden BeyondBaku?)
      </label>
      <input
        type="text"
        value={content.premiumExperience.sectionTitle || ''}
        onChange={(e) => handleChange('premiumExperience', 'sectionTitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    {/* Section Subtitle */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Subtitle
      </label>
      <input
        type="text"
        value={content.premiumExperience.sectionSubtitle || ''}
        onChange={(e) => handleChange('premiumExperience', 'sectionSubtitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Premium seyahat deneyiminin yeniden tanımı"
      />
    </div>

    {/* Slider Images */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Slider Görselleri (URL'ler)
      </label>
      {(content.premiumExperience.sliderImages || []).map((img, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="url"
            value={img}
            onChange={(e) => {
              const newImages = [...(content.premiumExperience.sliderImages || [])];
              newImages[index] = e.target.value;
              handleChange('premiumExperience', 'sliderImages', newImages);
            }}
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={() => {
              const newImages = (content.premiumExperience.sliderImages || []).filter((_, i) => i !== index);
              handleChange('premiumExperience', 'sliderImages', newImages);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sil
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          handleChange('premiumExperience', 'sliderImages', [
            ...(content.premiumExperience.sliderImages || []),
            ''
          ]);
        }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        + Görsel Ekle
      </button>
    </div>

    {/* Slider Badge & Subtext */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slider Badge (Premium Collection)
        </label>
        <input
          type="text"
          value={content.premiumExperience.sliderBadge || ''}
          onChange={(e) => handleChange('premiumExperience', 'sliderBadge', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slider Alt Metin
        </label>
        <input
          type="text"
          value={content.premiumExperience.sliderSubtext || ''}
          onChange={(e) => handleChange('premiumExperience', 'sliderSubtext', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>

    <hr className="my-6" />

    {/* Feature 1 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 1</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature1Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature1Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Kişiye Özel Turlar"
        />
        <textarea
          value={content.premiumExperience.feature1Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature1Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="İlgi alanlarınıza göre tasarlanmış rotalar"
          rows={2}
        />
      </div>
    </div>

    {/* Feature 2 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 2</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature2Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature2Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Benzersiz Deneyimler"
        />
        <textarea
          value={content.premiumExperience.feature2Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature2Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
        />
      </div>
    </div>

    {/* Feature 3 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 3</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature3Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature3Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Online Rezervasyon"
        />
        <textarea
          value={content.premiumExperience.feature3Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature3Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
        />
      </div>
    </div>

    {/* Feature 4 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 4</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature4Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature4Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Premium Araçlar"
        />
        <textarea
          value={content.premiumExperience.feature4Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature4Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
        />
      </div>
    </div>

    {/* Feature 5 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 5</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature5Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature5Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Ücretsiz Danışmanlık"
        />
        <textarea
          value={content.premiumExperience.feature5Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature5Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
        />
      </div>
    </div>

    {/* Feature 6 */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Feature 6</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.premiumExperience.feature6Title || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature6Title', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Fırsat İndirimleri"
        />
        <textarea
          value={content.premiumExperience.feature6Desc || ''}
          onChange={(e) => handleChange('premiumExperience', 'feature6Desc', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
        />
      </div>
    </div>
  </div>
)}


      {/* EXPERT GUIDES SECTION */}
     {activeSection === 'expertGuides' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <h2 className="text-xl font-bold">Expert Guides Section</h2>
    
    {/* Badge Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Badge Metni (Meet The Team)
      </label>
      <input
        type="text"
        value={content.expertGuides.badgeText || ''}
        onChange={(e) => handleChange('expertGuides', 'badgeText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Meet The Team"
      />
    </div>

    {/* Section Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Title
      </label>
      <input
        type="text"
        value={content.expertGuides.sectionTitle || ''}
        onChange={(e) => handleChange('expertGuides', 'sectionTitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Uzman Rehberlerimiz"
      />
    </div>

    {/* Section Subtitle */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Subtitle
      </label>
      <input
        type="text"
        value={content.expertGuides.sectionSubtitle || ''}
        onChange={(e) => handleChange('expertGuides', 'sectionSubtitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="10+ yıl deneyimli, 4 dilde profesyonel rehberlik hizmeti"
      />
    </div>

    <hr className="my-6" />

    {/* Guide 1 */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Rehber 1</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.expertGuides.guide1Name || ''}
          onChange={(e) => handleChange('expertGuides', 'guide1Name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="İsim"
        />
        <input
          type="text"
          value={content.expertGuides.guide1Role || ''}
          onChange={(e) => handleChange('expertGuides', 'guide1Role', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Pozisyon"
        />
        <input
          type="text"
          value={content.expertGuides.guide1Languages || ''}
          onChange={(e) => handleChange('expertGuides', 'guide1Languages', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="TR • EN • RU • AZ"
        />
        <input
          type="text"
          value={content.expertGuides.guide1Experience || ''}
          onChange={(e) => handleChange('expertGuides', 'guide1Experience', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="12 Yıl"
        />
        <input
          type="url"
          value={content.expertGuides.guide1Image || ''}
          onChange={(e) => handleChange('expertGuides', 'guide1Image', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Fotoğraf URL"
        />
      </div>
    </div>

    {/* Guide 2 */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Rehber 2</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.expertGuides.guide2Name || ''}
          onChange={(e) => handleChange('expertGuides', 'guide2Name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="İsim"
        />
        <input
          type="text"
          value={content.expertGuides.guide2Role || ''}
          onChange={(e) => handleChange('expertGuides', 'guide2Role', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Pozisyon"
        />
        <input
          type="text"
          value={content.expertGuides.guide2Languages || ''}
          onChange={(e) => handleChange('expertGuides', 'guide2Languages', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="TR • EN • AZ"
        />
        <input
          type="text"
          value={content.expertGuides.guide2Experience || ''}
          onChange={(e) => handleChange('expertGuides', 'guide2Experience', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="10 Yıl"
        />
        <input
          type="url"
          value={content.expertGuides.guide2Image || ''}
          onChange={(e) => handleChange('expertGuides', 'guide2Image', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Fotoğraf URL"
        />
      </div>
    </div>

    {/* Guide 3 */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Rehber 3</h3>
      <div className="grid gap-3">
        <input
          type="text"
          value={content.expertGuides.guide3Name || ''}
          onChange={(e) => handleChange('expertGuides', 'guide3Name', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="İsim"
        />
        <input
          type="text"
          value={content.expertGuides.guide3Role || ''}
          onChange={(e) => handleChange('expertGuides', 'guide3Role', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Pozisyon"
        />
        <input
          type="text"
          value={content.expertGuides.guide3Languages || ''}
          onChange={(e) => handleChange('expertGuides', 'guide3Languages', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="TR • RU • AZ"
        />
        <input
          type="text"
          value={content.expertGuides.guide3Experience || ''}
          onChange={(e) => handleChange('expertGuides', 'guide3Experience', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="8 Yıl"
        />
        <input
          type="url"
          value={content.expertGuides.guide3Image || ''}
          onChange={(e) => handleChange('expertGuides', 'guide3Image', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Fotoğraf URL"
        />
      </div>
    </div>
  </div>
)}


      {/* TESTIMONIALS SECTION */}
      {activeSection === 'testimonials' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <h2 className="text-xl font-bold">Testimonials Section</h2>
    
    {/* Badge Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Badge Metni (Testimonials)
      </label>
      <input
        type="text"
        value={content.testimonials.badgeText || ''}
        onChange={(e) => handleChange('testimonials', 'badgeText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Testimonials"
      />
    </div>

    {/* Section Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Title
      </label>
      <input
        type="text"
        value={content.testimonials.sectionTitle || ''}
        onChange={(e) => handleChange('testimonials', 'sectionTitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Müşterilerimiz Ne Diyor?"
      />
    </div>

    {/* Section Subtitle */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Section Subtitle
      </label>
      <input
        type="text"
        value={content.testimonials.sectionSubtitle || ''}
        onChange={(e) => handleChange('testimonials', 'sectionSubtitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Binlerce mutlu gezginden gelen gerçek değerlendirmeler"
      />
    </div>

    <div className="bg-blue-50 p-4 rounded-lg">
      <p className="text-sm text-blue-800">
        💡 Yorumlar <strong>Testimonials</strong> bölümünden otomatik çekilir. 
        Sadece onaylı yorumlar gösterilir.
      </p>
    </div>
  </div>
)}


      {activeSection === 'cta' && (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <h2 className="text-xl font-bold">Premium CTA Section</h2>
    
    {/* Background Image */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Arkaplan Resmi URL
      </label>
      <input
        type="url"
        value={content.cta?.backgroundImage || ''}
        onChange={(e) => handleChange('cta', 'backgroundImage', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="https://images.unsplash.com/photo-..."
      />
      {content.cta?.backgroundImage && (
        <img 
          src={content.cta.backgroundImage} 
          alt="Preview" 
          className="mt-2 w-full h-32 object-cover rounded-lg"
        />
      )}
    </div>

    {/* Badge Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Badge Metni (Kampanya)
      </label>
      <input
        type="text"
        value={content.cta?.badgeText || ''}
        onChange={(e) => handleChange('cta', 'badgeText', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="🎁 İlk Rezervasyonunuzda %25 İndirim"
      />
    </div>

    {/* Title 1 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ana Başlık (1. Satır)
      </label>
      <input
        type="text"
        value={content.cta?.title1 || ''}
        onChange={(e) => handleChange('cta', 'title1', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Hayalleriniz"
      />
    </div>

    {/* Title 2 */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ana Başlık (2. Satır - Gold)
      </label>
      <input
        type="text"
        value={content.cta?.title2 || ''}
        onChange={(e) => handleChange('cta', 'title2', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Gerçek Olsun"
      />
    </div>

    {/* Subtitle */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Alt Başlık
      </label>
      <textarea
        value={content.cta?.subtitle || ''}
        onChange={(e) => handleChange('cta', 'subtitle', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        rows={3}
        placeholder="Premium seyahat deneyimi, özel tasarım rotalar..."
      />
    </div>

    {/* Button 1 Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buton 1 Metni
      </label>
      <input
        type="text"
        value={content.cta?.button1Text || ''}
        onChange={(e) => handleChange('cta', 'button1Text', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Hayalini Planla"
      />
    </div>

    {/* Button 2 Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buton 2 Metni
      </label>
      <input
        type="text"
        value={content.cta?.button2Text || ''}
        onChange={(e) => handleChange('cta', 'button2Text', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="WhatsApp ile Danış"
      />
    </div>

    {/* WhatsApp Link */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        WhatsApp Linki
      </label>
      <input
        type="url"
        value={content.cta?.whatsappLink || ''}
        onChange={(e) => handleChange('cta', 'whatsappLink', e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="https://wa.me/994501234567"
      />
    </div>

    {/* Features */}
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Özellik 1
        </label>
        <input
          type="text"
          value={content.cta?.feature1 || ''}
          onChange={(e) => handleChange('cta', 'feature1', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Anında Onay"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Özellik 2
        </label>
        <input
          type="text"
          value={content.cta?.feature2 || ''}
          onChange={(e) => handleChange('cta', 'feature2', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Güvenli Ödeme"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Özellik 3
        </label>
        <input
          type="text"
          value={content.cta?.feature3 || ''}
          onChange={(e) => handleChange('cta', 'feature3', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Ücretsiz İptal"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Özellik 4
        </label>
        <input
          type="text"
          value={content.cta?.feature4 || ''}
          onChange={(e) => handleChange('cta', 'feature4', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="7/24 Destek"
        />
      </div>
    </div>
  </div>
)}


      {/* Fixed Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saxlanılır...' : 'Dəyişiklikləri Saxla'}
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-xl font-semibold transition flex items-center justify-center gap-3 shadow-md hover:shadow-lg">
            <Eye className="w-5 h-5" />
            Önizləmə
          </button>
        </div>
      </div>
    </div>
  );
}
