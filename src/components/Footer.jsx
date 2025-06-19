import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../css/components/Footer.css';
import logo from "/white.png";
import slugify from './slugify';
import especialidades from '../assets/js/list';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Footer = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  // const [especialidades, setEspecialidades] = useState([])
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState([]);

  let currentYear = new Date().getFullYear();


  // useEffect(() => {
  //   const fetchEspecialidades = async () => {
  //     try {
  //       const res = await fetch('https://consultorio-back-xg97.onrender.com/api/specialties');
  //       const data = await res.json();

  //       const dataWithSlugs = data.map(specialty => ({
  //         ...specialty,
  //         // slug: specialty.title.toLowerCase().replace(/\s+/g, '-')
  //         slug: slugify(specialty.title)
  //       }));
  //       setFeatured(dataWithSlugs);
  //     } catch (err) {
  //       console.error('Error al obtener especialidades:', err);
  //     }
  //   };

  //   const fetchLatestBlogs = async () => {
  //     try {
  //       const res = await fetch('https://consultorio-back-xg97.onrender.com/api/blogs');
  //       const data = await res.json();
  //       const lastFour = data.slice(0, 4);
  //       setLatestBlogs(lastFour);
  //     } catch (error) {
  //       console.error('Error al cargar los blogs en el footer:', error);
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   };
  //   fetchEspecialidades();
  //   fetchLatestBlogs();
  // }, []);


  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* Logo e Iconos sociales */}
          <div className="footer-brand">
            <img src={logo} alt="Logo" className="footer-logo" />
            <div className="footer-socials">
              <a href="https://www.facebook.com/profile.php?id=61575129959587" target='_blank'><Icon icon="ic:baseline-facebook" /></a>
              <a href="#"><Icon icon="mdi:linkedin" /></a>
              <a href="#"><Icon icon="mdi:youtube" /></a>
              <a href="https://www.instagram.com/sanmarcos.consultorio?igsh=MTg0d2F2YTNzNzdmbw%3D%3D" target='_blank'><Icon icon="mdi:instagram" /></a>
            </div>
          </div>

          {/* Enlaces */}
          <div className="footer-links">
            <div>
              <h4>Especialidades</h4>
              {/* {featured.length === 0 ? (
                // Mientras featured está vacío, mostramos 4 Skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <Skeleton height={20} width={200} />
                  </div>
                ))
              ) : (
                featured.map((specialty) => (
                  <Link
                    key={specialty._id}
                    to={`/especialidades/${specialty.slug}`}
                    style={{ display: 'block', marginBottom: '10px' }}
                  >
                    {specialty.title}
                  </Link>
                ))
              )} */}
              {especialidades.map((item, index) => (
                <Link
                  key={index}
                  to={`/especialidades-externas/${slugify(item.title)}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div>
              <h4>Páginas</h4>
              <Link to="/">Inicio</Link>
              <Link to="/especialidades">Especialidades</Link>
              <Link to="/about">Nosotros</Link>
              <Link to="/blog">Noticias</Link>
            </div>

            <div>
              <h4>Aviso legales importante</h4>
              <p>Terminos y condiciones</p>
              <p>Politica de privacidad</p>
              <p>Aviso legal</p>
              {/* <Link to="/blog">Blog</Link> */}
            </div>


            <div>
              <h4>Informacion de contacto</h4>
              <p>Rivera 146, Villa Madero</p>
              <p>+54 1127706352</p>
              <p>Lun - Vie 9:00 a 18:00. Sab de 9:00 a 13:00. Dom Cerrado.</p>
              <p>consultoriointegralsanmarcos@gmail.com</p>
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
          <span style={{ color: "#e81753" }} >Stake</span><span style={{ color: "#2867ac" }} >Dev</span>
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
