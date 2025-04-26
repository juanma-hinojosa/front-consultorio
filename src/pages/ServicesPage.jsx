import BenefitsSection from "../components/BenefitsSectionComponent";
import CallToAction from "../components/CallToActionComponent";
import HeroSection from "../components/HeroSectionComponent";
import ServiceCard from "../components/ServiceCard";
import Services from "/services.mp4"
import especialidades from '../assets/js/list';
import "../css/pages/ServicesPage.css"
import { useEffect, useState } from "react";
import ServiceCardSkeleton from "../components/skeleton/ServiceCardSkeleton";
import CardEspecialidad from "../components/CardEspecialidad";
function ServicesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSpecialties = async () => {
      try {
        const res = await fetch('https://consultorio-back-xg97.onrender.com/api/specialties');
        const data = await res.json();
        setSpecialties(data);
      } catch (err) {
        console.error('Error al obtener especialidades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);
  return (
    <>
      <HeroSection
        video={Services}
        name="Cuidados"
        path="blog"
      />
      <CallToAction />
      <section className="services-container">
        <h1>Nuestras Especialidades</h1>
        <div className="services-grid">
          {/* {specialties
            .map(s => (
              <ServiceCard key={s._id} specialty={s} />
            ))} */}

          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : specialties
              .map(s => (
                <ServiceCard key={s._id} specialty={s} />
              ))}

          {especialidades.map((especialidad, index) => (
            <CardEspecialidad
              key={index}
              image={especialidad.image}
              title={especialidad.title}
              subtitle={especialidad.subtitle}
            />
          ))}
        </div>
      </section>
      <BenefitsSection />
    </>
  )
}

export default ServicesPage;