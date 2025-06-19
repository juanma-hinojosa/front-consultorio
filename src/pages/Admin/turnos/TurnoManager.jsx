import React, { useState } from "react";
import ListaTurnosDisponibles from "./ListaTurnosDisponibles";
import AsignarTurno from "./AsignarTurno";
import ListaTurnosAsignados from "./ListarTurnosAsignados";
import CrearTurnosDisponibles from "./CrearTurnoDisponibles";

const TurnosManager = () => {
  const [vista, setVista] = useState("asignados");

  return (
    <div>
      <h2 className="poppins-semibold">Gestión de Turnos</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        // padding: "2rem"
      }}>
        <button style={{ padding: "5px 10px", }} className='poppins-light' onClick={() => setVista("crear")}>Crear Turnos Disponibles</button>
        <button style={{ padding: "5px 10px", }} className='poppins-light' onClick={() => setVista("disponibles")}>Ver/Editar Turnos Disponibles</button>
        <button style={{ padding: "5px 10px", }} className='poppins-light' onClick={() => setVista("asignar")}>Asignar Turno a Paciente</button>
        <button style={{ padding: "5px 10px", }} className='poppins-light' onClick={() => setVista("asignados")}>Turnos Asignados</button>
      </div>
      <br />
      <hr />

      {vista === "crear" && <CrearTurnosDisponibles />}
      {vista === "disponibles" && <ListaTurnosDisponibles />}
      {vista === "asignar" && <AsignarTurno />}
      {vista === "asignados" && <ListaTurnosAsignados />}
    </div>
  );
};

export default TurnosManager;
