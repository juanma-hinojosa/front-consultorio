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
      <CallToAction
        titulo='Consultá a nuestros especialistas hoy mismo'
        parrafo='Accedé a turnos en el día en diversas especialidades médicas, con cobertura de obras sociales y opciones de pago pensadas para vos. Atendete sin esperar.'
        img='https://images.unsplash.com/photo-1673865641073-4479f93a7776?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
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
      <BenefitsSection
        titulo='La Importancia de Elegir un Consultorio Privado con Especialidades Diversas'
        texto='Contar con un consultorio privado que ofrezca una amplia gama de especialidades médicas es clave para una atención integral y personalizada. Cada especialidad tiene su propio enfoque y tratamiento, permitiendo diagnosticar y tratar diversas condiciones de manera precisa. Ya sea para problemas de salud comunes o complejos, tener acceso a expertos en áreas como cardiología, dermatología, ginecología, entre otras, asegura una atención de calidad. Además, la posibilidad de recibir un seguimiento continuo por parte de especialistas favorece una recuperación más rápida y un bienestar duradero. ¡Tu salud merece lo mejor!'
        imgUno='https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        imgDos='https://plus.unsplash.com/premium_photo-1681966826227-d008a1cfe9c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      />
    </>
  )
}

export default ServicesPage;