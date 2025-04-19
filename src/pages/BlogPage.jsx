import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCardComponent';
import HeroFlyerComponent from '../components/HeroFlyerComponent';
import HeroSection from '../components/HeroSectionComponent';
import '../css/pages/BlogPage.css';
import Blog from "/blog.mp4";
import slugify from '../components/slugify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader'; // ✅ Importá el nuevo componente

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  // const [showFlyer, setShowFlyer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flyerData, setFlyerData] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const [blogsRes, flyerRes] = await Promise.all([
    //       fetch('https://consultorio-back-xg97.onrender.com/api/blogs'),
    //       fetch('https://consultorio-back-xg97.onrender.com/api/flyers')
    //     ]);

    //     if (blogsRes.ok) {
    //       const blogsData = await blogsRes.json();
    //       setBlogs(blogsData);
    //     }

    //     if (flyerRes.ok) {
    //       const flyerData = await flyerRes.json();
    //       if (flyerData && flyerData.imageUrl) setShowFlyer(true);
    //     }
    //   } catch (error) {
    //     console.error('Error al cargar datos:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    const fetchData = async () => {
      try {
        const [blogsRes, flyerRes] = await Promise.all([
          fetch('https://consultorio-back-xg97.onrender.com/api/blogs'),
          fetch('https://consultorio-back-xg97.onrender.com/api/flyers')
        ]);

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          setBlogs(blogsData);
        }

        if (flyerRes.ok) {
          const flyerData = await flyerRes.json();
          if (flyerData && flyerData.imageUrl) {
            setFlyerData(flyerData); // ✅ Guardamos los datos del flyer completo
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
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
      {flyerData ? (
        <HeroFlyerComponent flyer={flyerData} />
      ) : (
        <HeroSection video={Blog} 
        name="Especialidades"
        path="services"
        />
      )}


      <section className="blog-page">
        <h1 className="blog-page-title">Nuestro Blog</h1>

        {lastBlog && (
          <div className="featured-blog" data-aos="fade-up">
            <img src={lastBlog.mainImageUrl} alt={lastBlog.title} className="featured-image" />
            <div className="featured-content">
              <span className="blog-card-category">{lastBlog.category}</span>
              <h2>{lastBlog.title}</h2>
              <p>{lastBlog.intro}</p>
              <button style={{ backgroundColor: "transparent", paddingTop: "50px", border: "none" }}>
                <Link to={`/blog/${slugify(lastBlog.title)}?id=${lastBlog._id}`} className="blog-card-button">
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
