// Turnos.jsx
import React, { useState } from 'react';
import "../../css/pages/Turnos.css"
import GestionarTurnos from '../../components/GestionarTurnos';
import ListarTurnos from '../../components/ListarTurnos';
import EditarTurnos from '../../components/EditarTurnos';
import EliminarHorarios from '../../components/EliminarHorarios';
import CrearTurno from '../../components/CrearTurno';
import ListarTurnosReservados from '../../components/ListarTurnosReservados';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Turnos = () => {
  const [showConsultorioOptions, setShowConsultorioOptions] = useState(false);
  const [showPacientesOptions, setShowPacientesOptions] = useState(false);
  const [consultorio, setConsultorio] = useState("");
  const [pacientes, setPacientes] = useState("ver");

  return (
    <div className="gestion-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel</h2>

        <button
          className="sidebar-button"
          onClick={() => {
            setShowConsultorioOptions(!showConsultorioOptions);
            setShowPacientesOptions(false); // cerrar otras opciones
          }}
        >
          Consultorio
        </button>
        {showConsultorioOptions && (
          <div className="submenu">
            <button onClick={() => { setConsultorio('gestionar'); setPacientes(''); }}>
              Gestionar Turnos
            </button>
            <button onClick={() => { setConsultorio('listar'); setPacientes(''); }}>
              Listar Turnos Disponibles
            </button>
            <button onClick={() => { setConsultorio('editar'); setPacientes(''); }}>
              Editar Horarios
            </button>
            <button onClick={() => { setConsultorio('eliminar'); setPacientes(''); }}>
              Eliminar Horarios
            </button>
          </div>
        )}

        <button
          className="sidebar-button"
          onClick={() => {
            setShowPacientesOptions(!showPacientesOptions);
            setShowConsultorioOptions(false); // cerrar otras opciones
          }}
        >
          Pacientes
        </button>
        {showPacientesOptions && (
          <div className="submenu">
            <button onClick={() => { setPacientes('crear'); setConsultorio(''); }}>
              Reservar Turno
            </button>
            <button onClick={() => { setPacientes('ver'); setConsultorio(''); }}>
              Ver Turnos Reservados
            </button>
          </div>
        )}
      </aside>

      <main className="main-content">
        <Link className='return-link' to="/admin/dashboard">← Volver al Panel</Link>

        {consultorio === "gestionar" && <GestionarTurnos />}
        {consultorio === "listar" && <ListarTurnos />}
        {consultorio === "editar" && <EditarTurnos />}
        {consultorio === "eliminar" && <EliminarHorarios />}

        {pacientes === "crear" && <CrearTurno />}
        {pacientes === "ver" && <ListarTurnosReservados />}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Turnos;
