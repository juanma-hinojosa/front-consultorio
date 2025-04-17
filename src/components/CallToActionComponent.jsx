import "../css/components/CallToAction.css";
import React from "react";
import doctorImage from "/salud.jpg"; // Ruta al archivo de imagen (colocala en public o src/assets)


const CallToAction = () => {
  const items = [
    "Servicio que se da",
    "Servicio que se da",
    "Servicio que se da",
  ];

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-image">
          <img src={doctorImage} alt="Doctor con paciente" />
        </div>
        <div className="cta-content">
          <h2>
            Texto generico para mostrar, captar la atencion y llamar a la
            accion.
          </h2>
          <p>
            Parrafo generico para explicar un poco mas detalle la funcion, los
            beneficios, el tratamiento y mejoras para que la informacion sea
            como una introduccion bien detallada para que el cliente solicite
            el servicio.
          </p>

          <ul className="cta-list">
            {items.map((item, index) => (
              <li
                className="cta-list-item"
                key={index}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className="check-icon">✓</span> {item}
              </li>
            ))}
          </ul>

          <button className="cta-button">Solicitar Turno</button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
