import React from 'react';
import '../css/components/BenefitsSection.css';
import { Link } from 'react-router-dom';

const BenefitsSection = (props) => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-text">
          <h2 data-aos="fade-up" >{props.titulo}</h2>
          <p data-aos="fade-up">
            {props.texto}
          </p>
          <div data-aos="zoom-in" style={{
            marginTop: "20px"
          }}>
            <Link to="/especialidades" className='boton-beneficios'
            >
              Especialidades
            </Link>
          </div>
        </div>

        <div className="benefits-images">
          <img
            data-aos="zoom-in"
            data-aos-duration="2000"
            src={props.imgUno}

            // src="https://images.unsplash.com/photo-1607746882042-944635dfe10e" // reemplazá por tu imagen real
            alt="Persona feliz"
          />
          <img
            data-aos="zoom-in"
            data-aos-duration="2000"
            src={props.imgDos}

            // src="https://previews.123rf.com/images/stylephotographs/stylephotographs1709/stylephotographs170900145/85857220-presentaci%C3%B3n-de-doctores-sobre-medicina-analizando-gr%C3%A1fico.jpg" // reemplazá por tu imagen real
            alt="Doctores analizando"
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
