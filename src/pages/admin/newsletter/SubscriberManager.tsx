import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Copy, Trash2, Download } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

// Modern, csv export, badge ve toplu silmeli
export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    if (!error && data) setSubscribers(data);
    setLoading(false);
    setSelected([]);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Kaydı silmek istediğine emin misin?')) return;
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    loadSubscribers();
  }

  async function handleBulkDelete() {
    if (!window.confirm('Seçili kayıtları silmek istediğinize emin misiniz?')) return;
    await supabase.from('newsletter_subscribers').delete().in('id', selected);
    loadSubscribers();
  }

  function handleCopy(email: string) {
    navigator.clipboard.writeText(email);
  }

  function handleExportCSV() {
    let csv =
      'E-posta,Kayıt Tarihi\n' +
      filtered.map((s) =>
        `"${s.email}","${new Date(s.subscribed_at).toLocaleString('tr-TR').replace(/"/g, '""')}"`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aboneler_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(filter.toLowerCase()));

  function toggleSelect(id: string) {
    setSelected(selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]);
  }
  function selectAllCurrentPage(val: boolean) {
    if (val) setSelected(filtered.map(s => s.id));
    else setSelected([]);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
        <div className="flex gap-3 items-center">
          <h1 className="text-2xl font-bold">E-bülten Aboneleri</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold shadow">{subscribers.length} abone</span>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="bg-green-50 border border-green-600 text-green-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-100">
            <Download className="w-4 h-4" /> CSV indir
          </button>
          {selected.length > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-50 border border-red-600 text-red-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100">
              <Trash2 className="w-4 h-4" /> {selected.length} seçiliyi sil
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Mail adresinde ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border shadow focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Yükleniyor...</div>
      ) : subscribers.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          Henüz kimse abone olmadı.<br />Site üzerindeki formdan ilk kayıtlar gelince burada göreceksiniz.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.length === filtered.length}
                    onChange={e => selectAllCurrentPage(e.target.checked)}
                  />
                </th>
                <th className="py-3 px-4 text-left">E-posta</th>
                <th className="py-3 px-4 text-left">Kayıt Tarihi</th>
                <th className="py-3 px-4 text-center">Kopyala</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="group">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-mono font-semibold tracking-wider shadow-sm border border-blue-200">
                      {s.email}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-400">{new Date(s.subscribed_at).toLocaleString('tr-TR')}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleCopy(s.email)}
                      className="border px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-200 hover:text-blue-700 transition text-blue-600"
                      title="Maili panoya kopyala"
                    >
                      <Copy className="inline-block w-4 h-4" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full transition"
                      onClick={() => handleDelete(s.id)}
                      title="Kalıcı sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">Sonuç yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
