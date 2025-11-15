// src/pages/admin/tours/TourForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService } from '../../../services/tourService';
import type { Tour } from '../../../types';
import { imageService } from '../../../services/imageService';
import { supabase } from '../../../lib/supabase';

// Hem form state'in hem de tipteki alanlar birebir eşleşmeli!
type TourFormData = {
  title: string;
  titleEN: string;
  titleRU: string;
  titleAZ: string;
  description: string;
  descriptionEN: string;
  descriptionRU: string;
  descriptionAZ: string;
  category: string;
  price: number | string;
  duration: string;
  capacity: number | string;
  status: 'active' | 'inactive';
  location: string;
  image?: string;
};



export default function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'ru' | 'az'>('tr');
  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    titleEN: '',
    titleRU: '',
    titleAZ: '',
    description: '',
    descriptionEN: '',
    descriptionRU: '',
    descriptionAZ: '',
     category: '',
    price: '',
    duration: '',
    capacity: 10,
    status: 'active',
    location: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{url: string; name: string}[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

// 1. İstediğin kolonları dizi şeklinde tanımla
const columns = [
  "id", "name_tr", "name_en", "name_ru", "name_az", "slug", "description_tr", "description_en", "icon", "order_num", "is_active", "created_at", "description_az", "description_ru", "status"
].join(",");


  // kategori
 useEffect(() => {
  async function fetchCategories() {
    const { data, error } = await supabase.from('tour_categories').select('*');
    if (!error && data) {
      // Türkçe için name_tr kullan
      
      const opts = data.map(cat => ({ value: String(cat.id), label: cat.name_tr }));
      setCategoryOptions(opts);
      if (formData.category === '' && opts.length > 0) {
        setFormData(prev => ({ ...prev, category: opts[0].value }));
      }
    }
  }
  fetchCategories();
}, []);

  useEffect(() => {
  async function fetchGalleryFiles() {
    const { data, error } = await supabase.storage.from('gallery').list('');
    if (!error) {
      const files = data?.map((item) => ({
        url: supabase.storage.from('gallery').getPublicUrl(item.name).data.publicUrl,
        name: item.name,
      }));
      setGalleryImages(files || []);
    }
  }
  fetchGalleryFiles();
}, []);


  // Edit mode backend'den veriyi çek
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      tourService.getTourById(id!).then(tour => {
        if (tour) {
          setFormData({
            title: tour.title_tr || '',
            titleEN: tour.title_en || '',
            titleRU: tour.title_ru || '',
            titleAZ: tour.title_az || '',
            description: tour.description_tr || '',
            descriptionEN: tour.description_en || '',
            descriptionRU: tour.description_ru || '',
            descriptionAZ: tour.description_az || '',
            category: tour.category || categoryOptions[0].value,
            price: tour.price || '',
            duration: tour.duration || '',
            capacity: tour.max_group || 10,
            status: tour.is_active ? 'active' : 'inactive',
            location: tour.location || '',
            image: tour.cover || '',
          });
        }
        setLoading(false);
      });
    }
  }, [id, isEditMode]);
   
  // Alan değişimi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'capacity' ? Number(value) : value }));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // Sadece şemadaki kolonları gönder!
  const payload = {
    title_tr: formData.title,
    title_en: formData.titleEN,
    title_ru: formData.titleRU,
    title_az: formData.titleAZ,
    description_tr: formData.description,
    description_en: formData.descriptionEN,
    description_ru: formData.descriptionRU,
    description_az: formData.descriptionAZ,
    category: formData.category, // uuid string!
    price: String(formData.price),
    duration: formData.duration,
    max_group: Number(formData.capacity),
    image: formData.image,
    location: formData.location,
    is_active: formData.status === 'active',
    
  };
  console.log('Payload gönderiliyor:', payload);

  try {
    // Supabase doğrudan
    const { data, error } = await supabase.from('tours').insert([payload]);
    if (error) {
      console.error('Kayıt hatası:', error);
      alert(error.message || 'Kayıt sırasında bir hata oluştu.');
    } else {
      alert('Yeni tur eklendi!');
      navigate('/admin/tours');
    }
  } catch (err) {
    alert('Kayıt sırasında bir hata oluştu.');
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/tours')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          <span>←</span>
          <span>Geri Dön</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEditMode ? 'Tur Düzenle' : 'Yeni Tur Ekle'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Mevcut turu güncelleyin' : 'Yeni bir tur oluşturun'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 ">
        {/* Language Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dil Seçimi</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setActiveTab('tr')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'tr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              🇹🇷 Türkçe
            </button>
            <button type="button" onClick={() => setActiveTab('en')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              🇬🇧 English
            </button>
            <button type="button" onClick={() => setActiveTab('ru')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'ru' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              🇷🇺 Русский
            </button>
            <button type="button" onClick={() => setActiveTab('az')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'az' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              🇦🇿 Azərbaycan
            </button>
          </div>
        </div>
        {/* Türkçe */}
        {activeTab === 'tr' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Türkçe İçerik</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tur Başlığı (TR) *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: Gobustan & Mud Volcanoes Tour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (TR) *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Turun detaylı açıklaması..." />
            </div>
          </div>
        )}
        {/* İngilizce */}
        {activeTab === 'en' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">English Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Title (EN) *</label>
              <input type="text" name="titleEN" value={formData.titleEN} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g: Gobustan & Mud Volcanoes Tour" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN) *</label>
              <textarea name="descriptionEN" value={formData.descriptionEN} onChange={handleChange} required rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed tour description..." />
            </div>
          </div>
        )}
        {/* Rusça */}
        {activeTab === 'ru' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Русский Контент</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Название тура (RU) *</label>
              <input type="text" name="titleRU" value={formData.titleRU} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Тур Гобустан и грязевые вулканы" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Описание (RU) *</label>
              <textarea name="descriptionRU" value={formData.descriptionRU} onChange={handleChange} required rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Подробное описание тура..." />
            </div>
          </div>
        )}
        {/* Azerice */}
        {activeTab === 'az' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Azərbaycan Dili</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tur Başlığı (AZ) *</label>
              <input type="text" name="titleAZ" value={formData.titleAZ} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Misal: Bakı Şəhər Turu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıqlama (AZ) *</label>
              <textarea name="descriptionAZ" value={formData.descriptionAZ} onChange={handleChange} required rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tura dair ətraflı açıqlama..." />
            </div>
          </div>
        )}

        {/* Genel Bilgiler */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
        <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
  className="input"
>
  {categoryOptions.length === 0 && <option>Kategori yok</option>}
  {categoryOptions.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>

      </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Süre *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="6 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasite *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Görseller (dummy alan) */}
        <div className="mb-4 relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
  {formData.image && (
    <img
      src={formData.image}
      alt="Kapak"
      className="w-full max-w-xs mb-3 rounded-lg shadow"
    />
  )}
 <input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Dosya adını sadeleştir
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '');
    const timestamp = Date.now();
    const finalName = `${timestamp}_${safeName}`;
    // Yükle
    const uploadResult = await supabase.storage.from('gallery').upload(finalName, file);
    if (uploadResult.error) {
      alert('Yükleme hatası: ' + uploadResult.error.message);
      setUploading(false);
      return;
    }
    // Public URL al ve test et
    const { data } = supabase.storage.from('gallery').getPublicUrl(finalName);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      alert('Görsel için public URL alınamadı. Bucket erişimini/görsel adını kontrol et.');
      setUploading(false);
      return;
    }
    setFormData(prev => ({ ...prev, image: publicUrl }));
    setUploading(false);
  }}
  disabled={uploading}
/>
  {uploading && <div className="text-blue-600 mt-2">Yükleniyor...</div>}

  <div className="my-3">
    <button
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => setGalleryOpen(true)}
    >
      Galeriden Seç
    </button>
  </div>

  {galleryOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-lg max-h-[80vh] overflow-auto shadow-2xl relative">
        <div className="flex justify-between mb-3 items-center">
          <div className="font-bold text-lg">Galeriden Görsel Seç</div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 text-2xl"
            onClick={() => setGalleryOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.map((img) => (
            <img
              key={img.name}
              src={img.url}
              onClick={() => {
                setFormData(prev => ({ ...prev, image: img.url }));
                setGalleryOpen(false);
              }}
              className="w-full h-24 object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-blue-600"
              alt={img.name}
            />
          ))}
          {galleryImages.length === 0 && (
            <div className="col-span-3 text-gray-500 py-8 text-center text-sm">Galeride hiç görsel yok.</div>
          )}
        </div>
      </div>
    </div>
  )}
</div>


        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isEditMode ? '✓ Değişiklikleri Kaydet' : '+ Tur Ekle'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/tours')}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
