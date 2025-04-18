import BenefitsSection from "../components/BenefitsSectionComponent";
import CallToAction from "../components/CallToActionComponent";
import HeroSection from "../components/HeroSectionComponent";
import ServiceCard from "../components/ServiceCard";
import Services from "/services.mp4"
import especialidades from '../assets/js/list';
import "../css/pages/ServicesPage.css"
function ServicesPage() {
    return (<>
        <HeroSection
            video={Services}
            name="Cuidados"
            path="blog"
        />
        <CallToAction />
        <section className="services-container">
            <h1>Nuestras Especialidades</h1>
            <div className="services-grid">


                {especialidades
                    .map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
            </div>
        </section>
        <BenefitsSection />
    </>
    )
}

export default ServicesPage;