// src/pages/admin/gallery/GalleryManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase'; // kendi import yolunu kullan
import { imageService } from '../../../services/imageService';

interface Media {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
}

export default function GalleryManager() {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);

  // Gallery bucket'taki dosyaları listele
  async function fetchMedia() {
    const { data, error } = await supabase.storage.from('gallery').list('');
    if (error) return;
    // Listeyi proper URL'ye çevir
    const items = data?.map((item) => {
      const url = supabase.storage.from('gallery').getPublicUrl(item.name).data.publicUrl;
      const type: 'image' | 'video' = /\.(mp4|webm|mov|avi)$/i.test(item.name) ? 'video' : 'image';

      const size = item.metadata?.size
        ? (item.metadata.size / (1024 * 1024)).toFixed(2) + ' MB'
        : '—';
      return {
        id: item.id || item.name,
        name: item.name,
        url: supabase.storage.from('gallery').getPublicUrl(item.name).data.publicUrl,
        type,
        size,
        uploadedBy: 'Admin',
        uploadedAt: item.updated_at || new Date().toISOString(),
        category: item.name.includes('blog') ? 'Blog' : 'Tours'
      };
    });
    setMedia(items || []);
  }

  useEffect(() => { fetchMedia(); }, []);

  // Yükleme
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "");
      const timestamp = Date.now();
      const finalName = `${timestamp}_${safeName}`;
      const uploadFile = new File([file], finalName, { type: file.type });
      await imageService.upload(uploadFile, 'gallery');
      await fetchMedia();
    } catch (err) {
      alert('Yükleme hatası!');
    } finally {
      setUploading(false);
    }
  }

  // Silme
  async function handleDelete(name: string) {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      await imageService.delete(name, 'gallery');
      await fetchMedia();
    } catch (err) {
      alert('Silme hatası!');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Galeri Yönetimi</h1>
          <p className="text-gray-600 mt-1">Medya dosyalarını yönetin</p>
        </div>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <span className="text-xl">📤</span>
          Dosya Yükle
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... Statlar ... */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">📁</div>
          <p className="text-2xl font-bold text-gray-900">{media.length}</p>
          <p className="text-sm text-gray-600">Toplam Dosya</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="text-2xl font-bold text-blue-600">{media.filter(m => m.type === 'image').length}</p>
          <p className="text-sm text-gray-600">Görsel</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">🎥</div>
          <p className="text-2xl font-bold text-purple-600">{media.filter(m => m.type === 'video').length}</p>
          <p className="text-sm text-gray-600">Video</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">💾</div>
          <p className="text-2xl font-bold text-green-600">{media.reduce((sum, m) => sum + (parseFloat(m.size) || 0), 0).toFixed(1)} MB</p>
          <p className="text-sm text-gray-600">Toplam Boyut</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dosya Yükle</h3>
          <p className="text-gray-600 mb-2">Dosyaları tıklayarak seçin</p>
          <input type="file" accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
          {uploading && <span className="block text-blue-600 mt-2">Yükleniyor...</span>}
        </div>
      </div>

      {/* Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative aspect-video bg-gray-200">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <video src={item.url} className="w-full h-full object-cover" controls />
              )}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                  {item.type === 'image' ? '🖼️' : '🎥'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 text-sm mb-2 truncate">{item.name}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{item.size}</span>
                <span>{item.category}</span>
              </div>
              <div className="flex gap-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                   className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium text-center">
                  👁️ Görüntüle
                </a>
                <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(item.name)}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
