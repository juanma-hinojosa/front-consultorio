import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import Navbar from './components/NavbarComponent';
import PrivateRoute from './components/PrivateRoute';
import BlogCreatePage from './pages/Admin/NewBlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import EditBlogPage from './pages/Admin/EditBlogPage';
import FlyerFormPage from './pages/Admin/FlyerFormPage';
import EditFlyerPage from './pages/Admin/EditFlyerPage';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ServiceDetailPage from './pages/ServicesDetailPage';
import { ToastContainer } from 'react-toastify';
import NotFoundPage from './pages/NotFoundPage';
import WhatsappButton from './components/WhatsAppButton';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />

        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          {/* AdminPage */}
          <Route path='/admin/login' element={<AdminLoginPage />} />

          {/* Rutas protegidas */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />

          <Route path="/admin/create-blog" element={
            <PrivateRoute>
              <BlogCreatePage />
            </PrivateRoute>
          } />
          <Route path="/admin/blog/edit/:id" element={
            <PrivateRoute>
              <EditBlogPage />
            </PrivateRoute>
          } />

          <Route path="/admin/create-flyer" element={
            <PrivateRoute>
              <FlyerFormPage />
            </PrivateRoute>
          } />

          <Route path="/admin/flyer/edit/:id" element={<PrivateRoute>
            <EditFlyerPage />
          </PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <ToastContainer />
        <WhatsappButton />
      </BrowserRouter>
    </>
  )
}

export default App
