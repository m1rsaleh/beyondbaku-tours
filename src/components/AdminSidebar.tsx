import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaMapMarkerAlt, FaCalendar, FaEdit, FaCog } from 'react-icons/fa'

export default function AdminSidebar() {
  const location = useLocation()

  const menuItems = [
    { title: 'Dashboard', icon: FaHome, path: '/admin' },
    { title: 'Turlar', icon: FaMapMarkerAlt, path: '/admin/tours' },
    { title: 'Rezervasyonlar', icon: FaCalendar, path: '/admin/bookings' },
    { title: 'İçerik', icon: FaEdit, path: '/admin/content' },
    { title: 'Ayarlar', icon: FaCog, path: '/admin/settings' }
  ]

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-6">
      <div className="text-white text-2xl font-bold mb-8">BeyondBaku</div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <item.icon />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
