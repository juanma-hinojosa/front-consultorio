// Turnos.jsx
import React, { useState } from 'react';
import VistaConsultorio from '../Turnos/VistaConsultorio';
import VistaPacientes from '../Turnos/VistaPaciente';
import "../../css/pages/Turnos.css"
import { Link } from 'react-router-dom';

const Turnos = () => {
  const [view, setView] = useState('pacientes'); // Estado para gestionar qué vista mostrar

  return (
    <div
      className="turnos-dashboard"
    >
      <h2>Gestión de Turnos</h2>
      <div className="turnos-nav-buttons">

        <button onClick={() => setView('consultorio')}>Consultorio</button>
        <button onClick={() => setView('pacientes')}>Pacientes</button>
        <Link to="/admin/dashboard">Volver</Link>
      </div>


      {view === 'consultorio' && <VistaConsultorio />}
      {view === 'pacientes' && <VistaPacientes />}
    </div>
  );
};

export default Turnos;
