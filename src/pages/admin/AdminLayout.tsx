// src/pages/admin/AdminLayout.tsx
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MenuItem {
  name: string;
  path?: string;
  icon: string;
  submenu?: { name: string; path: string; icon: string }[];
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Turlar', path: '/admin/tours', icon: '🗺️' },
    { name: 'Rezervasyonlar', path: '/admin/bookings', icon: '📅' },
    { name: 'Müşteriler', path: '/admin/customers', icon: '👥' },
    { name: 'Blog', path: '/admin/blog', icon: '📝' },
    { name: 'Kategoriler', path: '/admin/categories', icon: '📁' },
    { name: 'Çeviriler', path: '/admin/translations', icon: '🌐' },
    { 
      name: 'Sayfalar', 
      icon: '📄',
      submenu: [
        { name: 'Ana Sayfa', path: '/admin/pages/home', icon: '🏠' },
        { name: 'Hakkımızda', path: '/admin/pages/about', icon: 'ℹ️' },
        { name: 'İletişim', path: '/admin/pages/contact', icon: '📞' },
      ]
    },
    { name: 'Yorumlar', path: '/admin/reviews', icon: '⭐' },
    { name: 'Galeri', path: '/admin/gallery', icon: '🖼️' },
    { name: 'Mesajlar', path: '/admin/messages', icon: '💬' },
    { name: 'Ayarlar', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const isSubmenuActive = (submenu: { name: string; path: string; icon: string }[]) => {
    return submenu.some(item => location.pathname.startsWith(item.path));
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">
              🏔️
            </div>
            <div>
              <h1 className="text-xl font-bold">Beyond Baku</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {/* Main Menu Item */}
                {item.submenu ? (
                  // Dropdown menu
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                        isSubmenuActive(item.submenu)
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {openSubmenu === item.name ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Submenu */}
                    {openSubmenu === item.name && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                              isActive(subItem.path)
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{subItem.icon}</span>
                            <span className="font-medium">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    to={item.path!}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path!)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@beyondbaku.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">☰</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Beyond Baku Admin</h2>
          <div className="w-10"></div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
