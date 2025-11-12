import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import TourForm from './pages/admin/TourForm'
import ContentManager from './pages/admin/ContentManager'
import ToursManager from './pages/admin/ToursManager'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/tours" element={<Layout><Tours /></Layout>} />
        <Route path="/tour/:id" element={<Layout><TourDetail /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/tours" element={<ToursManager />} />
        <Route path="/admin/content" element={<ContentManager />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/tour/:id" element={<TourForm />} />
        
        {/* 404 - EN SONDA */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
