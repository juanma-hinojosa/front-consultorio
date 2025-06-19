import React, { useEffect, useState } from "react";
import BuscarTurnoPorNombre from "./BuscarTurnoNombre";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ListaTurnosAsignados = () => {
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // Traer usuario logueado
  const doctorId = user?.id; // 👈 Esto es lo correcto según tu login

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/turnos/proximos`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        // console.log("Turnos del backend:", data);
        // console.log("ID del doctor logueado:", doctorId);
        // console.log(data)

        const turnosFiltrados = doctorId
          ? data.filter(t => {
            const turnoDoctorId = typeof t.doctor === 'string' ? t.doctor : t.doctor?._id;
            return turnoDoctorId === doctorId;
          })
          : data;

        setTurnos(turnosFiltrados);
      })
      .catch(err => {
        console.error("Error completo:", err);
        alert("No autorizado. Inicie sesión nuevamente.");
        navigate("/");
      });
  }, [doctorId, navigate]);


  const cancelarTurno = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro que deseas cancelar este turno?");
    if (!confirmacion) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/cancelar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include'
      });

      setTurnos(turnos.filter((t) => t._id !== id));
      toast.success("Turno cancelado exitosamente.");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al cancelar el turno.");
    }
  };

  const getNext7Weekdays = () => {
    const fechas = [];
    let fecha = new Date();
    while (fechas.length < 7) {
      if (fecha.getDay() !== 0) {
        fechas.push(new Date(fecha));
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    return fechas;
  };

  const formatearFecha = (fecha) => fecha.toISOString().split("T")[0];

  const turnosFiltradosPorFecha = fechaSeleccionada
    ? turnos.filter(t => {
      const fechaTurno = new Date(t.dia).toISOString().split("T")[0];
      return fechaTurno === fechaSeleccionada;
    })
    : turnos;

  return (
    <div className="poppins-semibold">
      <h3 className="poppins-semibold">Turnos Asignados (Próximos 7 días)</h3>

      <div style={{ marginBottom: "20px" }}>
        <BuscarTurnoPorNombre />
      </div>

      <div style={{
        marginBottom: "15px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "1rem",
      }}>
        {getNext7Weekdays().map((fecha, idx) => {
          const fechaStr = formatearFecha(fecha);
          return (
            <button
              key={idx}
              onClick={() => setFechaSeleccionada(fechaStr)}
              style={{
                padding: "5px 10px",
                backgroundColor: fechaStr === fechaSeleccionada ? "#4caf50" : "#e0e0e0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {fecha.toLocaleDateString("es-AR", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
            </button>
          );
        })}
        <button
          onClick={() => setFechaSeleccionada(null)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Ver todos
        </button>
      </div>

      <ul>
        {turnosFiltradosPorFecha.length === 0 && <li className="poppins-regular">No hay turnos asignados.</li>}
        {turnosFiltradosPorFecha.map(t => (
          <li key={t._id} style={{ marginBottom: "15px", borderBottom: "1px solid #ccc", paddingBottom: "10px", listStyle: "none" }}>
            <strong>Paciente:</strong> {t.paciente?.nombre} {t.paciente?.apellido} ({t.paciente?.telefono})<br />
            {t.paciente?.telefono && (
              <a
                href={`https://wa.me/54${t.paciente.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hola ${t.paciente?.nombre} ${t.paciente?.apellido}, este es un recordatorio para mañana de tu turno el día ${t.dia} a las ${t.horario} con el/la odontólogo/a ${t.doctor?.nombre}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "5px", color: "#25D366" }}
              >
                (WhatsApp)
              </a>
            )}<br />
            <strong>Doctora/o:</strong> {t.doctor?.nombre} {t.doctor?.apellido}<br />
            <strong>Especialidad:</strong> {t.doctor?.especialidad}<br />
            <strong>Día:</strong> {t.dia} | <strong>Hora:</strong> {t.horario} | <strong>Consultorio:</strong> {t.consultorio}<br />
            <strong>Categoría:</strong> {t.categoria}<br />
            <button
              onClick={() => cancelarTurno(t._id)}
              style={{
                marginTop: "5px",
                padding: "5px 10px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaTurnosAsignados;
