import React, { useEffect, useState } from "react";

const ListaTurnosAsignados = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/turnos")
      .then(res => res.json())
      .then(data => setTurnos(data));
  }, []);

  const cancelarTurno = async (id) => {
    await fetch(`http://localhost:5000/api/turnos/cancelar/${id}`, { method: "PUT" });
    setTurnos(turnos.filter(t => t._id !== id));
  };

  return (
    <div>
      <h3>Turnos Asignados</h3>
      <ul>
        {turnos.map(t => (
          <li key={t._id}>
            Paciente: {t.paciente?.nombre} {t.paciente?.apellido} | Día: {t.dia} | Hora: {t.horario} | Consultorio: {t.consultorio}
            <button onClick={() => cancelarTurno(t._id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaTurnosAsignados;
