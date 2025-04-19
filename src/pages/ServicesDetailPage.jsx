import { Link, useParams } from 'react-router-dom';
import especialidades from '../assets/js/list';
import slugify from '../components/slugify';
import '../css/pages/ServiceDetailPage.css';
import { Icon } from '@iconify/react/dist/iconify.js';

const ServiceDetailPage = () => {
    const { slug } = useParams();

    // Buscar la especialidad por slug
    const service = especialidades.find((item) => slugify(item.title) === slug);

    if (!service) {
        return <div>Especialidad no encontrada</div>;
    }

    const { title, image, description, subtitle } = service;
    const message = `Hola, quisiera solicitar un turno para la especialidad de ${title}.`;
    const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;
    // Elegir 3 servicios distintos del actual
    const otherServices = especialidades
        .filter((item) => slugify(item.title) !== slug)
        .slice(0, 3);

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${image})`,
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
                >{title}</h1>
                <h3 
                data-aos="zoom-in"
                data-aos-duration="500">{subtitle}</h3>
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
                <p data-aos="zoom-in" >{description}</p>
            </section>

            <section className="related-services">
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
            </section>
        </>

    );
};

export default ServiceDetailPage;
