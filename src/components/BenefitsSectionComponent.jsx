import React from 'react';
import '../css/components/BenefitsSection.css';
import { Link } from 'react-router-dom';

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-text">
          <h2 data-aos="fade-up" >TITULO PRINCIPAL</h2>
          <p data-aos="fade-up">
            Contar con un médico privado y atención en clínicas privadas ofrece múltiples ventajas.
            Recibís un trato personalizado, con seguimiento continuo y mayor confianza en tu cuidado.
            Los tiempos de espera son mínimos, y los diagnósticos y tratamientos se realizan con mayor
            rapidez y eficacia. Además, accedés a tecnología avanzada, instalaciones modernas y un entorno
            cómodo. Podés elegir el especialista, coordinar turnos según tu disponibilidad y recibir una atención
            adaptada a tus necesidades. Es una inversión en salud, prevención y calidad de vida, con profesionales
            comprometidos en brindarte el mejor servicio..
          </p>
          <div data-aos="zoom-in" style={{
            marginTop: "20px"
          }}>
            <Link to="/services" className='boton-beneficios'
            >
              Especialidades
            </Link>
          </div>
        </div>

        <div className="benefits-images">
          <img
            data-aos="zoom-in"
            data-aos-duration="2000"
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e" // reemplazá por tu imagen real
            alt="Persona feliz"
          />
          <img
            data-aos="zoom-in"
            data-aos-duration="2000"
            src="https://previews.123rf.com/images/stylephotographs/stylephotographs1709/stylephotographs170900145/85857220-presentaci%C3%B3n-de-doctores-sobre-medicina-analizando-gr%C3%A1fico.jpg" // reemplazá por tu imagen real
            alt="Doctores analizando"
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
