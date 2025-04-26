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
import ConsultaForm from '../components/consultaFormComponent';
import BlogCard from '../components/BlogCardComponent';
import BlogCardSkeleton from '../components/BlogCardSkeleton';
import ServiceCardSkeleton from '../components/skeleton/ServiceCardSkeleton';

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState([])
  // const featured = especialidades.slice(0, 4);
  const [especialidades, setEspecialidades] = useState([])
  const [featured, setFeatured] = useState([]);
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
      } finally {
        setLoading(false);
      }
    };
    const fetchEspecialidades = async () => {
      try {
        const res = await fetch('https://consultorio-back-xg97.onrender.com/api/specialties');
        const data = await res.json();
        setEspecialidades(data);
        setFeatured(data.slice(0, 4));
      } catch (err) {
        console.error('Error al obtener especialidades:', err);
      }
    };

    fetchBlogs();
    fetchEspecialidades();
  }, []);
  
  return (
    <>
      <HeroSection
        video={Home}
        name="Especialidades"
        path="especialidades"
      />
      <FlyerPopup />
      <section className="home-blogs-section">
        <h2>Últimas Publicaciones</h2>
        <div className="home-blogs-grid">
          {loading
            ? [1, 2, 3].map((i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
        {!loading && (
          <div data-aos="fade-up" className="see-all-btn-container">
            <Link to="/blog" className="btn-see-all">Ver todos los blogs</Link>
          </div>
        )}
      </section>


      <CallToAction />
      <section className="homepage-services">
        <h2>Especialidades Destacadas</h2>
        <div className="services-grid">
          {/* {featured.map((specialty) => (
            <ServiceCard key={specialty._id} specialty={specialty} />
          ))} */}

          {loading
            ? [1, 2, 3, 4].map((i) => <ServiceCardSkeleton key={i} />)
            : featured.map((specialty) => (
              <ServiceCard key={specialty._id} specialty={specialty} />
            ))}
        </div>
        <div className="see-more">
          <Link to="/especialidades" data-aos="fade-up" className="btn-see-all">Ver todas las especialidades</Link>
        </div>

      </section>

      <BenefitsSection />
      {/* <!-- Elfsight Google Reviews | Untitled Google Reviews --> */}
      <div style={{padding: '50px 0'}} class="elfsight-app-2ad46362-2c63-4b57-b3cf-c25d5ac6651a" data-elfsight-app-lazy></div>
      <ConsultaForm />
      <GoogleMapEmbed />

    </>
  )
}

export default HomePage;