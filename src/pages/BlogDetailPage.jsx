import { Icon } from '@iconify/react/dist/iconify.js';
import '../css/pages/BlogDetailPage.css';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Loader from '../components/Loader'; // ✅ Agregado
import { Helmet } from 'react-helmet-async';

const BlogDetailPage = () => {
  const { id } = useParams(); // obtenemos solo el ID
  const [blog, setBlog] = useState(null);

  const location = useLocation();
  const canonicalUrl = `https://consultoriosanmarcos.com${location.pathname}`;


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/publico/${id}`)
      // fetch(`http://localhost:5000/api/blogs/publico/${id}`)
      .then((res) => res.json())
      .then(setBlog)
      .catch(console.error);

  }, [id]);

  // ✅ Mostrar loader mientras se carga
  if (!blog) return <Loader />;
  // console.log(blog);

  return (
    <>

      <Helmet>
        <title>{blog.titulo} | Consultorio San Marcos</title>
        <meta name="description" content={blog.introduccion} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="main-image-container">
        <img src={blog.imagenPrincipal} alt={blog.titulo} className="main-image" />
      </div>
      <section className="blog-detail">
        <div className="blog-detail__text-section">
          <div className="blog-detail__header">
            <div className="blog-detail__header-left">
              <p className="blog-detail__category">{blog.tema}</p>
              <h1 className="blog-detail__title">{blog.titulo}</h1>
              <p className="blog-detail__intro">{blog.introduccion}</p>
              <p className="">Autor: {blog.autor.nombre} {blog.autor.apellido}</p>
            </div>

            <Link to="/blog" className="blog-detail__back-button">
              <Icon icon="icon-park-solid:back" className="blog-detail__back-icon" />
              Volver
            </Link>
          </div>

          {/* <p className="blog-detail__paragraph">{blog.contentParagraph}</p> */}

          {blog.parrafos?.map((parrafo, idx) => (
            <div key={idx} className="blog-detail__paragraph">
              {parrafo.texto && <p>{parrafo.texto}</p>}
              <div className="blog-detail__gallery">
                {parrafo.imagenes?.map((img, i) => (
                  <img
                    data-aos="zoom-in-up"
                    key={i}
                    src={img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}/${img}`}
                    alt={`Imagen ${i + 1}`}
                    className="blog-detail__gallery-image"
                  />
                ))}
              </div>
            </div>
          ))}

          {/* {blog.contentImagesUrls?.length > 0 && (
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
          )} */}
        </div>

        <Link to="/blog" className="blog-detail__back-button blog-detail__back-button--bottom">
          ← Volver a Blogs
        </Link>
      </section>
    </>
  );
};

export default BlogDetailPage;
