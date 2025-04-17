
import React from 'react';
import '../css/components/ServiceCard.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import slugify from './slugify';

const ServiceCard = ({ service }) => {
  const slug = slugify(service.title);
  const { title, image, subtitle } = service;


  const message = `Hola, quisiera solicitar un turno para la especialidad de ${title}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;

  return (
    <div className="service-card">
      <div className="service-img-wrapper">
        <img src={image} alt={title} className="service-avatar" />
      </div>
      <div className="service-info">
        <h3 className="service-title">{title}</h3>
        <p className="service-subtitle">{subtitle}</p>
        <div className="service-links">
          <Link to={`/services/${slug}`} className="link-read-more">
            Leer más <Icon icon="eva:diagonal-arrow-right-up-outline" />
          </Link>
         <a
            href={whatsappLink}
            className="btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ic:baseline-whatsapp" />
            Solicitar Turno
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
