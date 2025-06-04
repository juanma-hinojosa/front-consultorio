import { Icon } from "@iconify/react/dist/iconify.js";
import "../css/components/HeroSectionComponent.css";
import { Link } from "react-router-dom";

const HeroSection = (props) => {
  const message = `Hola, quisiera solicitar un turno para un checkeo general.`;
  const whatsappLink = `https://wa.me/5491127706352?text=${encodeURIComponent(message)}`;
  return (
    <section className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src={props.video} type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div className="hero-content">

        <h1> Consultorio médico <br /> integral <br />
          San Marcos</h1>
        <p className="subheading">
          {/* <span style={{
            color: "#c0ad64",
            fontWeight: "bolder"
          }}>(</span> */}
          Un equipo enfocado en tu salud y bienestar
          {/* <span style={{
            color: "#c0ad64",
            fontWeight: "bolder"
          }}>)</span> */}
        </p>
        <div className="hero-buttons">
          <Link to={`/${props.path}`} >
            {props.name}
            {/* <Icon icon="material-symbols:medical-services" />{props.name} */}
          </Link>

          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Icon icon="ic:outline-whatsapp" />
            Solicitar Turno
          </a>

        </div>
      </div>
    </section >
  );
};

export default HeroSection;
