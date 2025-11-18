// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './pages/admin/AdminLayout';
import MainLayout from './components/layout/MainLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ToursManager from './pages/admin/tours/ToursManager';
import TourForm from './pages/admin/tours/TourForm';
import BookingsManager from './pages/admin/bookings/BookingsManager';
import BookingDetail from './pages/admin/bookings/BookingDetail';
import CustomersManager from './pages/admin/customers/CustomersManager';
import CustomerDetail from './pages/admin/customers/CustomerDetail';
import ReviewsManager from './pages/admin/reviews/ReviewsManager';
import ContentManager from './pages/admin/blog/ContentManager';
import BlogForm from './pages/admin/blog/BlogForm';
import CategoriesManager from './pages/admin/categories/CategoriesManager';
import MessagesManager from './pages/admin/messages/MessagesManager';
import GalleryManager from './pages/admin/gallery/GalleryManager';
import TranslationsManager from './pages/admin/translations/TranslationsManager';
import Settings from './pages/admin/settings/Settings';
import SubscriberManager from "./pages/admin/newsletter/SubscriberManager"
// Page Editors
import HomePageEditor from './pages/admin/pages/HomePageEditor';
import AboutPageEditor from './pages/admin/pages/AboutPageEditor';
import ContactPageEditor from './pages/admin/pages/ContactPageEditor';
import FooterEditor from './pages/admin/pages/FooterEditor';

// Frontend Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            {/* Tours */}
            <Route path="tours" element={<ToursManager />} />
            <Route path="tours/new" element={<TourForm />} />
            <Route path="tours/edit/:id" element={<TourForm />} />
            
            {/* Bookings */}
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            
            {/* Customers */}
            <Route path="customers" element={<CustomersManager />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            
            {/* Reviews */}
            <Route path="reviews" element={<ReviewsManager />} />
            
            {/* Blog */}
            <Route path="blog" element={<ContentManager />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/edit/:id" element={<BlogForm />} />
            
            {/* Categories */}
            <Route path="categories" element={<CategoriesManager />} />
            
            {/* Messages */}
            <Route path="messages" element={<MessagesManager />} />
            
            {/* Gallery */}
            <Route path="gallery" element={<GalleryManager />} />
            
            {/* Translations */}
            <Route path="translations" element={<TranslationsManager />} />
            
            {/* Newsletter - DOĞRU YER */}
            <Route path="newsletter" element={<SubscriberManager />} />
            
            {/* Page Editors */}
            <Route path="pages/home" element={<HomePageEditor />} />
            <Route path="pages/about" element={<AboutPageEditor />} />
            <Route path="pages/contact" element={<ContactPageEditor />} />
            <Route path="pages/footer" element={<FooterEditor />} />
            
            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Frontend Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="tours" element={<Tours />} />
            <Route path="tours/:id" element={<TourDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;