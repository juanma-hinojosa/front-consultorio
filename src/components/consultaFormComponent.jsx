import React from 'react';
import '../css/components/ConsultaForm.css';

const ConsultaForm = () => {
  return (
    <section className="consulta-section">
      <div className="consulta-overlay">
        <div className="consulta-content">
          <form className="consulta-form">
            <h2>Dejanos tu consulta</h2>
            <input type="text" placeholder="Nombre" name="nombre" required />
            <input type="text" placeholder="Apellido" name="apellido" required />
            <input type="email" placeholder="Email" name="email" required />
            <textarea placeholder="Consulta" name="consulta" required />
            <button type="submit">Enviar Consulta</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsultaForm;
