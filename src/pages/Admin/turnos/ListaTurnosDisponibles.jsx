import React, { useState } from "react";
import { toast } from "react-toastify";
const ListaTurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [consultorioSeleccionado, setConsultorioSeleccionado] = useState("");
  const token = localStorage.getItem("token");

  // Notificación al obtener turnos
  const obtenerTurnosFiltrados = () => {
    if (!diaSeleccionado || !consultorioSeleccionado) {
      toast.error("Por favor, selecciona un día y un consultorio.");
      return;
    }

    const params = new URLSearchParams({
      dia: diaSeleccionado,
      consultorio: consultorioSeleccionado,
    });

    fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        setTurnos(data);
        toast.success("Turnos cargados con éxito.");
      })
      .catch(err => {
        console.error(err);
        toast.error("Error al obtener los turnos o no estás autorizado.");
      });
  };

  // Notificación al eliminar un turno
  const eliminarTurno = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este turno?");
    if (!confirm) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
        credentials: 'include',
      });

      setTurnos(turnos.filter(t => t._id !== id));
      toast.success("Turno eliminado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el turno.");
    }
  };

  return (
    <div>
      <h3 className="poppins-semibold">Seleccionar Día y Consultorio</h3>

      <section className='ui-form-container'>
        <div className="ui-form">
          <label className="ui-label poppins-regular">
            Día:{" "}
            <input
              className="ui-input"
              type="date"
              value={diaSeleccionado}
              onChange={(e) => setDiaSeleccionado(e.target.value)}
            />
          </label>
          <br />
          <label className="ui-label poppins-regular">
            Consultorio:{" "}
            <select
              className="ui-select"
              value={consultorioSeleccionado}
              onChange={(e) => setConsultorioSeleccionado(e.target.value)}
            >
              <option className="option"
                value="--selecione--">-- Seleccione --</option>
              <option value="1">Consultorio 1</option>
              <option value="2">Consultorio 2</option>
              <option value="3">Consultorio 3</option>
              <option className="ui-option" value="Consulta a domicilio">Consulta a Domicilio</option>


              {/*
               Agrega más consultorios según tu caso */}
            </select>
          </label>
          <br />
          <button onClick={obtenerTurnosFiltrados}>Buscar Turnos</button>
        </div>

      </section>

      <br />
      <h3 className="poppins-semibold">Turnos Disponibles</h3>
      <ul>
        {turnos.length === 0 && <p className="poppins-regular">No hay turnos disponibles.</p>}
        {turnos.map(t => (
          <li className="poppins-semibold" key={t._id}>
            {t.dia} | Consultorio {t.consultorio} | {t.horarios.join(", ")}
            <button onClick={() => eliminarTurno(t._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaTurnosDisponibles;
