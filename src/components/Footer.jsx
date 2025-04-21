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
              <p>Politica de privacidad</p>
              <p>Aviso legal</p>
              {/* <Link to="/blog">Blog</Link> */}
            </div>


            <div>
              <h4>Informacion de contacto</h4>
              <p>Rivera 146, Villa Madero</p>
              <p>+54 1127706352</p>
              <p>Lun - Sab 8:00 a 18:00.</p>
              <p>consultorio@sanmarcos.com</p>
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
          <span style={{color: "#e81753"}} >Stake</span><span style={{color: "#2867ac"}} >Dev</span>
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
