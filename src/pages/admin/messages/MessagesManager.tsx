// src/pages/admin/messages/MessagesManager.tsx
import { useState } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export default function MessagesManager() {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+994 50 123 45 67',
      subject: 'Tur hakkında soru',
      message: 'Merhaba, Gobustan turu hakkında bilgi alabilir miyim?',
      date: '2025-11-13',
      status: 'new'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+994 50 234 56 78',
      subject: 'Rezervasyon iptal',
      message: 'Rezervasyonumu iptal etmek istiyorum.',
      date: '2025-11-12',
      status: 'read'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+994 50 345 67 89',
      subject: 'Teşekkür',
      message: 'Harika bir turdu, teşekkür ederim!',
      date: '2025-11-11',
      status: 'replied'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMessages = messages.filter(msg =>
    filterStatus === 'all' || msg.status === filterStatus
  );

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mesaj Yönetimi</h1>
        <p className="text-gray-600 mt-1">İletişim formundan gelen mesajları görüntüleyin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Toplam Mesaj</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">🆕</div>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-sm text-gray-600">Yeni</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="text-3xl mb-2">👁️</div>
          <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
          <p className="text-sm text-gray-600">Okundu</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
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
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {msg.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                  <p className="text-sm text-gray-600">{msg.email}</p>
                  <p className="text-sm text-gray-600">{msg.phone}</p>
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
                  {new Date(msg.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">📌 {msg.subject}</h4>
              <p className="text-gray-700">{msg.message}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                ↩️ Yanıtla
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                ✓ Okundu Olarak İşaretle
              </button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
