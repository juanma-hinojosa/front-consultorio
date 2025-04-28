import React, { useState } from 'react';
import "../../css/pages/Turnos.css";
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
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  const handleSelectOption = (type, action) => {
    if (type === 'consultorio') {
      setConsultorio(action);
      setPacientes('');
    } else {
      setPacientes(action);
      setConsultorio('');
    }
    setAdminSidebarOpen(false); // cerrar sidebar después de elegir
  };

  const closeSidebar = () => setAdminSidebarOpen(false);

  return (
    <div className="admin-gestion-container">

      {/* Sidebar */}
      {adminSidebarOpen && <div className="admin-overlay" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${adminSidebarOpen ? 'open' : ''}`}>
        <button className="admin-close-btn" onClick={closeSidebar}>×</button>
        <h2 className="admin-sidebar-title">Panel</h2>

        <button
          className="admin-sidebar-button"
          onClick={() => {
            setShowConsultorioOptions(!showConsultorioOptions);
            setShowPacientesOptions(false);
          }}
        >
          Consultorio
        </button>
        {showConsultorioOptions && (
          <div className="admin-submenu">
            <button onClick={() => handleSelectOption('consultorio', 'gestionar')}>Gestionar Turnos</button>
            <button onClick={() => handleSelectOption('consultorio', 'listar')}>Listar Turnos Disponibles</button>
            <button onClick={() => handleSelectOption('consultorio', 'editar')}>Editar Horarios</button>
            <button onClick={() => handleSelectOption('consultorio', 'eliminar')}>Eliminar Horarios</button>
          </div>
        )}

        <button
          className="admin-sidebar-button"
          onClick={() => {
            setShowPacientesOptions(!showPacientesOptions);
            setShowConsultorioOptions(false);
          }}
        >
          Pacientes
        </button>
        {showPacientesOptions && (
          <div className="admin-submenu">
            <button onClick={() => handleSelectOption('pacientes', 'crear')}>Reservar Turno</button>
            <button onClick={() => handleSelectOption('pacientes', 'ver')}>Ver Turnos Reservados</button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">

        {/* BOTÓN HAMBURGUESA - debajo del navbar */}
        <button className="admin-hamburger" onClick={() => setAdminSidebarOpen(true)}>
          ☰
        </button>

        <Link className="return-link" to="/admin/dashboard">← Volver al Panel</Link>

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
