import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../css/components/Footer.css';
import logo from "/logo.png";
import slugify from './slugify';
import especialidades from '../assets/js/list';

const Footer = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState([]);

  let currentYear = new Date().getFullYear();


  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch('https://consultorio-back-xg97.onrender.com/api/blogs');
        const data = await res.json();
        const lastFour = data.slice(0, 4);
        setLatestBlogs(lastFour);
      } catch (error) {
        console.error('Error al cargar los blogs en el footer:', error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Logo e Iconos sociales */}
          <div className="footer-brand">
            <img src={logo} alt="Logo" className="footer-logo" />
            <div className="footer-socials">
              <a href="https://www.facebook.com/profile.php?id=61574685549726" target='_blank'><Icon icon="ic:baseline-facebook" /></a>
              {/* <a href="#"><Icon icon="mdi:linkedin" /></a> */}
              <a href="#"><Icon icon="mdi:youtube" /></a>
              <a href="https://www.instagram.com/sanmarcos.consultorio?igsh=MTg0d2F2YTNzNzdmbw%3D%3D" target='_blank'><Icon icon="mdi:instagram" /></a>
            </div>
          </div>

          {/* Enlaces */}
          <div className="footer-links">
            <div>
              <h4>Especialidades</h4>
              {especialidades.map((item, index) => (
                <Link
                  key={index}
                  to={`/services/${slugify(item.title)}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* <div>
            <h4>Blogs</h4>
            {latestBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${slugify(blog.title)}?id=${blog._id}`}
              >
                {blog.title}
              </Link>
            ))}
          </div> */}

            {/* <div>
            <h4>Blogs</h4>
            {loading
              ? [1, 2, 3, 4].map((i) => (
                <div className="footer-link-skeleton" key={i}></div>
              ))
              : latestBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${slugify(blog.title)}?id=${blog._id}`}
                >
                  {blog.title}
                </Link>
              ))}
          </div> */}


            <div>
              <h4>Páginas</h4>
              <Link to="/">Inicio</Link>
              <Link to="/services">Especialidades</Link>
              <Link to="/about">Nosotros</Link>
              <Link to="/blog">Blog</Link>
            </div>

            <div>
              <h4>Aviso legales importante</h4>
              <p>Terminos y condiciones</p>
              <a href="#">Politica de privacidad</a>
              <a href="#">Aviso legal</a>
              {/* <Link to="/blog">Blog</Link> */}
            </div>


            <div>
              <h4>informacion de contacto</h4>
              <a href="#">Rivera 146, Villa Madero</a>
              <a href="#">+54 1127706352</a>
              <a href="#">Lun - Sab 8:00 a 18:00.</a>
              <a href="#">consultorio@sanmarcos.com</a>
              {/* <Link to="/blog">Blog</Link> */}
            </div>
          </div>


        </div>
        <div style={
          { height: "1px", backgroundColor: "white", margin: "10px 0" }
        } >
        </div>
        <span>
          <p>© {currentYear} San Marcos Policonsultorio Privado. Todos los derechos reservados.</p>
        </span>



      </footer>

      <div className="footer-banner-developers"
      >
        Desarrollado por&nbsp;
        <a href="https://stakedev.net" target="_blank" rel="noopener noreferrer">
          Stake Dev
          <img
            src="https://stakedev.net/images/logo.png"
            alt="Stake Dev logo"
            className="stake-logo"
          />
        </a>
      </div>
    </>

  );
};

export default Footer;
