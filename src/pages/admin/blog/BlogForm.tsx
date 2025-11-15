import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { blogService } from '../../../services/blogService';
import { supabase } from '../../../lib/supabase';
import { Category } from '../../../types';
import { imageService } from '../../../services/imageService';

interface BlogFormShape {
  title_az: string;
  title_en: string;
  title_ru: string;
  excerpt_az: string;
  excerpt_en: string;
  excerpt_ru: string;
  content_az: string;
  content_en: string;
  content_ru: string;
  category: string;
  slug: string;
  image: string;
  meta_title_az: string;
  meta_title_en: string;
  meta_title_ru: string;
  meta_description_az: string;
  meta_description_en: string;
  meta_description_ru: string;
  status: 'draft' | 'published';
}

const emptyForm: BlogFormShape = {
  title_az: '',
  title_en: '',
  title_ru: '',
  excerpt_az: '',
  excerpt_en: '',
  excerpt_ru: '',
  content_az: '',
  content_en: '',
  content_ru: '',
  category: '',
  slug: '',
  image: '',
  meta_title_az: '',
  meta_title_en: '',
  meta_title_ru: '',
  meta_description_az: '',
  meta_description_en: '',
  meta_description_ru: '',
  status: 'draft'
};
 
export default function BlogForm() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [galleryImages, setGalleryImages] = useState<{url: string; name: string}[]>([]);
  const [formData, setFormData] = useState<BlogFormShape>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');
  const [activeSection, setActiveSection] = useState<'content' | 'seo'>('content');
  const [uploading, setUploading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  
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

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      setLoading(true);
      blogService.getById(id as string)
        .then(data => setFormData({ ...emptyForm, ...data }))
        .catch(() => showToast('error', 'Blog yazısı bulunamadı'))
        .finally(() => setLoading(false));
    } else {
      setFormData(emptyForm);
    }
    // eslint-disable-next-line
  }, [id]);

  async function fetchCategories() {
    try {
      const data = await blogService.getCategories(); // array of Category
      setCategories(data || []);
    } catch {
      setCategories([]);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (text: string) =>
    text?.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i')
      .replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'title_az' ? generateSlug(value) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await blogService.update(id as string, formData);
        showToast('success', 'Blog yazısı güncellendi!');
      } else {
        await blogService.create(formData);
        showToast('success', 'Blog yazısı eklendi!');
      }
      navigate('/admin/blog');
    } catch (err: any) {
      showToast('error', 'Kayıt sırasında hata: ' + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/blog')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEditMode ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Ekle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-2">
              {(['az', 'en', 'ru'] as const).map(lang => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === lang ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {lang === 'az' && '🇦🇿 Azərbaycan'}
                  {lang === 'en' && '🇬🇧 English'}
                  {lang === 'ru' && '🇷🇺 Русский'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('content')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeSection === 'content' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                📝 İçerik
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('seo')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeSection === 'seo' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                🔍 SEO
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {activeSection === 'content' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab === 'az' ? 'Azərbaycan Dili' : activeTab === 'en' ? 'English' : 'Русский'}
            </h2>

            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'az' ? 'Başlıq (AZ) *' : activeTab === 'en' ? 'Title (EN) *' : 'Заголовок (RU) *'}
              </label>
              <input
                type="text"
                name={`title_${activeTab}`}
                value={formData[`title_${activeTab}`]}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={activeTab === 'az' ? 'Azərbaycanda Gəzilməli 10 Yer' : activeTab === 'en' ? 'Top 10 Places to Visit in Azerbaijan' : '10 мест для посещения...'}
              />
            </div>

            {/* Excerpt (Özet) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'az' ? 'Qısa Mətn (AZ) *' : activeTab === 'en' ? 'Excerpt (EN) *' : 'Краткое описание (RU) *'}
              </label>
              <textarea
                name={`excerpt_${activeTab}`}
                value={formData[`excerpt_${activeTab}`]}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={activeTab === 'az' ? 'Qısa təsvir...' : activeTab === 'en' ? 'Short description...' : 'Краткое описание...'}
              />
            </div>

            {/* İçerik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'az' ? 'Məzmun (AZ) *' : activeTab === 'en' ? 'Content (EN) *' : 'Контент (RU) *'}
              </label>
              <textarea
                name={`content_${activeTab}`}
                value={formData[`content_${activeTab}`]}
                onChange={handleChange}
                required
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder={activeTab === 'az' ? 'Blog yazısının tam içeriği...' : activeTab === 'en' ? 'Full blog content...' : 'Полное содержание блога...'}
              />
            </div>
          </div>
        )}

        {/* SEO Section */}
        {activeSection === 'seo' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {"SEO " + (activeTab === 'az' ? 'Azərbaycan' : activeTab === 'en' ? 'English' : 'Русский')}
            </h2>
            {/* Meta Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                name={`meta_title_${activeTab}`}
                value={formData[`meta_title_${activeTab}`]}
                onChange={handleChange}
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO başlığı..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData[`meta_title_${activeTab}`]?.length ?? 0}/60 karakter</p>
            </div>
            {/* Meta Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                name={`meta_description_${activeTab}`}
                value={formData[`meta_description_${activeTab}`]}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="SEO açıklaması..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData[`meta_description_${activeTab}`]?.length ?? 0}/160 karakter</p>
            </div>
          </div>
        )}

      {/* Gorsel */}
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
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "");
        const timestamp = Date.now();
        const finalName = `${timestamp}_${safeName}`;
        const uploadFile = new File([file], finalName, { type: file.type });
        const publicUrl = await imageService.upload(uploadFile, 'blog-images');
        setFormData(prev => ({ ...prev, image: publicUrl }));
      } catch (err) {
        alert("Yükleme hatası!");
      } finally {
        setUploading(false);
      }
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

  {/* Modal - sadece galleryOpen=true iken görünür */}
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




        {/* Genel Ayarlar */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Ayarlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
               <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Kategori seçiniz</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name_tr}
          </option>
        ))}
      </select>
            </div>
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="azerbaycan-gezilecek-yerler"
              />
            </div>
            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">📄 Taslak</option>
                <option value="published">✅ Yayında</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEditMode ? 'Değişiklikleri Kaydet' : 'Blog Yazısı Ekle'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-8 py-3 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
