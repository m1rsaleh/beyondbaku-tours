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
  images?: string[];  // ✅ BU SATIRI EKLE
  
  features: string[];
  included: string[];
  excluded: string[];
  itinerary: { title: string; description: string }[];
  
  featuresEN: string[];
  includedEN: string[];
  excludedEN: string[];
  itineraryEN: { title: string; description: string }[];
  
  featuresRU: string[];
  includedRU: string[];
  excludedRU: string[];
  itineraryRU: { title: string; description: string }[];
  
  featuresAZ: string[];
  includedAZ: string[];
  excludedAZ: string[];
  itineraryAZ: { title: string; description: string }[];
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
  images: [],
  features: [],
  included: [],
  excluded: [],
  itinerary: [],
  
  featuresEN: [],
  includedEN: [],
  excludedEN: [],
  itineraryEN: [],
  
  featuresRU: [],
  includedRU: [],
  excludedRU: [],
  itineraryRU: [],
  
  featuresAZ: [],
  includedAZ: [],
  excludedAZ: [],
  itineraryAZ: []
});

  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{url: string; name: string}[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [multiGalleryOpen, setMultiGalleryOpen] = useState(false);

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
    loadTour();
  }
}, [id, isEditMode]);

async function loadTour() {
  setLoading(true);
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Tur yüklenemedi:', error);
    setLoading(false);
    return;
  }

  if (data) {
    setFormData({
      title: data.title_tr || '',
      titleEN: data.title_en || '',
      titleRU: data.title_ru || '',
      titleAZ: data.title_az || '',
      description: data.description_tr || '',
      descriptionEN: data.description_en || '',
      descriptionRU: data.description_ru || '',
      descriptionAZ: data.description_az || '',
      category: data.category || '',
      price: data.price || 0,
      duration: data.duration || '',
      capacity: data.max_group || 0,
      image: data.image || '',
      images: data.images || [],  // ✅ ÖNEMLİ - Çoklu görseller
      location: data.location || '',
      status: data.is_active ? 'active' : 'inactive',
      
      // TR
      features: Array.isArray(data.features_tr) ? data.features_tr : [],
      included: Array.isArray(data.included_tr) ? data.included_tr : [],
      excluded: Array.isArray(data.excluded_tr) ? data.excluded_tr : [],
      itinerary: Array.isArray(data.itinerary_tr) ? data.itinerary_tr : [],
      
      // EN
      featuresEN: Array.isArray(data.features_en) ? data.features_en : [],
      includedEN: Array.isArray(data.included_en) ? data.included_en : [],
      excludedEN: Array.isArray(data.excluded_en) ? data.excluded_en : [],
      itineraryEN: Array.isArray(data.itinerary_en) ? data.itinerary_en : [],
      
      // RU
      featuresRU: Array.isArray(data.features_ru) ? data.features_ru : [],
      includedRU: Array.isArray(data.included_ru) ? data.included_ru : [],
      excludedRU: Array.isArray(data.excluded_ru) ? data.excluded_ru : [],
      itineraryRU: Array.isArray(data.itinerary_ru) ? data.itinerary_ru : [],
      
      // AZ
      featuresAZ: Array.isArray(data.features_az) ? data.features_az : [],
      includedAZ: Array.isArray(data.included_az) ? data.included_az : [],
      excludedAZ: Array.isArray(data.excluded_az) ? data.excluded_az : [],
      itineraryAZ: Array.isArray(data.itinerary_az) ? data.itinerary_az : []
    });
  }
  setLoading(false);
}
   
  // Alan değişimi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'capacity' ? Number(value) : value }));
  };

  // Form submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    title_tr: formData.title,
    title_en: formData.titleEN,
    title_ru: formData.titleRU,
    title_az: formData.titleAZ,
    description_tr: formData.description,
    description_en: formData.descriptionEN,
    description_ru: formData.descriptionRU,
    description_az: formData.descriptionAZ,
    category: formData.category,
    price: String(formData.price),
    duration: formData.duration,
    max_group: Number(formData.capacity),
    image: formData.image,
    images: formData.images || [],  // ✅ Çoklu görseller
    location: formData.location,
    is_active: formData.status === 'active',
    
    features_tr: formData.features.filter(f => f.trim() !== ''),
    included_tr: formData.included.filter(i => i.trim() !== ''),
    excluded_tr: formData.excluded.filter(e => e.trim() !== ''),
    itinerary_tr: formData.itinerary.filter(d => d.title.trim() !== '' || d.description.trim() !== ''),
    
    features_en: formData.featuresEN.filter(f => f.trim() !== ''),
    included_en: formData.includedEN.filter(i => i.trim() !== ''),
    excluded_en: formData.excludedEN.filter(e => e.trim() !== ''),
    itinerary_en: formData.itineraryEN.filter(d => d.title.trim() !== '' || d.description.trim() !== ''),
    
    features_ru: formData.featuresRU.filter(f => f.trim() !== ''),
    included_ru: formData.includedRU.filter(i => i.trim() !== ''),
    excluded_ru: formData.excludedRU.filter(e => e.trim() !== ''),
    itinerary_ru: formData.itineraryRU.filter(d => d.title.trim() !== '' || d.description.trim() !== ''),
    
    features_az: formData.featuresAZ.filter(f => f.trim() !== ''),
    included_az: formData.includedAZ.filter(i => i.trim() !== ''),
    excluded_az: formData.excludedAZ.filter(e => e.trim() !== ''),
    itinerary_az: formData.itineraryAZ.filter(d => d.title.trim() !== '' || d.description.trim() !== '')
  };

  console.log('Payload:', payload);

  try {
    let result;
    
    // ✅ EDIT MODE KONTROLÜ
    if (id) {
      // UPDATE - Mevcut turu güncelle
      result = await supabase
        .from('tours')
        .update(payload)
        .eq('id', id);
      
      if (result.error) {
        console.error('Update hatası:', result.error);
        alert(result.error.message || 'Güncelleme sırasında bir hata oluştu.');
      } else {
        alert('Tur başarıyla güncellendi! ✅');
        navigate('/admin/tours');
      }
    } else {
      // INSERT - Yeni tur ekle
      result = await supabase
        .from('tours')
        .insert([payload]);
      
      if (result.error) {
        console.error('Insert hatası:', result.error);
        alert(result.error.message || 'Tur eklenirken bir hata oluştu.');
      } else {
        alert('Tur başarıyla eklendi! ✅');
        navigate('/admin/tours');
      }
    }
  } catch (err) {
    console.error('Submit hatası:', err);
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Türkçe İçerik</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tur Başlığı (TR) *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Örn: Gobustan & Mud Volcanoes Tour" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (TR) *</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Turun detaylı açıklaması..." 
          />
        </div>
      </div>

      {/* ÖNE ÇIKAN ÖZELLİKLER (TR) */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Öne Çıkan Özellikler (TR)</h2>
        {formData.features.map((feature, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newFeatures = [...formData.features];
                newFeatures[idx] = e.target.value;
                setFormData(prev => ({ ...prev, features: newFeatures }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Örn: Profesyonel rehber"
            />
            <button
              type="button"
              onClick={() => {
                const newFeatures = formData.features.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, features: newFeatures }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Özellik Ekle
        </button>
      </div>

      {/* DAHİL OLANLAR (TR) */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dahil Olanlar (TR)</h2>
        {formData.included.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newIncluded = [...formData.included];
                newIncluded[idx] = e.target.value;
                setFormData(prev => ({ ...prev, included: newIncluded }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Örn: Otel transferi"
            />
            <button
              type="button"
              onClick={() => {
                const newIncluded = formData.included.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, included: newIncluded }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, included: [...prev.included, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Ekle
        </button>
      </div>

      {/* DAHİL OLMAYANLAR (TR) */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dahil Olmayanlar (TR)</h2>
        {formData.excluded.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newExcluded = [...formData.excluded];
                newExcluded[idx] = e.target.value;
                setFormData(prev => ({ ...prev, excluded: newExcluded }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Örn: Kişisel harcamalar"
            />
            <button
              type="button"
              onClick={() => {
                const newExcluded = formData.excluded.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, excluded: newExcluded }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, excluded: [...prev.excluded, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Ekle
        </button>
      </div>

      {/* GÜNLÜK PROGRAM (TR) */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Günlük Program (TR)</h2>
        {formData.itinerary.map((day, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Gün {idx + 1}</h3>
              <button
                type="button"
                onClick={() => {
                  const newItinerary = formData.itinerary.filter((_, i) => i !== idx);
                  setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Sil
              </button>
            </div>
            <input
              type="text"
              value={day.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newItinerary = [...formData.itinerary];
                newItinerary[idx].title = e.target.value;
                setFormData(prev => ({ ...prev, itinerary: newItinerary }));
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Gün başlığı (Örn: Bakü Şehir Turu)"
            />
            <textarea
              value={day.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newItinerary = [...formData.itinerary];
                newItinerary[idx].description = e.target.value;
                setFormData(prev => ({ ...prev, itinerary: newItinerary }));
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Günün açıklaması..."
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, itinerary: [...prev.itinerary, { title: '', description: '' }] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Gün Ekle
        </button>
      </div>
    </>
  )}

  {/* İngilizce */}
  {activeTab === 'en' && (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">English Content</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tour Title (EN) *</label>
          <input 
            type="text" 
            name="titleEN" 
            value={formData.titleEN} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g: Gobustan & Mud Volcanoes Tour" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN) *</label>
          <textarea 
            name="descriptionEN" 
            value={formData.descriptionEN} 
            onChange={handleChange} 
            required 
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed tour description..." 
          />
        </div>
      </div>

      {/* Features EN */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Features (EN)</h2>
        {formData.featuresEN.map((feature, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={feature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newFeatures = [...formData.featuresEN];
                newFeatures[idx] = e.target.value;
                setFormData(prev => ({ ...prev, featuresEN: newFeatures }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="e.g: Professional guide"
            />
            <button type="button" onClick={() => {
                const newFeatures = formData.featuresEN.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, featuresEN: newFeatures }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
        <button type="button"
          onClick={() => setFormData(prev => ({ ...prev, featuresEN: [...prev.featuresEN, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Feature
        </button>
      </div>

      {/* Included EN */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Included (EN)</h2>
        {formData.includedEN.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input type="text" value={item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newIncluded = [...formData.includedEN];
                newIncluded[idx] = e.target.value;
                setFormData(prev => ({ ...prev, includedEN: newIncluded }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="e.g: Hotel transfer"
            />
            <button type="button" onClick={() => {
                const newIncluded = formData.includedEN.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, includedEN: newIncluded }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
        <button type="button"
          onClick={() => setFormData(prev => ({ ...prev, includedEN: [...prev.includedEN, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add
        </button>
      </div>

      {/* Excluded EN */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Excluded (EN)</h2>
        {formData.excludedEN.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input type="text" value={item}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newExcluded = [...formData.excludedEN];
                newExcluded[idx] = e.target.value;
                setFormData(prev => ({ ...prev, excludedEN: newExcluded }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="e.g: Personal expenses"
            />
            <button type="button" onClick={() => {
                const newExcluded = formData.excludedEN.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, excludedEN: newExcluded }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
        <button type="button"
          onClick={() => setFormData(prev => ({ ...prev, excludedEN: [...prev.excludedEN, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add
        </button>
      </div>

      {/* Itinerary EN */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary (EN)</h2>
        {formData.itineraryEN.map((day, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Day {idx + 1}</h3>
              <button type="button"
                onClick={() => {
                  const newItinerary = formData.itineraryEN.filter((_, i) => i !== idx);
                  setFormData(prev => ({ ...prev, itineraryEN: newItinerary }));
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                Delete
              </button>
            </div>
            <input type="text" value={day.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newItinerary = [...formData.itineraryEN];
                newItinerary[idx].title = e.target.value;
                setFormData(prev => ({ ...prev, itineraryEN: newItinerary }));
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Day title (e.g: Baku City Tour)"
            />
            <textarea value={day.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const newItinerary = [...formData.itineraryEN];
                newItinerary[idx].description = e.target.value;
                setFormData(prev => ({ ...prev, itineraryEN: newItinerary }));
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Day description..."
            />
          </div>
        ))}
        <button type="button"
          onClick={() => setFormData(prev => ({ ...prev, itineraryEN: [...prev.itineraryEN, { title: '', description: '' }] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Day
        </button>
      </div>
    </>
  )}

  {/* Rusça */}
  {activeTab === 'ru' && (
    <>
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

      {/* Features RU - tekrar eden yapı */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Особенности (RU)</h2>
        {formData.featuresRU.map((feature, idx) => (
          <div key={idx} className="flex gap-2">
            <input type="text" value={feature}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newFeatures = [...formData.featuresRU];
                newFeatures[idx] = e.target.value;
                setFormData(prev => ({ ...prev, featuresRU: newFeatures }));
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Например: Профессиональный гид"
            />
            <button type="button" onClick={() => {
                const newFeatures = formData.featuresRU.filter((_, i) => i !== idx);
                setFormData(prev => ({ ...prev, featuresRU: newFeatures }));
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Удалить
            </button>
          </div>
        ))}
        <button type="button"
          onClick={() => setFormData(prev => ({ ...prev, featuresRU: [...prev.featuresRU, ''] }))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Добавить
        </button>
      </div>

      {/* Included, Excluded, Itinerary RU - aynı mantık */}
      {/* includedRU, excludedRU, itineraryRU alanları için yukarıdaki gibi tekrarla */}
    </>
  )}

  {/* Azerice */}
  {activeTab === 'az' && (
    <>
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

      {/* featuresAZ, includedAZ, excludedAZ, itineraryAZ - aynı mantık */}
    </>
  )}

  {/* Genel Bilgiler */}
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
        <select name="category" value={formData.category} onChange={handleChange} required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
          {categoryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($) *</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="45" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Süre *</label>
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="6 hours" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kapasite *</label>
        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="15" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Lokasyon *</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Baku" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
        <select name="status" value={formData.status} onChange={handleChange} required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>
    </div>
  </div>

  {/* Görseller */}
  {/* Kapak Görseli (TEK) */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
  {formData.image && (
    <img src={formData.image} alt="Kapak" className="w-full max-w-xs mb-3 rounded-lg shadow" />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '');
      const timestamp = Date.now();
      const finalName = `${timestamp}_${safeName}`;
      const uploadResult = await supabase.storage.from('gallery').upload(finalName, file);
      if (uploadResult.error) {
        alert('Yükleme hatası: ' + uploadResult.error.message);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from('gallery').getPublicUrl(finalName);
      const publicUrl = data?.publicUrl;
      if (!publicUrl) {
        alert('Görsel için public URL alınamadı.');
        setUploading(false);
        return;
      }
      setFormData(prev => ({ ...prev, image: publicUrl }));
      setUploading(false);
    }}
    disabled={uploading}
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
  {uploading && <div className="text-blue-600 mt-2">Yükleniyor...</div>}

  <div className="my-3">
    <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => setGalleryOpen(true)}>
      Galeriden Seç
    </button>
  </div>

  {galleryOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-lg max-h-[80vh] overflow-auto shadow-2xl relative">
        <div className="flex justify-between mb-3 items-center">
          <div className="font-bold text-lg">Galeriden Görsel Seç</div>
          <button type="button" className="text-gray-400 hover:text-gray-600 text-2xl"
            onClick={() => setGalleryOpen(false)}>
            ×
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.map((img) => (
            <img key={img.name} src={img.url}
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

{/* ✅ YENİ - ÇOKLU GÖRSELLER */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Tur Görselleri (Çoklu) - Ana sayfada gösterilecek
  </label>
  
  {/* Mevcut görselleri göster */}
  <div className="grid grid-cols-3 gap-3 mb-4">
    {formData.images?.map((imgUrl, index) => (
      <div key={index} className="relative group">
        <img 
          src={imgUrl} 
          alt={`Görsel ${index + 1}`} 
          className="w-full h-24 object-cover rounded-lg shadow"
        />
        <button
          type="button"
          onClick={() => {
            const newImages = formData.images?.filter((_, i) => i !== index);
            setFormData({ ...formData, images: newImages });
          }}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ×
        </button>
      </div>
    ))}
  </div>

  {/* Çoklu görsel yükleme */}
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '');
        const timestamp = Date.now() + Math.random();
        const finalName = `${timestamp}_${safeName}`;
        
        const uploadResult = await supabase.storage.from('gallery').upload(finalName, file);
        if (uploadResult.error) {
          console.error('Yükleme hatası:', uploadResult.error);
          continue;
        }
        
        const { data } = supabase.storage.from('gallery').getPublicUrl(finalName);
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setFormData(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), ...uploadedUrls] 
      }));
      setUploading(false);
    }}
    disabled={uploading}
    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
  />
  {uploading && <div className="text-green-600 mt-2">Görseller yükleniyor...</div>}

  <div className="my-3">
    <button 
      type="button" 
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      onClick={() => setMultiGalleryOpen(true)}
    >
      Galeriden Çoklu Seç
    </button>
  </div>

  {/* Çoklu galeri modal */}
  {multiGalleryOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-2xl max-h-[80vh] overflow-auto shadow-2xl relative">
        <div className="flex justify-between mb-3 items-center">
          <div className="font-bold text-lg">Galeriden Çoklu Seç</div>
          <button 
            type="button" 
            className="text-gray-400 hover:text-gray-600 text-2xl"
            onClick={() => setMultiGalleryOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((img) => (
            <img 
              key={img.name} 
              src={img.url}
              onClick={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  images: [...(prev.images || []), img.url] 
                }));
              }}
              className="w-full h-24 object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-green-600"
              alt={img.name}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setMultiGalleryOpen(false)}
          className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Tamam
        </button>
      </div>
    </div>
  )}
</div>


  {/* Submit Buttons */}
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex gap-4">
      <button type="submit" disabled={loading}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
        {isEditMode ? '✓ Değişiklikleri Kaydet' : '+ Tur Ekle'}
      </button>
      <button type="button" onClick={() => navigate('/admin/tours')}
        className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
        İptal
      </button>
    </div>
  </div>
</form>

    </div>
  );
}
