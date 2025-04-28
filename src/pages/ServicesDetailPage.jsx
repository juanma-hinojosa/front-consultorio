import { Link, useParams } from 'react-router-dom';
import slugify from '../components/slugify';
import '../css/pages/ServiceDetailPage.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import ServiceDetailSkeleton from '../components/skeleton/ServiceDetailSkeleton';
import { ToastContainer } from 'react-toastify';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [specialty, setSpecialty] = useState(null);

  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/specialties`);
        const data = await res.json();
        const found = data.find(s => slugify(s.title) === slug);
        setSpecialty(found);
      } catch (err) {
        console.error('Error al obtener especialidad:', err);
      }
    };

    fetchSpecialty();
  }, [slug]);

  if (!specialty) return <p>Cargando especialidad...</p>;

  const message = `Hola, quisiera solicitar un turno para la especialidad de ${specialty.title}.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;
  // // Elegir 3 servicios distintos del actual
  // const otherServices = especialidades
  //   .filter((item) => slugify(item.title) !== slug)
  //   .slice(0, 3);

  return (
    <>
      {!specialty ? (<ServiceDetailSkeleton />) : (
        <>
          <div
            style={{
              backgroundImage: `url(${specialty.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "300px", // podés ajustar según necesites
              width: "100%"    // opcional
            }}
          >
          </div>
          <section className="service-detail-page">


            <h1 data-aos="zoom-in"
              data-aos-duration="500"
            >{specialty.title}</h1>
            <h3
              data-aos="zoom-in"
              data-aos-duration="500">{specialty.subtitle}</h3>
            {/* <a
          href={whatsappLink}
          className="btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <Icon icon="ic:baseline-whatsapp" />
          Solicitar Turno
        </a> */}
            <p data-aos="zoom-in" >{specialty.description}</p>

            <AppointmentCalendar
              specialty={specialty}
            />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </section>
        </>
      )}




      {/* <section className="related-services">
        <h2>También te puede interesar</h2>
        <div className="related-services-grid">
          {otherServices.map((item) => (
            <div key={item.title} className="related-service-card" >
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
              <Link to={`/services/${slugify(item.title)}`} className="btn-ver-mas">
                Ver más
              </Link>
            </div>
          ))}
        </div>
      </section> */}
    </>

  );
};

export default ServiceDetailPage;
