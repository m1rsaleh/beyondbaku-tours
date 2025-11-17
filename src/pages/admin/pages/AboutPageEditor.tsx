import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';

interface AboutContent {
  id?: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  story_title: string;
  story_paragraph1: string;
  story_paragraph2: string;
  story_paragraph3: string;
  story_image: string;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  stat4_number: string;
  stat4_label: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button1_text: string;
  cta_button2_text: string;
}

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order_index: number;
}

interface Value {
  id?: string;
  title: string;
  description: string;
  icon_type: string;
  order_index: number;
}

export default function AboutPageEditor() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<'content' | 'team' | 'values'>('content');
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState<AboutContent>({
    hero_badge: 'About BeyondBaku',
    hero_title: 'Hayallerinizi Gerçeğe Dönüştürüyoruz',
    hero_subtitle: 'Azerbaycan\'ın kalbinde, unutulmaz anılar yaratıyoruz',
    hero_image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1920&q=80',
    story_title: 'Hikayemiz',
    story_paragraph1: '2015 yılında, Azerbaycan\'ın eşsiz güzelliklerini dünyaya tanıtma tutkusuyla yola çıktık.',
    story_paragraph2: 'Bakü\'nün modern mimarisinden Quba\'nın mistik dağlarına kadar keşfettik.',
    story_paragraph3: 'Bugün, 1000\'den fazla mutlu misafirle, Azerbaycan turizminde premium standartların öncüsü olmaktan gurur duyuyoruz.',
    story_image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    stat1_number: '1000+',
    stat1_label: 'Mutlu Misafir',
    stat2_number: '50+',
    stat2_label: 'Benzersiz Destinasyon',
    stat3_number: '10+',
    stat3_label: 'Yıl Deneyim',
    stat4_number: '4.9/5',
    stat4_label: 'Müşteri Memnuniyeti',
    cta_title: 'Bir Sonraki Maceranız Sizi Bekliyor',
    cta_subtitle: 'Unutulmaz bir Azerbaycan deneyimi için bizimle iletişime geçin',
    cta_button1_text: 'Turları Keşfet',
    cta_button2_text: 'İletişime Geç'
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [contentData, teamData, valuesData] = await Promise.all([
        supabase.from('about_page_content').select('*').single(),
        supabase.from('about_team_members').select('*').order('order_index'),
        supabase.from('about_values').select('*').order('order_index')
      ]);

      if (contentData.data) setContent(contentData.data);
      if (teamData.data) setTeamMembers(teamData.data);
      if (valuesData.data) setValues(valuesData.data);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContent() {
    try {
      const { error } = await supabase
        .from('about_page_content')
        .upsert(content);

      if (error) throw error;
      showToast('İçerik başarıyla kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  }

  async function handleSaveTeamMember(member: TeamMember) {
    try {
      const { error } = await supabase
        .from('about_team_members')
        .upsert(member);

      if (error) throw error;
      loadData();
      showToast('Ekip üyesi kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  }

  async function handleDeleteTeamMember(id: string) {
    if (!confirm('Bu ekip üyesini silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('about_team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
      showToast('Ekip üyesi silindi!', 'success');
    } catch (error) {
      console.error('Silme hatası:', error);
      showToast('Silme sırasında hata oluştu!', 'error');
    }
  }

  async function handleSaveValue(value: Value) {
    try {
      const { error } = await supabase
        .from('about_values')
        .upsert(value);

      if (error) throw error;
      loadData();
      showToast('Değer kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme sırasında hata oluştu!', 'error');
    }
  }

  async function handleDeleteValue(id: string) {
    if (!confirm('Bu değeri silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('about_values')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
      showToast('Değer silindi!', 'success');
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
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hakkımızda Sayfa Editörü</h1>
        <p className="text-gray-600 mt-1">Hakkımızda sayfası içeriklerini düzenleyin</p>
      </div>

      {/* Section Tabs */}
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
            onClick={() => setActiveSection('team')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👥 Ekip
          </button>
          <button
            onClick={() => setActiveSection('values')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'values'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⭐ Değerler
          </button>
        </div>
      </div>

            {/* CONTENT SECTION */}
      {activeSection === 'content' && (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Metni</label>
              <input
                type="text"
                value={content.hero_badge}
                onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="About BeyondBaku"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ana Başlık</label>
              <input
                type="text"
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Hayallerinizi Gerçeğe Dönüştürüyoruz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <input
                type="text"
                value={content.hero_subtitle}
                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Azerbaycan'ın kalbinde..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Resmi URL</label>
              <input
                type="url"
                value={content.hero_image}
                onChange={(e) => setContent({ ...content, hero_image: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              {content.hero_image && (
                <img src={content.hero_image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Hikaye Bölümü</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={content.story_title}
                onChange={(e) => setContent({ ...content, story_title: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Paragraf</label>
              <textarea
                value={content.story_paragraph1}
                onChange={(e) => setContent({ ...content, story_paragraph1: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Paragraf</label>
              <textarea
                value={content.story_paragraph2}
                onChange={(e) => setContent({ ...content, story_paragraph2: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3. Paragraf</label>
              <textarea
                value={content.story_paragraph3}
                onChange={(e) => setContent({ ...content, story_paragraph3: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hikaye Resmi URL</label>
              <input
                type="url"
                value={content.story_image}
                onChange={(e) => setContent({ ...content, story_image: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              {content.story_image && (
                <img src={content.story_image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">İstatistikler</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 1 - Sayı</label>
                <input
                  type="text"
                  value={content.stat1_number}
                  onChange={(e) => setContent({ ...content, stat1_number: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="1000+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 1 - Etiket</label>
                <input
                  type="text"
                  value={content.stat1_label}
                  onChange={(e) => setContent({ ...content, stat1_label: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Mutlu Misafir"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 2 - Sayı</label>
                <input
                  type="text"
                  value={content.stat2_number}
                  onChange={(e) => setContent({ ...content, stat2_number: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 2 - Etiket</label>
                <input
                  type="text"
                  value={content.stat2_label}
                  onChange={(e) => setContent({ ...content, stat2_label: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 3 - Sayı</label>
                <input
                  type="text"
                  value={content.stat3_number}
                  onChange={(e) => setContent({ ...content, stat3_number: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 3 - Etiket</label>
                <input
                  type="text"
                  value={content.stat3_label}
                  onChange={(e) => setContent({ ...content, stat3_label: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 4 - Sayı</label>
                <input
                  type="text"
                  value={content.stat4_number}
                  onChange={(e) => setContent({ ...content, stat4_number: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İstatistik 4 - Etiket</label>
                <input
                  type="text"
                  value={content.stat4_label}
                  onChange={(e) => setContent({ ...content, stat4_label: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">CTA Bölümü</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={content.cta_title}
                onChange={(e) => setContent({ ...content, cta_title: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <textarea
                value={content.cta_subtitle}
                onChange={(e) => setContent({ ...content, cta_subtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buton 1 Metni</label>
                <input
                  type="text"
                  value={content.cta_button1_text}
                  onChange={(e) => setContent({ ...content, cta_button1_text: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buton 2 Metni</label>
                <input
                  type="text"
                  value={content.cta_button2_text}
                  onChange={(e) => setContent({ ...content, cta_button2_text: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveContent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            İçeriği Kaydet
          </button>
        </div>
      )}

            {/* TEAM SECTION */}
      {activeSection === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Ekip Üyeleri</h2>
            <button
              onClick={() => {
                const newMember: TeamMember = {
                  name: '',
                  role: '',
                  bio: '',
                  image: '',
                  order_index: teamMembers.length + 1
                };
                setTeamMembers([...teamMembers, newMember]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Ekip Üyesi
            </button>
          </div>

          {teamMembers.map((member, index) => (
            <div key={member.id || index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Ekip Üyesi {index + 1}</h3>
                {member.id && (
                  <button
                    onClick={() => handleDeleteTeamMember(member.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const updated = [...teamMembers];
                      updated[index].name = e.target.value;
                      setTeamMembers(updated);
                    }}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Aytən Məmmədova"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon</label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => {
                      const updated = [...teamMembers];
                      updated[index].role = e.target.value;
                      setTeamMembers(updated);
                    }}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Kurucu & CEO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
                <input
                  type="text"
                  value={member.bio}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[index].bio = e.target.value;
                    setTeamMembers(updated);
                  }}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="15 yıllık turizm deneyimi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resim URL</label>
                <input
                  type="url"
                  value={member.image}
                  onChange={(e) => {
                    const updated = [...teamMembers];
                    updated[index].image = e.target.value;
                    setTeamMembers(updated);
                  }}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                {member.image && (
                  <img src={member.image} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg" />
                )}
              </div>

              <button
                onClick={() => handleSaveTeamMember(member)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Kaydet
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VALUES SECTION */}
      {activeSection === 'values' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Değerlerimiz</h2>
            <button
              onClick={() => {
                const newValue: Value = {
                  title: '',
                  description: '',
                  icon_type: 'award',
                  order_index: values.length + 1
                };
                setValues([...values, newValue]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Değer
            </button>
          </div>

          {values.map((value, index) => (
            <div key={value.id || index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Değer {index + 1}</h3>
                {value.id && (
                  <button
                    onClick={() => handleDeleteValue(value.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[index].title = e.target.value;
                    setValues(updated);
                  }}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Mükemmellik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={value.description}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[index].description = e.target.value;
                    setValues(updated);
                  }}
                  rows={2}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Her detayda kusursuzluk arayışı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon Tipi</label>
                <select
                  value={value.icon_type}
                  onChange={(e) => {
                    const updated = [...values];
                    updated[index].icon_type = e.target.value;
                    setValues(updated);
                  }}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="award">Ödül (Award)</option>
                  <option value="eye">Göz (Eye)</option>
                  <option value="lightning">Şimşek (Lightning)</option>
                  <option value="globe">Dünya (Globe)</option>
                  <option value="heart">Kalp (Heart)</option>
                  <option value="building">Bina (Building)</option>
                </select>
              </div>

              <button
                onClick={() => handleSaveValue(value)}
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

    