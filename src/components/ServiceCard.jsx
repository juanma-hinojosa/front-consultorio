
import React from 'react';
import '../css/components/ServiceCard.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import slugify from './slugify';

const ServiceCard = ({ specialty }) => {
  const slug = slugify(specialty.title);


  const message = `Hola, quisiera solicitar un turno para la especialidad de ${specialty.title}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;

  return (
    <div className="service-card" data-aos="fade-up">
      <div className="service-img-wrapper">
        <img src={specialty.image} alt={specialty.title} className="service-avatar" />
      </div>
      <div className="service-info">
        <h3 className="service-title">{specialty.title}</h3>
        <p className="service-subtitle">{specialty.subtitle}</p>
        <div className="service-links">
          <Link to={`/especialidades-externas/${slug}`} className="link-read-more">
            Leer más <Icon icon="eva:diagonal-arrow-right-up-outline" />
          </Link>
          <a
            href={whatsappLink}
            className="btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ic:baseline-whatsapp" style={{
              marginRight: "5px", fontSize: "20px"
            }} />
            Solicitar Turno
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
