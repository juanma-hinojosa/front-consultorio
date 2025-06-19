import { Helmet } from "react-helmet-async";
import CallToAction from "../components/CallToActionComponent";
import ConsultaForm from "../components/consultaFormComponent";
import ContactSection from "../components/ContactSection";
import HeroSection from "../components/HeroSectionComponent";
import Nosotros from "/nosotros.mp4"
function AboutUsPage() {
    return (
        <>
            <Helmet>
                <title>Nosotros | Consultorio San Marcos</title>
                <meta name="description" content="Atención médica integral en San Marcos. Rivera 146, Villa Madero, Buenos Aires. Somos un consultorio en el que nos apasiona la medicina y poder cuidar de tu salud." />
                <link rel="canonical" href="https://consultoriosanmarcos.com/about" />
            </Helmet>
            <HeroSection
                video={Nosotros}
                name="Especialidades"
                path="especialidades"
            />
            <ContactSection />
            {/* <ConsultaForm /> */}
            <CallToAction
                titulo='Te esperamos con los brazos abiertos'
                parrafo='Queremos ayudarte y tener un mejor estilo de vida desde la salud y nos comprometemos a siempre prevenir y recuperar tu estado de salud para que pueda disfrutar los bellos momento de la vida.'
                img='https://images.unsplash.com/photo-1624133172222-78072e4ecd48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />
        </>
    )
}

export default AboutUsPage;