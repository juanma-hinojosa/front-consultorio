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
import doctorImage from "/salud.jpg"; // Ruta al archivo de imagen (colocala en public o src/assets)
import { Helmet } from 'react-helmet-async';
import especialidadesData from '../assets/js/list';
import UltimoVideo from '../components/VideoSectionComponent';
import MarqueeComponent from '../components/marquee.jsx/MarqueeComponent';

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState([])
  // const featured = especialidades.slice(0, 4);
  const [especialidades, setEspecialidades] = useState([])
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicos`);
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
    // const fetchEspecialidades = async () => {
    //   try {
    //     const res = await fetch('https://consultorio-back-xg97.onrender.com/api/specialties');
    //     const data = await res.json();
    //     setEspecialidades(data);
    //     setFeatured(data.slice(0, 4));
    //   } catch (err) {
    //     console.error('Error al obtener especialidades:', err);
    //   }
    // };

    fetchBlogs();
    setEspecialidades(especialidadesData);
    setFeatured(especialidadesData.slice(0, 4));
    // fetchEspecialidades();
  }, []);

  return (
    <>
      <Helmet>
        <title>Inicio | Consultorio San Marcos</title>
        <meta name="description" content="Atención médica integral en San Marcos. Rivera 146, Villa Madero, Buenos Aires. Descubre nuestros servicios y especialidades." />
        <link rel="canonical" href="https://consultoriosanmarcos.com/" />
      </Helmet>

      <HeroSection
        video={Home}
        name="Especialidades"
        path="especialidades"
      />
      <FlyerPopup />

      <CallToAction
        titulo='Especialistas comprometidos con tu bienestar'
        parrafo="En nuestro consultorio encontrarás atención médica personalizada, disponibilidad inmediata de turnos, cobertura de obras sociales y facilidades de pago. Queremos verte bien."
        img={doctorImage}
      />

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



      <UltimoVideo />

      <MarqueeComponent />


      <section className="homepage-services">
        <h2>Especialidades Destacadas</h2>
        <div className="services-grid">
          {loading
            ? [1, 2, 3, 4].map((i) => <ServiceCardSkeleton key={i} />)
            : featured.slice(0, 4).map((specialty, index) => (
              <ServiceCard key={index} specialty={specialty} />
            ))}
        </div>
        <div className="see-more">
          <Link to="/especialidades" data-aos="fade-up" className="btn-see-all">
            Ver todas las especialidades
          </Link>
        </div>
      </section>


      <BenefitsSection
        titulo='MEDICINA PRIVADA'
        texto='Contar con un médico privado y atención en clínicas privadas ofrece múltiples ventajas.
                  Recibís un trato personalizado, con seguimiento continuo y mayor confianza en tu cuidado.
                  Los tiempos de espera son mínimos, y los diagnósticos y tratamientos se realizan con mayor
                  rapidez y eficacia. Además, accedés a tecnología avanzada, instalaciones modernas y un entorno
                  cómodo. Podés elegir el especialista, coordinar turnos según tu disponibilidad y recibir una atención
                  adaptada a tus necesidades. Es una inversión en salud, prevención y calidad de vida, con profesionales
                  comprometidos en brindarte el mejor servicio.'
        imgDos='https://images.unsplash.com/photo-1590611936760-eeb9bc598548?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        imgUno='https://images.unsplash.com/photo-1607746882042-944635dfe10e'
      />
      {/* <!-- Elfsight Google Reviews | Untitled Google Reviews --> */}
      <div style={{ padding: '50px 0' }} className="elfsight-app-2ad46362-2c63-4b57-b3cf-c25d5ac6651a" data-elfsight-app-lazy></div>
      {/* <ConsultaForm /> */}
      <GoogleMapEmbed />

    </>
  )
}

export default HomePage;