import FlyerPopup from '../components/FlyerPopup';
import HeroSection from '../components/HeroSectionComponent';
import Home from "/home.mp4"
import "../css/pages/HomePage.css"
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CallToAction from '../components/CallToActionComponent';
import BenefitsSection from '../components/BenefitsSectionComponent';
import GoogleMapEmbed from '../components/GoogleMapComponent';
import ServiceCard from '../components/ServiceCard';
import especialidades from '../assets/js/list';
import ConsultaForm from '../components/consultaFormComponent';
import BlogCard from '../components/BlogCardComponent';

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const featured = especialidades.slice(0, 4);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('https://consultorio-back-xg97.onrender.com/api/blogs');
        const data = await res.json();
        // Ordenar por fecha descendente y tomar solo los 3 más nuevos
        const latestThree = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
        setBlogs(latestThree);
      } catch (err) {
        console.error('Error al obtener blogs:', err);
      }
    };

    fetchBlogs();
  }, []);
  return (
    <>
      <HeroSection
        video={Home}
      />
      <FlyerPopup />

      <section className="home-blogs-section">
        <h2>Últimas Publicaciones</h2>
        <div className="home-blogs-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
        <div className="see-all-btn-container">
          <Link to="/blog" className="btn-see-all">Ver todos los blogs</Link>
        </div>
      </section>
      <CallToAction />
      <section className="homepage-services">
        <h2>Especialidades Destacadas</h2>
        <div className="services-grid">
          {featured.map((service) => (
            <ServiceCard key={service._id} service={service}/>
          ))}
        </div>
        <div className="see-more">
          <Link to="/services" className="btn-see-all">Ver todas las especialidades</Link>
        </div>

      </section>

      <BenefitsSection />
      <ConsultaForm />
      <GoogleMapEmbed />

    </>
  )
}

export default HomePage;