import { useState } from 'react';
import CrearTurno from '../../components/CrearTurno';
import ListarTurnosReservados from '../../components/ListarTurnosReservados';

function VistaPacientes() {
  const [pacientes, setPacientes] = useState('ver');
  return (
    <div>
      <h3>Gestión de turnos para pacientes</h3>
      <div className="paciente-subnav">
        <button style={{backgroundColor: "green"}} onClick={() => setPacientes('crear')}>Reservar Turno</button>
        <button style={{backgroundColor: "green"}} onClick={() => setPacientes('ver')}>Ver Turnos Reservados</button>
      </div>

      {pacientes === 'crear' && <CrearTurno />}
      {pacientes === 'ver' && <ListarTurnosReservados />}
    </div>
  );
}

export default VistaPacientes;
