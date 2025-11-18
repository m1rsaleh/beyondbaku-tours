import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  MessageSquare
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { tourService } from '../../services/tourService';
import { bookingService } from '../../services/bookingService';
import { supabase } from '../../lib/supabase';

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
  type: 'booking' | 'review' | 'tour';
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

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [popularTours, setPopularTours] = useState<PopularTour[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // 1. Turlar
      const tours = await tourService.getAllTours();
      
      // 2. Rezervasyonlar
      const bookings = await bookingService.getAllBookings();
      
      // 3. Yorumlar
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*');

      // İstatistikleri hesapla
      const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
      const uniqueCustomers = new Set(bookings.map(b => b.email)).size;
      const avgRating = reviews && reviews.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
        : 0;
      const pendingReviews = reviews?.filter((r: any) => r.status === 'pending').length || 0;

      setStats({
        totalTours: tours.length,
        totalBookings: bookings.length,
        totalRevenue,
        activeUsers: uniqueCustomers,
        avgRating: parseFloat(avgRating.toFixed(1)),
        pendingReviews
      });

      // Aylık grafik verisi (son 7 ay)
      const monthlyData = generateMonthlyData(bookings);
      setChartData(monthlyData);

      // Popüler turlar
      const tourStats = calculatePopularTours(bookings);
      setPopularTours(tourStats);

      // Son aktiviteler
      const activities = generateRecentActivities(bookings, reviews || []);
      setRecentActivities(activities);

    } catch (error) {
      console.error('Dashboard veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateMonthlyData(bookings: any[]): ChartData[] {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem'];
    const now = new Date();
    
    return months.map((month, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === monthDate.getMonth() &&
               bookingDate.getFullYear() === monthDate.getFullYear();
      });

      return {
        name: month,
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, b) => sum + b.total_price, 0)
      };
    });
  }

  function calculatePopularTours(bookings: any[]): PopularTour[] {
    const tourMap = new Map<string, { bookings: number; revenue: number }>();

    bookings.forEach(booking => {
      const tourName = booking.tour?.title_tr || 'Bilinmeyen Tur';
      const existing = tourMap.get(tourName) || { bookings: 0, revenue: 0 };
      
      tourMap.set(tourName, {
        bookings: existing.bookings + 1,
        revenue: existing.revenue + booking.total_price
      });
    });

    return Array.from(tourMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 4);
  }

  function generateRecentActivities(bookings: any[], reviews: any[]): Activity[] {
    const activities: Activity[] = [];

    // Son 5 rezervasyon
    bookings.slice(0, 5).forEach(booking => {
      activities.push({
        id: booking.id,
        type: 'booking',
        message: `${booking.tour?.title_tr || 'Tur'} için yeni rezervasyon`,
        time: getTimeAgo(booking.created_at),
        user: booking.customer_name
      });
    });

    // Son 5 yorum
    reviews.slice(0, 5).forEach((review: any) => {
      activities.push({
        id: review.id,
        type: 'review',
        message: `${review.rating} yıldız değerlendirme aldı`,
        time: getTimeAgo(review.created_at),
        user: review.customer_name
      });
    });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  }

  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  }

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
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <button 
            onClick={loadDashboardData}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
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
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                    {tour.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{tour.bookings}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${popularTours[0] ? (tour.bookings / popularTours[0].bookings) * 100 : 0}%` }}
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
          </div>
          <div className="space-y-4">
            {recentActivities.slice(0, 6).map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'booking' ? 'bg-blue-100' :
                  activity.type === 'review' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'booking' ? <Calendar className="w-5 h-5 text-blue-600" /> :
                   activity.type === 'review' ? <Star className="w-5 h-5 text-yellow-600" /> :
                   <MapPin className="w-5 h-5 text-green-600" />}
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
            <button 
              onClick={() => window.location.href = '/admin/reviews'}
              className="mt-4 w-full py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm"
            >
              İncele
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
