import React, { useState } from 'react';
import CrearPaciente from './CrearPaciente';
import ListaPacientes from './ListaPacientes';
import FichaPaciente from './FichaPaciente';


const PacienteManager = () => {
  const [vistaActual, setVistaActual] = useState('listar'); // '', 'crear', 'listar', 'ficha'
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const manejarVista = (vista) => {
    setVistaActual(vista);
    setPacienteSeleccionado(null); // reset por si estaba viendo ficha
  };

  return (
    <div className="paciente-manager">
      <h2 className='poppins-semibold' >Gestión de Pacientes</h2>
      <div className="botones-manager poppins-regular" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        // padding: "2rem"
      }}>
        <button style={{ padding: "5px 10px" }} onClick={() => manejarVista('crear')} className='poppins-light'>Crear Paciente</button>
        <button style={{ padding: "5px 10px" }} onClick={() => manejarVista('listar')} className='poppins-light'>Listar Pacientes</button>
      </div>

      <br />
      <hr />

      <div className="vista-dinamica">
        {vistaActual === 'crear' && <CrearPaciente onVolver={() => manejarVista('')} />}
        {vistaActual === 'listar' && (
          <ListaPacientes
            onVerFicha={(paciente) => {
              setPacienteSeleccionado(paciente);
              setVistaActual('ficha');
            }}
          />
        )}
        {vistaActual === 'ficha' && pacienteSeleccionado && (
          <FichaPaciente paciente={pacienteSeleccionado} onVolver={() => manejarVista('listar')} />
        )}
      </div>
    </div>
  );
};

export default PacienteManager;
