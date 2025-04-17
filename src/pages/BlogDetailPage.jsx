import { Icon } from '@iconify/react/dist/iconify.js';
import '../css/pages/BlogDetailPage.css';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader'; // ✅ Agregado

const BlogDetailPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get("id");

  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Nuevo estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBlog, resAll] = await Promise.all([
          fetch(`https://consultorio-back-xg97.onrender.com/api/blogs/${id}`),
          fetch('https://consultorio-back-xg97.onrender.com/api/blogs')
        ]);

        const blogData = await resBlog.json();
        const allBlogs = await resAll.json();
        const filtered = allBlogs.filter(item => item._id !== id).slice(0, 3);

        setBlog(blogData);
        setOtherBlogs(filtered);
      } catch (error) {
        console.error('Error al cargar el blog:', error);
      } finally {
        setIsLoading(false); // ✅ Finaliza el loading
      }
    };

    if (id) fetchData();
  }, [id]);

  // ✅ Mostrar loader mientras se carga
  if (isLoading || !blog) return <Loader />;

  return (
    <>
      <div className="main-image-container">
        <img src={blog.mainImageUrl} alt={blog.title} className="main-image" />
      </div>
      <section className="blog-detail">
        <div className="blog-detail__text-section">
          <div className="blog-detail__header">
            <div className="blog-detail__header-left">
              <p className="blog-detail__category">{blog.category}</p>
              <h1 className="blog-detail__title">{blog.title}</h1>
              <p className="blog-detail__intro">{blog.intro}</p>
            </div>

            <Link to="/blog" className="blog-detail__back-button">
              <Icon icon="icon-park-solid:back" className="blog-detail__back-icon" />
              Volver
            </Link>
          </div>

          <p className="blog-detail__paragraph">{blog.contentParagraph}</p>

          {blog.contentImagesUrls?.length > 0 && (
            <div className="blog-detail__gallery">
              {blog.contentImagesUrls.map((img, index) => (
                <img key={index} src={img} alt={`img-${index}`} className="blog-detail__gallery-image" />
              ))}
            </div>
          )}

          {blog.extraSections?.length > 0 && (
            <div className="blog-detail__extra-sections">
              {blog.extraSections.map((section, index) => (
                <div className="blog-detail__extra-section" key={index}>
                  <p>{section.paragraph}</p>
                  {section.imageUrl && (
                    <img src={section.imageUrl} alt={`extra-${index}`} className="blog-detail__extra-image" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/blog" className="blog-detail__back-button blog-detail__back-button--bottom">
          ← Volver a Blogs
        </Link>
      </section>

      {/* {otherBlogs.length > 0 && (
        <section className="related-blogs">
          <h2>También te puede interesar</h2>
          <div className="related-blogs-grid">
            {otherBlogs.map((item) => (
              <div key={item._id} className="related-blog-card">
                <img src={item.mainImageUrl} alt={item.title} />
                <h4>{item.title}</h4>
                <Link to={`/blog/detail?id=${item._id}`} className="btn-ver-mas">
                  Leer más
                </Link>
              </div>
            ))}
          </div>
        </section>
      )} */}
    </>
  );
};

export default BlogDetailPage;
