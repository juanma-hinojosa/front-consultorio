import CallToAction from "../components/CallToActionComponent";
import ConsultaForm from "../components/consultaFormComponent";
import ContactSection from "../components/ContactSection";
import HeroSection from "../components/HeroSectionComponent";
import Nosotros from "/nosotros.mp4"
function AboutUsPage() {
    return (
        <>
            <HeroSection
                video={Nosotros}
            />
            <ContactSection />
            <ConsultaForm />
            <CallToAction />
        </>
    )
}

export default AboutUsPage;