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
import "../css/components/videoCard.css"

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flyer, setFlyer] = useState(null);

  const width = useWindowWidth();

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

    const fetchVideos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos`);
        const data = await res.json();

        // ✅ Ordenar por fecha más reciente primero
        const sortedVideos = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVideos(sortedVideos);
        // console.log(sortedVideos);

      } catch (error) {
        console.error("Error cargando videos:", error);
      }
    };

   

    fetchData();
    fetchVideos();
   

  }, []);


  const lastBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  const getGridTemplate = () => {
    if (width >= 1200) {
      return 'repeat(auto-fit, minmax(400px, 1fr))';
    } else if (width >= 768) {
      return 'repeat(auto-fit, minmax(400px, 1fr))';
    } else {
      return 'repeat(auto-fit, minmax(300px, 1fr))';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: getGridTemplate(),
    gap: '16px',
  };

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

      <section className="blog-page" >
        <h2 className="blog-page-title">Últimos Videos</h2>

        {videos.length === 0 ? (
          <p>No hay videos disponibles.</p>
        ) : (
          <div >
            <div style={gridStyle} >
              {videos.map((video) => (
                <div key={video._id}
                  className='video-card'
                  data-aos="fade-up"
                >
                  <video
                    src={video.videoUrl}
                    controls
                  />
                  <div style={{ backgroundColor: "white", padding: "1rem", }} >
                    <h3>{video.titulo}</h3>
                    {video.descripcion && <p>{video.descripcion}</p>}

                    <p style={{ marginTop: "7px", fontSize: '12px', color: '#777' }}>
                      Subido el {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </section>

    </>
  );
};

export default BlogPage;
