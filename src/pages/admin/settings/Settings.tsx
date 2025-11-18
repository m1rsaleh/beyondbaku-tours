import { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { settingsService } from '../../../services/settingsService';
import type { GeneralSettings, ContactSettings, SocialSettings } from '../../../types';

export default function Settings() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'email'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: '',
    siteTitle: '',
    siteDescription: '',
    defaultLanguage: 'tr',
    timezone: 'Asia/Baku'
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    workingHours: ''
  });

  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  });

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: '⚙️' },
    { id: 'contact', name: 'İletişim Bilgileri', icon: '📞' },
    { id: 'social', name: 'Sosyal Medya', icon: '📱' },
    { id: 'email', name: 'E-posta Ayarları', icon: '📧' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const allSettings = await settingsService.getAllSettings();

      allSettings.forEach((setting: any) => {
        if (setting.key === 'general') {
          setGeneralSettings(setting.value as GeneralSettings);
        } else if (setting.key === 'contact') {
          setContactSettings(setting.value as ContactSettings);
        } else if (setting.key === 'social') {
          setSocialSettings(setting.value as SocialSettings);
        }
      });
    } catch (error) {
      showToast('Ayarlar yüklenirken hata oluştu!', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (activeTab === 'general') {
        await settingsService.updateSettings('general', generalSettings, 'general');
      } else if (activeTab === 'contact') {
        await settingsService.updateSettings('contact', contactSettings, 'contact');
      } else if (activeTab === 'social') {
        await settingsService.updateSettings('social', socialSettings, 'social');
      }

      showToast('Ayarlar başarıyla kaydedildi!', 'success');
    } catch (error) {
      showToast('Ayarlar kaydedilirken hata oluştu!', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Site ayarlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Genel Ayarlar</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
            <input
              type="text"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Başlığı</label>
            <input
              type="text"
              value={generalSettings.siteTitle}
              onChange={(e) => setGeneralSettings({...generalSettings, siteTitle: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
            <textarea
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Dil</label>
              <select
                value={generalSettings.defaultLanguage}
                onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
                <option value="ru">🇷🇺 Русский</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saat Dilimi</label>
              <select
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asia/Baku">Asia/Baku (GMT+4)</option>
                <option value="Europe/Istanbul">Europe/Istanbul (GMT+3)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contact Settings */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
              <input
                type="email"
                value={contactSettings.email}
                onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="tel"
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="tel"
                value={contactSettings.whatsapp}
                onChange={(e) => setContactSettings({...contactSettings, whatsapp: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
              <input
                type="text"
                value={contactSettings.workingHours}
                onChange={(e) => setContactSettings({...contactSettings, workingHours: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <textarea
              value={contactSettings.address}
              onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Social Media Settings */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sosyal Medya</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📘 Facebook</label>
              <input
                type="url"
                value={socialSettings.facebook}
                onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📸 Instagram</label>
              <input
                type="url"
                value={socialSettings.instagram}
                onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🐦 Twitter</label>
              <input
                type="url"
                value={socialSettings.twitter}
                onChange={(e) => setSocialSettings({...socialSettings, twitter: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">▶️ YouTube</label>
              <input
                type="url"
                value={socialSettings.youtube}
                onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">E-posta Ayarları</h2>
          <p className="text-gray-600">SMTP ayarları ve e-posta şablonları buraya gelecek.</p>
        </div>
      )}

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? '⏳ Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
}
