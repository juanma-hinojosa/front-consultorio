import React, { useEffect, useState } from 'react';
import '../css/components/HeroFlyerComponent.css';
import slugify from './slugify';
import { Icon } from '@iconify/react/dist/iconify.js';

const HeroFlyerComponent = ({ flyer }) => {
  if (!flyer) return null;

  const slug = slugify(flyer.text);
  const { text } = flyer;


  const message = `Hola, tengo interes en recibir mas informacion sobre ${text}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;
  // console.log(whatsappLink);

  return (
    <section className="hero-flyer">
      <img
        src={flyer.imageUrl || '/default-flyer.jpg'}
        alt="Flyer"
        className="hero-flyer-image"
      />
      <div className="hero-flyer-text">
        <h1>{flyer.text || 'Bienvenido a nuestro Blog'}</h1>
        <p>{flyer.paragraph || 'Explorá nuestras últimas publicaciones sobre salud y bienestar.'}</p>
        <div
          style={{
            width: "200px",
            margin: "0 auto",
            marginTop: "20px",

          }}
        >
          <a className="cta-button" href={whatsappLink} target="_blank" rel="noopener noreferrer">
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

export default HeroFlyerComponent;
