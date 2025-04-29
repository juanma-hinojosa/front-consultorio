import "../css/components/ContactSection.css"
import logo from "../../public/logo.png"
const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-header">
        <div className="contact-info">
          <h2 data-aos="zoom-out"
            data-aos-duration="500"
          >Policonsultorio San Marcos</h2>
          <h4 data-aos="zoom-out"
            data-aos-duration="500">Atencion medica integral con calidez humana</h4>
          <p data-aos="zoom-out"
            data-aos-duration="500">
            Somos un equipo de profesionales dedicados a brindar servicios de salud personalizados, confiables y de alta calidad, priorizando siempre el cuidado del paciente.          </p>
          <p data-aos="zoom-out"
            data-aos-duration="500">
            En nuestro centro médico nos enfocamos en brindar una atención integral que combina excelencia profesional con un trato humano y cercano. Contamos con un equipo multidisciplinario de especialistas altamente capacitados, que trabajan de forma coordinada para acompañarte en cada etapa de tu cuidado. Nuestro compromiso va más allá del diagnóstico: buscamos escuchar, comprender y ofrecer soluciones efectivas adaptadas a las necesidades de cada persona. Con instalaciones modernas, tecnología de vanguardia y un entorno cálido, garantizamos una experiencia centrada en el bienestar físico y emocional de nuestros pacientes. Creemos que la salud se construye desde el vínculo, por eso fomentamos una relación de confianza, empatía y respeto. Estamos aquí para cuidarte, orientarte y acompañarte, siempre con el objetivo de mejorar tu calidad de vida. Tu salud, nuestra prioridad.
          </p>
        </div>
        <div className="contact-logo">
          <img data-aos="zoom-in" src={logo} alt="Logo San Marcos" />
        </div>
      </div>


    </section>
  );
};

export default ContactSection;
