import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../../services/blogService';
import { useToast } from '../../../contexts/ToastContext';

interface BlogPost {
  id: string;
  title_az: string;
  title_en: string;
  title_ru: string;
  excerpt_az: string;
  excerpt_en: string;
  excerpt_ru: string;
  created_at: string;
  status: 'published' | 'draft';
  views: number;
  category: string;
  image: string;
  author: string;
  slug: string;
}

export default function ContentManager() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await blogService.getAll();
      setPosts(data || []);
    } catch (err: any) {
      showToast('Bloglar yüklenemedi!','error');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;
    try {
      await blogService.delete(id);
      showToast('Blog yazısı silindi!', 'success');
      loadPosts();
    } catch (err: any) {
      showToast('Silinemedi: ' + (err.message || err), 'error');
    }
  }

  async function toggleStatus(post: BlogPost) {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await blogService.update(post.id, { status: newStatus });
      showToast('Durum güncellendi!','info');
      loadPosts();
    } catch (err: any) {
      showToast('Durum değiştirilemedi: ' + (err.message || err), 'error');
    }
  }

  const filteredPosts = posts.filter(post => {
    const langTitle = post.title_az || post.title_en || post.title_ru || '';
    const matchesSearch = langTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
          <p className="text-gray-600 mt-1">Blog yazılarını yönetin</p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Yeni Yazı Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">📝</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam Yazı</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
          <p className="text-sm text-gray-600">Yayında</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-2xl font-bold text-orange-600">{stats.draft}</p>
          <p className="text-sm text-gray-600">Taslak</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">👁️</div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Toplam Görüntüleme</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Blog ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({stats.total})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yayında ({stats.published})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Taslak ({stats.draft})
            </button>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Yükleniyor...</div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title_az || post.title_en || 'Blog'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {post.title_az || post.title_en || post.title_ru}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.excerpt_az || post.excerpt_en || post.excerpt_ru}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 flex-shrink-0 ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {post.status === 'published' ? '✅ Yayında' : '📄 Taslak'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>📁 {post.category}</span>
                    <span>👤 {post.author || '—'}</span>
                    <span>📅 {post.created_at && new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                    <span>👁️ {(post.views || 0).toLocaleString()} görüntüleme</span>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                    >
                      👁️ Önizle
                    </button>
                    <button
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                      onClick={() => toggleStatus(post)}
                    >
                      {post.status === 'published' ? '📄 Taslağa Al' : '✅ Yayınla'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
