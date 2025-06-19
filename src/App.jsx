import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import Navbar from './components/NavbarComponent';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ServiceDetailPage from './pages/ServicesDetailPage';
import { ToastContainer } from 'react-toastify';
import NotFoundPage from './pages/NotFoundPage';
import WhatsappButton from './components/WhatsAppButton';
import 'react-toastify/dist/ReactToastify.css';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
// import Turnos from './pages/Admin/TurnosPage';
import EspecialidadesExternasPage from './pages/EspecialidadesExternasPage';
import LoginPage from './pages/LoginPage';
import DashboardAdmin from './pages/dashboard/AdminDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import PrivateRoute from './components/hooks/PrivateRoute';
import UnauthorizedPage from './pages/NoAutorizado';
import DashboardRecepcion from './pages/dashboard/RecepcionDashboard';
import BlogDetailPage from './pages/BlogDetailPage';
// import { HelmetProvider } from "react-helmet-async";
import { HelmetProvider } from 'react-helmet-async';


function AppContent() {
  const location = useLocation();
  const hideHome = ["/"];

  const hideNavbarRoutes = ["/login", "/admin/dashboard", "/recepcion/dashboard", "/doctor/dashboard"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideHome = hideHome.includes(location.pathname);

  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  return (
    <>
    
      <ScrollToTop />
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/especialidades" element={<ServicesPage />} />
        {/* <Route path="/especialidades/:slug" element={<ServiceDetailPage />} /> */}
        <Route path="/especialidades-externas/:slug" element={<EspecialidadesExternasPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />


        <Route path="/login" element={<LoginPage />} />



        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardAdmin />
          </PrivateRoute>
        }
        />
        <Route path="/doctor/dashboard" element={
          <PrivateRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </PrivateRoute>
        }
        />

        <Route path="/recepcion/dashboard" element={
          <PrivateRoute allowedRoles={["recepcionista"]}>
            <DashboardRecepcion />
          </PrivateRoute>
        }
        />
        {/* <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!shouldHideNavbar && <WhatsappButton />}
      {/* {!shouldHideHome && <WhatsappButton />} */}
      {!shouldHideNavbar && <Footer />}
    </>
  )
}
// Envolvemos AppContent con BrowserRouter aquí
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop rtl={false}  draggable/>
      </BrowserRouter>
    </HelmetProvider>
  );
}


export default App;

// export default App
