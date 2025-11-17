import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { categoryService } from '../../../services/categoryService';
import type { Category } from '../../../types';

export default function CategoriesManager() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryType, setCategoryType] = useState<'tour_categories' | 'blog_categories'>('tour_categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    name_ru: '',
    name_az: '',
    slug: '',
    icon: '📁',
    description_tr: '',
    description_en: '',
    description_ru: '',
    description_az: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadCategories();
  }, [categoryType]);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await categoryService.getAll(categoryType);
      setCategories(data);
    } catch {
      showToast('Kategoriler yüklenemedi!','error', );
    }
    setLoading(false);
  }

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'name_en' ? generateSlug(value) : prev.slug
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await categoryService.update(categoryType, editingCategory.id, { ...formData });
        showToast('success', 'Kategori başarıyla güncellendi!');
      } else {
        const order_num = categories.length + 1;
        await categoryService.create(categoryType, { ...formData, order_num, status: formData.status });
        showToast('success', 'Yeni kategori başarıyla eklendi!');
      }
      setShowAddModal(false);
      setEditingCategory(null);
      resetForm();
      await loadCategories();
    } catch (err: any) {
      showToast('error', 'Kayıt sırasında hata: ' + (err.message || err));
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      setLoading(true);
      try {
        await categoryService.delete(categoryType, id);
        showToast('success', 'Kategori başarıyla silindi!');
        await loadCategories();
      } catch (err: any) {
        showToast('error', 'Silinemedi: ' + (err.message || err));
      }
      setLoading(false);
    }
  }

  async function toggleStatus(id: string) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    await categoryService.update(categoryType, id, {
      status: category.status === 'active' ? 'inactive' : 'active'
    });
    showToast('info', 'Kategori durumu güncellendi!');
    loadCategories();
  }

  const resetForm = () => {
    setFormData({
      name_tr: '',
      name_en: '',
      name_ru: '',
      name_az: '',
      slug: '',
      icon: '📁',
      description_tr: '',
      description_en: '',
      description_ru: '',
      description_az: '',
      status: 'active'
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_tr: category.name_tr ?? '',
      name_en: category.name_en ?? '',
      name_ru: category.name_ru ?? '',
      name_az: category.name_az ?? '',
      slug: category.slug ?? '',
      icon: category.icon ?? '📁',
      description_tr: category.description_tr ?? '',
      description_en: category.description_en ?? '',
      description_ru: category.description_ru ?? '',
      description_az: category.description_az ?? '',
      status: category.status ?? 'active'
    });
    setShowAddModal(true);
  };

  const iconOptions = ['📁', '🏔️', '🏙️', '🌲', '🏛️', '📍', '🍽️', '🎨', '🎭', '🏖️', '⛰️', '🌊'];

  return (
    <div className="p-6 space-y-6">
      {/* Kategori türü seç */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryType('tour_categories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryType === 'tour_categories' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🧭 Tur Kategorileri
          </button>
          <button
            onClick={() => setCategoryType('blog_categories')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryType === 'blog_categories' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Blog Kategorileri
          </button>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowAddModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Kategori Ekle
        </button>
      </div>

      {/* Kategori listesi */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İkon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad (TR)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category, i) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-bold">{i + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-3xl">{category.icon}</span>
                </td>
                <td className="px-6 py-4">{category.name_tr}</td>
                <td className="px-6 py-4">{category.name_en}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(category.id)}
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.status === 'active' ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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

      {/* Add/Edit Modal */}
     {showAddModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </h2>
        <button
          onClick={() => {
            setShowAddModal(false);
            setEditingCategory(null);
            resetForm();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kategori Tipi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Tipi *</label>
          <select
            value={categoryType}
            onChange={e => setCategoryType(e.target.value as 'tour_categories' | 'blog_categories')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            required
          >
            <option value="tour_categories">Tur Kategorisi</option>
            <option value="blog_categories">Blog Kategorisi</option>
          </select>
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad (TR) *</label>
                <input
                  type="text"
                  name="name_tr"
                  value={formData.name_tr}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Türkçe kategori adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (EN) *</label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="English category name"
                />
              </div>
              {/* Diğer alanlar için aynı şekilde snake_case kullan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad (AZ)</label>
                <input
                  type="text"
                  name="name_az"
                  value={formData.name_az}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Azerbaycan kategorisi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad (RU)</label>
                <input
                  type="text"
                  name="name_ru"
                  value={formData.name_ru}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Rusça kategori adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon *</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (TR)</label>
                <textarea
                  name="description_tr"
                  value={formData.description_tr}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Açıklama (TR)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Description (EN)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (AZ)</label>
                <textarea
                  name="description_az"
                  value={formData.description_az}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Açıklama (AZ)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (RU)</label>
                <textarea
                  name="description_ru"
                  value={formData.description_ru}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Açıklama (RU)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
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
