import { useState, useEffect } from 'react'; // ✅ 'global:string' yerine 'react'
import { Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';

interface ContactContent {
  id?: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  working_hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  map_lat: string;
  map_lng: string;
  map_embed_url: string;
}

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order_index: number;
}

export default function ContactPageEditor() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<'content' | 'faqs'>('content');
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState<ContactContent>({
    hero_badge: 'Get In Touch',
    hero_title: 'İletişime Geçin',
    hero_subtitle: 'Size yardımcı olmak için buradayız',
    hero_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
    address: 'Nizami Street 123, Baku, Azerbaijan',
    phone: '+994 50 123 45 67',
    email: 'info@beyondbaku.com',
    whatsapp: 'https://wa.me/994501234567',
    working_hours: '09:00 - 18:00',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    map_lat: '40.4093',
    map_lng: '49.8671',
    map_embed_url: ''
  });

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [contentData, faqsData] = await Promise.all([
        supabase.from('contact_page_content').select('*').single(),
        supabase.from('contact_faqs').select('*').order('order_index')
      ]);

      if (contentData.data) setContent(contentData.data);
      if (faqsData.data) setFaqs(faqsData.data);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContent() {
    try {
      const { error } = await supabase
        .from('contact_page_content')
        .upsert(content);

      if (error) throw error;
      showToast('İçerik başarıyla kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  }

  async function handleSaveFAQ(faq: FAQ) {
    try {
      const { error } = await supabase
        .from('contact_faqs')
        .upsert(faq);

      if (error) throw error;
      loadData();
      showToast('FAQ kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  }

  async function handleDeleteFAQ(id: string) {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('contact_faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
      showToast('FAQ silindi!', 'success');
    } catch (error) {
      console.error('Silme hatası:', error);
      showToast('Silme sırasında hata oluştu!', 'error');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">İletişim Sayfa Editörü</h1>
        <p className="text-gray-600 mt-1">İletişim sayfası içeriklerini düzenleyin</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('content')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'content'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📄 İçerik
          </button>
          <button
            onClick={() => setActiveSection('faqs')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'faqs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❓ SSS
          </button>
        </div>
      </div>

      {activeSection === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Hero Section
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.hero_badge}
                onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                placeholder="Badge"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                placeholder="Başlık"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              value={content.hero_subtitle}
              onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
              placeholder="Alt Başlık"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Resmi URL</label>
              <input
                type="url"
                value={content.hero_image}
                onChange={(e) => setContent({ ...content, hero_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              {content.hero_image && (
                <div className="mt-3">
                  <img 
                    src={content.hero_image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">İletişim Bilgileri</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.address}
                onChange={(e) => setContent({ ...content, address: e.target.value })}
                placeholder="Adres"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
              <input
                type="tel"
                value={content.phone}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
                placeholder="Telefon"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
                placeholder="Email"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={content.whatsapp}
                onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
                placeholder="WhatsApp Link"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.working_hours}
                onChange={(e) => setContent({ ...content, working_hours: e.target.value })}
                placeholder="Çalışma Saatleri"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Sosyal Medya</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="url"
                value={content.facebook}
                onChange={(e) => setContent({ ...content, facebook: e.target.value })}
                placeholder="Facebook"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={content.instagram}
                onChange={(e) => setContent({ ...content, instagram: e.target.value })}
                placeholder="Instagram"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={content.twitter}
                onChange={(e) => setContent({ ...content, twitter: e.target.value })}
                placeholder="Twitter"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Harita</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.map_lat}
                onChange={(e) => setContent({ ...content, map_lat: e.target.value })}
                placeholder="Enlem"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.map_lng}
                onChange={(e) => setContent({ ...content, map_lng: e.target.value })}
                placeholder="Boylam"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={content.map_embed_url}
                onChange={(e) => setContent({ ...content, map_embed_url: e.target.value })}
                placeholder="Harita Embed URL (opsiyonel)"
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
            </div>
          </div>

          <button
            onClick={handleSaveContent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            İçeriği Kaydet
          </button>
        </div>
      )}

      {activeSection === 'faqs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Sıkça Sorulan Sorular</h2>
            <button
              onClick={() => {
                const newFAQ: FAQ = {
                  question: '',
                  answer: '',
                  order_index: faqs.length + 1
                };
                setFaqs([...faqs, newFAQ]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Soru
            </button>
          </div>

          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Soru {index + 1}</h3>
                {faq.id && (
                  <button
                    onClick={() => handleDeleteFAQ(faq.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soru</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[index].question = e.target.value;
                    setFaqs(updated);
                  }}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Rezervasyon nasıl yapılır?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cevap</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[index].answer = e.target.value;
                    setFaqs(updated);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Cevabı buraya yazın..."
                />
              </div>

              <button
                onClick={() => handleSaveFAQ(faq)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Kaydet
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
