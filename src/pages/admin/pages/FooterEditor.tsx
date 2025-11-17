import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';

interface FooterSettings {
  id?: string;
  company_name: string;
  company_tagline: string;
  company_description: string;
  logo_letter: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_url: string;
  copyright_text: string;
  whatsapp_float_enabled: boolean;
  whatsapp_float_number: string;
   newsletter_button_label: string;
}

interface QuickLink {
  id?: string;
  name: string;
  path: string;
  order_index: number;
}

interface Destination {
  id?: string;
  name: string;
  order_index: number;
}

export default function FooterEditor() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'links' | 'destinations'>('general');
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<FooterSettings>({
    company_name: '',
    company_tagline: '',
    company_description: '',
    logo_letter: '',
    newsletter_title: '',
    newsletter_subtitle: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    whatsapp_url: '',
    copyright_text: '',
    whatsapp_float_enabled: false,
    whatsapp_float_number: '',
    newsletter_button_label: 'Abone Ol', 
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [settingsData, linksData, destsData] = await Promise.all([
        supabase.from('footer_settings').select('*').single(),
        supabase.from('footer_quick_links').select('*').order('order_index'),
        supabase.from('footer_destinations').select('*').order('order_index')
      ]);
      if (settingsData.data) setSettings(settingsData.data);
      if (linksData.data) setQuickLinks(linksData.data);
      if (destsData.data) setDestinations(destsData.data);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    try {
      const { error } = await supabase.from('footer_settings').upsert(settings);
      if (error) throw error;
      showToast('Ayarlar kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme başarısız!', 'error');
    }
  }
  async function handleSaveLink(link: QuickLink) {
    try {
      const { error } = await supabase.from('footer_quick_links').upsert(link);
      if (error) throw error;
      loadData();
      showToast('Link kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme başarısız!', 'error');
    }
  }
  async function handleDeleteLink(id: string) {
    if (!window.confirm('Bu linki silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('footer_quick_links').delete().eq('id', id);
      if (error) throw error;
      loadData();
      showToast('Link silindi!', 'success');
    } catch (error) {
      console.error('Silme hatası:', error);
      showToast('Silme başarısız!', 'error');
    }
  }
  async function handleSaveDestination(dest: Destination) {
    try {
      const { error } = await supabase.from('footer_destinations').upsert(dest);
      if (error) throw error;
      loadData();
      showToast('Destinasyon kaydedildi!', 'success');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      showToast('Kaydetme başarısız!', 'error');
    }
  }
  async function handleDeleteDestination(id: string) {
    if (!window.confirm('Bu destinasyonu silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('footer_destinations').delete().eq('id', id);
      if (error) throw error;
      loadData();
      showToast('Destinasyon silindi!', 'success');
    } catch (error) {
      console.error('Silme hatası:', error);
      showToast('Silme başarısız!', 'error');
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Footer Editörü</h1>
        <p className="text-gray-600 mt-1">Footer içeriklerini düzenleyin</p>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('general')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🏢 Genel Ayarlar</button>
          <button onClick={() => setActiveTab('links')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'links' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🔗 Hızlı Linkler</button>
          <button onClick={() => setActiveTab('destinations')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'destinations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>📍 Destinasyonlar</button>
        </div>
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Şirket Bilgileri</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={settings.company_name}
                onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                placeholder="Şirket Adı" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={settings.company_tagline}
                onChange={e => setSettings({ ...settings, company_tagline: e.target.value })}
                placeholder="Slogan" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={settings.logo_letter}
                onChange={e => setSettings({ ...settings, logo_letter: e.target.value })}
                placeholder="Logo Harfi" maxLength={1} className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <textarea value={settings.company_description}
              onChange={e => setSettings({ ...settings, company_description: e.target.value })}
              placeholder="Şirket Açıklaması"
              rows={3}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Newsletter */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Newsletter</h2>
            <input type="text" value={settings.newsletter_title}
              onChange={e => setSettings({ ...settings, newsletter_title: e.target.value })}
              placeholder="Newsletter Başlık" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={settings.newsletter_subtitle}
              onChange={e => setSettings({ ...settings, newsletter_subtitle: e.target.value })}
              placeholder="Newsletter Alt Başlık" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <input
  type="text"
  value={settings.newsletter_button_label}
  onChange={(e) => setSettings({ ...settings, newsletter_button_label: e.target.value })}
  placeholder="Buton Yazısı (örn: Abone Ol)"
  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
/>

          {/* Sosyal Medya */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Sosyal Medya</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="url" value={settings.facebook_url}
                onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                placeholder="Facebook URL" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="url" value={settings.instagram_url}
                onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="Instagram URL" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="url" value={settings.tiktok_url}
                onChange={e => setSettings({ ...settings, tiktok_url: e.target.value })}
                placeholder="TikTok URL" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="url" value={settings.whatsapp_url}
                onChange={e => setSettings({ ...settings, whatsapp_url: e.target.value })}
                placeholder="WhatsApp Buton URL" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {/* İletişim */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">İletişim Bilgileri</h2>
            <textarea value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              placeholder="Adres"
              rows={2}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input type="tel" value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                placeholder="Telefon" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="email" value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                placeholder="Email" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="url" value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="WhatsApp (info section URL)" className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {/* Footer Alt */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Footer Alt</h2>
            <input type="text" value={settings.copyright_text}
              onChange={e => setSettings({ ...settings, copyright_text: e.target.value })}
              placeholder="Copyright Metni" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* WhatsApp Float */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Yüzen WhatsApp Butonu</h2>
            <div className="flex items-center gap-3">
              <input type="checkbox"
                checked={settings.whatsapp_float_enabled}
                onChange={e => setSettings({ ...settings, whatsapp_float_enabled: e.target.checked })}
                className="w-5 h-5" />
              <label>WhatsApp butonunu aktif et</label>
            </div>
            <input type="url" value={settings.whatsapp_float_number}
              onChange={e => setSettings({ ...settings, whatsapp_float_number: e.target.value })}
              placeholder="WhatsApp URL"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> Ayarları Kaydet
          </button>
        </div>
      )}
      {/* links ve destinations kodunla aynı */}
      {/* ... */}
 

      {/* LINKS TAB */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Hızlı Linkler</h2>
            <button
              onClick={() => {
                const newLink: QuickLink = {
                  name: '',
                  path: '/',
                  order_index: quickLinks.length + 1
                };
                setQuickLinks([...quickLinks, newLink]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Link
            </button>
          </div>

          {quickLinks.map((link, index) => (
            <div key={link.id || index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Link {index + 1}</h3>
                {link.id && (
                  <button
                    onClick={() => handleDeleteLink(link.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => {
                    const updated = [...quickLinks];
                    updated[index].name = e.target.value;
                    setQuickLinks(updated);
                  }}
                  placeholder="Link Adı (örn: Ana Sayfa)"
                  className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={link.path}
                  onChange={(e) => {
                    const updated = [...quickLinks];
                    updated[index].path = e.target.value;
                    setQuickLinks(updated);
                  }}
                  placeholder="Path (örn: /)"
                  className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => handleSaveLink(link)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Kaydet
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DESTINATIONS TAB */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Popüler Destinasyonlar</h2>
            <button
              onClick={() => {
                const newDest: Destination = {
                  name: '',
                  order_index: destinations.length + 1
                };
                setDestinations([...destinations, newDest]);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Destinasyon
            </button>
          </div>

          {destinations.map((dest, index) => (
            <div key={dest.id || index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Destinasyon {index + 1}</h3>
                {dest.id && (
                  <button
                    onClick={() => handleDeleteDestination(dest.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={dest.name}
                onChange={(e) => {
                  const updated = [...destinations];
                  updated[index].name = e.target.value;
                  setDestinations(updated);
                }}
                placeholder="Destinasyon Adı (örn: Bakü)"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => handleSaveDestination(dest)}
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