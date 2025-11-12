import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUsers, FaMapMarkerAlt, FaCalendar, FaDollarSign, FaEdit, FaCog } from 'react-icons/fa'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    revenue: 0,
    activeTours: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { data: tours } = await supabase.from('tours').select('*')
    const { data: bookings } = await supabase.from('bookings').select('*')
    
    setStats({
      totalTours: tours?.length || 0,
      totalBookings: bookings?.length || 0,
      revenue: bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
      activeTours: tours?.filter(t => t.is_active).length || 0
    })
  }

  const menuItems = [
    { title: 'Turları Yönet', icon: FaMapMarkerAlt, path: '/admin/tours', color: 'from-blue-500 to-blue-700' },
    { title: 'Rezervasyonlar', icon: FaCalendar, path: '/admin/bookings', color: 'from-green-500 to-green-700' },
    { title: 'Site İçerikleri', icon: FaEdit, path: '/admin/content', color: 'from-purple-500 to-purple-700' },
    { title: 'Ayarlar', icon: FaCog, path: '/admin/settings', color: 'from-orange-500 to-orange-700' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Yönetim Paneli</h1>
          <p className="text-gray-600">Hoş geldiniz! İşte sitenizin özeti</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Toplam Tur', value: stats.totalTours, icon: FaMapMarkerAlt, color: 'bg-blue-500' },
            { label: 'Aktif Turlar', value: stats.activeTours, icon: FaMapMarkerAlt, color: 'bg-green-500' },
            { label: 'Rezervasyonlar', value: stats.totalBookings, icon: FaCalendar, color: 'bg-purple-500' },
            { label: 'Gelir', value: `$${stats.revenue}`, icon: FaDollarSign, color: 'bg-orange-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={item.path}
                className={`block bg-gradient-to-br ${item.color} rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition`}
              >
                <item.icon className="text-4xl mb-4" />
                <h3 className="text-xl font-bold">{item.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
