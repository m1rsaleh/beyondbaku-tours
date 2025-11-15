// Modern ve geliştirilmiş Dashboard.tsx
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  avgRating: number;
  pendingReviews: number;
}

interface ChartData {
  name: string;
  bookings: number;
  revenue: number;
}

interface Activity {
  id: string;
  type: 'booking' | 'review' | 'tour' | 'user';
  message: string;
  time: string;
  user: string;
}

interface PopularTour {
  name: string;
  bookings: number;
  revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    avgRating: 0,
    pendingReviews: 0
  });

  const [chartData] = useState<ChartData[]>([
    { name: 'Oca', bookings: 45, revenue: 2400 },
    { name: 'Şub', bookings: 52, revenue: 2800 },
    { name: 'Mar', bookings: 61, revenue: 3200 },
    { name: 'Nis', bookings: 58, revenue: 3100 },
    { name: 'May', bookings: 70, revenue: 3800 },
    { name: 'Haz', bookings: 85, revenue: 4500 },
    { name: 'Tem', bookings: 95, revenue: 5200 },
  ]);

  const [popularTours] = useState<PopularTour[]>([
    { name: 'Gobustan & Mud Volcanoes', bookings: 234, revenue: 10530 },
    { name: 'Baku City Tour', bookings: 189, revenue: 6615 },
    { name: 'Gabala Adventure', bookings: 156, revenue: 7020 },
    { name: 'Sheki Culture Tour', bookings: 142, revenue: 6390 },
  ]);

  const [recentActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'booking',
      message: 'Gobustan Tour için yeni rezervasyon',
      time: '5 dakika önce',
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'review',
      message: 'Baku City Tour için 5 yıldız aldı',
      time: '15 dakika önce',
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'tour',
      message: 'Yeni tur eklendi: Shamakhi Wine Tour',
      time: '1 saat önce',
      user: 'Admin'
    },
    {
      id: '4',
      type: 'user',
      message: 'Yeni kullanıcı kaydı',
      time: '2 saat önce',
      user: 'Mike Johnson'
    }
  ]);

  useEffect(() => {
    // API'den verileri çek
    setStats({
      totalTours: 24,
      totalBookings: 487,
      totalRevenue: 52480,
      activeUsers: 342,
      avgRating: 4.7,
      pendingReviews: 12
    });
  }, []);

  const statCards = [
    {
      title: 'Toplam Turlar',
      value: stats.totalTours,
      change: '+12%',
      trend: 'up',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Rezervasyonlar',
      value: stats.totalBookings,
      change: '+23%',
      trend: 'up',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Toplam Gelir',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: stats.activeUsers,
      change: '-3%',
      trend: 'down',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Beyond Baku Admin Panel'e hoş geldiniz 👋</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Son güncelleme</p>
            <p className="text-xs text-gray-500">Bugün, {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gelir Trendi</h2>
              <p className="text-sm text-gray-600 mt-1">Son 7 aylık gelir analizi</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Son 7 Ay</option>
              <option>Son 30 Gün</option>
              <option>Bu Yıl</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Tours */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Popüler Turlar</h2>
          <div className="space-y-4">
            {popularTours.map((tour, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {tour.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{tour.bookings}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${(tour.bookings / popularTours[0].bookings) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">${tour.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Son Aktiviteler</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Tümünü Gör
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'booking' ? 'bg-blue-100' :
                  activity.type === 'review' ? 'bg-yellow-100' :
                  activity.type === 'tour' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'booking' ? <Calendar className="w-5 h-5 text-blue-600" /> :
                   activity.type === 'review' ? <Star className="w-5 h-5 text-yellow-600" /> :
                   activity.type === 'tour' ? <MapPin className="w-5 h-5 text-green-600" /> :
                   <Users className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Ortalama
              </span>
            </div>
            <h3 className="text-4xl font-bold mb-2">{stats.avgRating}</h3>
            <p className="text-blue-100">Müşteri Memnuniyeti</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                Beklemede
              </span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.pendingReviews}</h3>
            <p className="text-gray-600">Onay Bekleyen Yorum</p>
            <button className="mt-4 w-full py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm">
              İncele
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
