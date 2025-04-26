import "../css/components/CallToAction.css";
import React, { useEffect } from "react";
import doctorImage from "/salud.jpg"; // Ruta al archivo de imagen (colocala en public o src/assets)
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

Icon
const CallToAction = () => {

  const [aosAnimation, setAosAnimation] = useState('fade-left');
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setAosAnimation(isMobile ? 'fade-up' : 'fade-left');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const items = [
    "Turnos en el dia",
    "Obra Sociales",
    "Tarjeta de Credito",
  ];

  const message = `Hola, quisiera solicitar un turno para un checkeo general.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-image">
          <img data-aos="zoom-in" src={doctorImage} alt="Doctor con paciente" />
        </div>
        <div className="cta-content">
          <h2>
            Texto generico para mostrar, captar la atencion y llamar a la
            accion.
          </h2>
          <p>
            Parrafo generico para explicar un poco mas detalle la funcion, los
            beneficios, el tratamiento y mejoras para que la informacion sea
            como una introduccion bien detallada para que el cliente solicite
            el servicio.
          </p>

          <ul className="cta-list">
            {items.map((item, index) => (
              <li
                className="cta-list-item"
                key={index}
                data-aos="fade-up">
                <span className="check-icon">✓</span> {item}
              </li>
            ))}
          </ul>

          <a data-aos="fade-up" className="cta-button" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Icon icon="ic:baseline-whatsapp"
              style={{
                marginRight: "5px", fontSize: "20px"
              }}
            />Solicitar Turno
          </a>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;
