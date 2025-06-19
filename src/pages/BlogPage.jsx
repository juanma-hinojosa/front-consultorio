import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCardComponent';
import HeroFlyerComponent from '../components/HeroFlyerComponent';
import HeroSection from '../components/HeroSectionComponent';
import '../css/pages/BlogPage.css';
import Blog from "/blog-1.mp4";
// import slugify from '../components/slugify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader'; // ✅ Importá el nuevo componente
import HeroFlyer from '../components/HeroFlyerComponent';
import axios from "axios";
import { Helmet } from 'react-helmet-async';


const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  // const [showFlyer, setShowFlyer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flyer, setFlyer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publicos`);
        const blogsData = await blogsRes.json();

        // ✅ Ordenar por creadoEn descendente (más reciente primero)
        blogsData.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
        setBlogs(blogsData);

        // ✅ Cargar y filtrar flyer activo
        const flyerRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/flyers`);
        const now = new Date();
        const activeFlyers = flyerRes.data.filter(f => new Date(f.expirationDate) > now);
        if (activeFlyers.length > 0) {
          setFlyer(activeFlyers[0]);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const lastBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  if (isLoading) return <Loader />; // ✅ Mostrar el loader hasta que cargue todo

  return (
    <>
      <Helmet>
        <title>Noticias | Consultorio San Marcos</title>
        <meta name="description" content="Blog medicina integral en San Marcos. Rivera 146, Villa Madero, Buenos Aires. Noticias sobre salud y blogs que te van ayudar a cuidar y estar atento que te da la salud." />
        <link rel="canonical" href="https://consultoriosanmarcos.com/blog" />
      </Helmet>

      {flyer ? (
        <HeroFlyer flyer={flyer} />
      ) : (
        <HeroSection video={Blog}
          name="Especialidades"
          path="especialidades"
        />
      )}


      <section className="blog-page">
        <h1 className="blog-page-title">Nuestro Blog</h1>

        {lastBlog && (
          <div className="featured-blog" data-aos="fade-up">
            <img src={lastBlog.imagenPrincipal} alt={lastBlog.titulo} className="featured-image" />
            <div className="featured-content">
              <span className="blog-card-category">{lastBlog.tema}</span>
              <h2>{lastBlog.titulo}</h2>
              <p>{lastBlog.introduccion}</p>
              <p><strong>Autor:</strong> {lastBlog.autor?.nombre || "Sin autor"}</p>
              <button style={{ backgroundColor: "transparent", paddingTop: "50px", border: "none" }}>
                <Link to={`/blog/${lastBlog._id}`} className="blog-card-button">
                  Leer más →
                </Link>
              </button>
            </div>
          </div>
        )}

        <div className="blog-grid">
          {otherBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
