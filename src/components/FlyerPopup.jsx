import React, { useEffect, useState } from 'react';
import "../css/components/FlyerPopup.css";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import LogoWhite from "/img/white.png"

const FlyerPopup = () => {
  const [flyer, setFlyer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("flyerPopupShown");

    const fetchFlyer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/flyers`);
        const now = new Date();

        // Obtener flyers válidos
        const activeFlyers = res.data.filter(f =>
          new Date(f.expirationDate) > now
        );

        // Solo mostrar si hay un flyer activo y estamos en la página principal
        if (location.pathname === "/" && !alreadyShown && activeFlyers.length > 0) {
          const flyer = activeFlyers[0];

          // Verificación final de expiración por seguridad
          const expiration = new Date(flyer.expirationDate);
          if (now < expiration) {
            setFlyer(flyer);
            setShowPopup(true);
            sessionStorage.setItem("flyerPopupShown", "true");
          }
        }
      } catch (err) {
        console.error("Error al cargar el flyer:", err);
      }
    };

    fetchFlyer();
  }, [location.pathname]);

  // 🔒 Evita renderizar si el popup ya no debe mostrarse
  if (!showPopup || !flyer) return null;

  const formatDateLocal = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  const message = `Hola, quisiera solicitar un turno para ${flyer.title}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;

  // console.log(message);


  return (
    <div className="flyer-popup">
      <div className="flyer-content"
        style={{
          backgroundImage: `linear-gradient(rgba(12, 216, 83, 0.88), rgba(12, 216, 83, 0.88)),url(${flyer.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="contenedor-boton">
          <button className="close-btn-flyer" onClick={() => setShowPopup(false)}>
            ×
          </button>
        </div>


        <img src={LogoWhite} alt="Logo Blanco" />

        <h3>{flyer.title}</h3>
        <p>{flyer.paragraph}</p>

        <a href={whatsappLink} className='button-flyer-wpp' target="_blank" rel="noopener noreferrer">
          <Icon icon="ic:baseline-whatsapp" width="24" height="24" />
          Pedir Turno
        </a>

      </div>
    </div>
  );
};

export default FlyerPopup;
