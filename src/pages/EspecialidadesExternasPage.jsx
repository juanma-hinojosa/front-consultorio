import { Link, useParams } from 'react-router-dom';
import slugify from '../components/slugify';
import '../css/pages/ServiceDetailPage.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import ServiceDetailSkeleton from '../components/skeleton/ServiceDetailSkeleton';
import especialidades from '../assets/js/list';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';


const EspecialidadesExternasPage = () => {
  const { slug } = useParams();
  const specialty = especialidades.find(item => slugify(item.title) === slug);

  const location = useLocation();
  const canonicalUrl = `https://consultoriosanmarcos.com${location.pathname}`;

  // console.log(canonicalUrl);



  if (!specialty) return <p>Cargando especialidad...</p>;

  const message = `Hola, quisiera solicitar un turno para la especialidad de ${specialty.title}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;
  // Elegir 3 servicios distintos del actual
  const otherServices = especialidades
    .filter((item) => slugify(item.title) !== slug)
    .slice(0, 3);



  return (
    <>
      <Helmet>
        <title>{specialty.title} | Consultorio San Marcos</title>
        <meta name="description" content="Blog medicina integral en San Marcos. Rivera 146, Villa Madero, Buenos Aires. Noticias sobre salud y blogs que te van ayudar a cuidar y estar atento que te da la salud." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div
        style={{
          backgroundImage: `url(${specialty.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "300px",
          width: "100%"
        }}
      ></div>

      <section className="service-detail-page">
        <h1 data-aos="zoom-in" data-aos-duration="500">{specialty.title}</h1>
        <h3 data-aos="zoom-in" data-aos-duration="500">{specialty.subtitle}</h3>

        <a
          href={whatsappLink}
          className="btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <Icon icon="ic:baseline-whatsapp" />
          Solicitar Turno
        </a>

        <p data-aos="zoom-in">{specialty.description}</p>

        {/* <AppointmentCalendar specialty={specialty} /> */}
      </section>

      <section className="related-services">
        <h2>También te puede interesar</h2>
        <div className="related-services-grid">
          {otherServices.map((item) => (
            <div key={item.title} className="related-service-card" >
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
              <Link to={`/especialidades-externas/${slugify(item.title)}`} className="btn-ver-mas">
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );



};

export default EspecialidadesExternasPage;
