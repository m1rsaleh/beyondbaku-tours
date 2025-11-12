import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface BookingFormProps {
  tourId: string
  price: number
}

export default function BookingForm({ tourId, price }: BookingFormProps) {
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    tour_date: '',
    guests: 1,
    special_requests: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('bookings').insert({
      tour_id: tourId,
      ...form,
      total_price: price * form.guests
    })

    if (error) {
      alert('Hata: ' + error.message)
    } else {
      setSuccess(true)
      setForm({ customer_name: '', email: '', phone: '', tour_date: '', guests: 1, special_requests: '' })
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Rezervasyon Alındı! ✓</h3>
        <p className="text-gray-600">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Rezervasyon Yap</h3>
      
      <input
        type="text"
        placeholder="Adınız Soyadınız"
        required
        value={form.customer_name}
        onChange={(e) => setForm({...form, customer_name: e.target.value})}
        className="w-full mb-3 px-4 py-2 border rounded"
      />
      
      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
        className="w-full mb-3 px-4 py-2 border rounded"
      />
      
      <input
        type="tel"
        placeholder="Telefon"
        required
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
        className="w-full mb-3 px-4 py-2 border rounded"
      />
      
      <input
        type="date"
        required
        value={form.tour_date}
        onChange={(e) => setForm({...form, tour_date: e.target.value})}
        className="w-full mb-3 px-4 py-2 border rounded"
      />
      
      <input
        type="number"
        min="1"
        max="12"
        placeholder="Kişi Sayısı"
        value={form.guests}
        onChange={(e) => setForm({...form, guests: parseInt(e.target.value)})}
        className="w-full mb-3 px-4 py-2 border rounded"
      />
      
      <textarea
        placeholder="Özel İstekler (opsiyonel)"
        value={form.special_requests}
        onChange={(e) => setForm({...form, special_requests: e.target.value})}
        className="w-full mb-3 px-4 py-2 border rounded h-20"
      />
      
      <div className="text-xl font-bold mb-4">
        Toplam: ${price * form.guests}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400"
      >
        {loading ? 'Gönderiliyor...' : 'Rezervasyon Yap'}
      </button>
    </form>
  )
}
