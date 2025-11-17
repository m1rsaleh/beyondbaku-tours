import { useState, useEffect } from 'react';
import { Trash2, Mail, CheckCircle, Eye, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

// Modal Component
function MessageModal({ message, onClose }: { message: Message | null; onClose: () => void }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Mesaj Detayı</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          {/* Sender Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl flex-shrink-0">
              {message.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
              <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline text-sm">
                {message.email}
              </a>
              {message.phone && (
                <p className="text-gray-600 text-sm mt-1">📱 {message.phone}</p>
              )}
              <p className="text-gray-500 text-xs mt-2">
                📅 {new Date(message.created_at).toLocaleString('tr-TR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
              message.status === 'new' ? 'bg-blue-100 text-blue-700' :
              message.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {message.status === 'new' ? '🆕 Yeni' :
               message.status === 'read' ? '👁️ Okundu' : '✅ Yanıtlandı'}
            </span>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Konu</label>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-900 font-medium">📌 {message.subject}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mesaj</label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email ile Yanıtla
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesManager() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Mesajlar yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMessageStatus(id: string, status: 'new' | 'read' | 'replied') {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // ✅ OTOMATIK YENİLEME
      await loadMessages();
      showToast('Durum güncellendi!', 'success');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      showToast('Güncelleme başarısız!', 'error');
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // ✅ OTOMATIK YENİLEME
      await loadMessages();
      showToast('Mesaj silindi!', 'success');
    } catch (error) {
      console.error('Silme hatası:', error);
      showToast('Silme başarısız!', 'error');
    }
  }

  const filteredMessages = messages.filter(msg =>
    filterStatus === 'all' || msg.status === filterStatus
  );

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length
  };

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
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mesaj Yönetimi</h1>
          <p className="text-gray-600 mt-1">İletişim formundan gelen mesajları görüntüleyin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Toplam Mesaj</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <div className="text-3xl mb-2">🆕</div>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            <p className="text-sm text-gray-600">Yeni</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <div className="text-3xl mb-2">👁️</div>
            <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
            <p className="text-sm text-gray-600">Okundu</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            <p className="text-sm text-gray-600">Yanıtlandı</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yeni ({stats.new})
            </button>
            <button
              onClick={() => setFilterStatus('read')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'read'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Okundu ({stats.read})
            </button>
            <button
              onClick={() => setFilterStatus('replied')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === 'replied'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yanıtlandı ({stats.replied})
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">Henüz mesaj yok</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                      <p className="text-sm text-gray-600">{msg.email}</p>
                      {msg.phone && <p className="text-sm text-gray-600">{msg.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold inline-block mb-2 ${
                      msg.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      msg.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {msg.status === 'new' ? '🆕 Yeni' :
                       msg.status === 'read' ? '👁️ Okundu' : '✅ Yanıtlandı'}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(msg.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">📌 {msg.subject}</h4>
                  <p className="text-gray-700 line-clamp-2">{msg.message}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Detay
                  </button>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Yanıtla
                  </a>
                  <button
                    onClick={() => updateMessageStatus(msg.id, 'read')}
                    className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Okundu
                  </button>
                  <button
                    onClick={() => updateMessageStatus(msg.id, 'replied')}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Yanıtlandı
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
