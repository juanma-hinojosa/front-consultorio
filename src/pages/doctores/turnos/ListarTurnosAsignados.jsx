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

  const formatearFechaLarga = (fechaStr) => {
    const [anio, mes, dia] = fechaStr.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia); // el mes es 0-based
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    const fechaFormateada = fecha.toLocaleDateString('es-AR', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

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


      {/* Lista de turnos */}
      <ul>
        {/* Loading */}
        {turnosFiltradosPorFecha.length === 0 && <li className="poppins-regular">No hay turnos asignados.</li>}

        {/* Iteracion de turnos */}
        {turnosFiltradosPorFecha.map(t => (
          <li
            key={t._id}
            style={{
              marginBottom: "15px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              listStyle: "none"
            }}
          >
            <strong>Paciente:</strong> {t.paciente?.nombre} {t.paciente?.apellido} ({t.paciente?.telefono})<br />
            {t.paciente?.telefono && (
              <a
                href={`https://wa.me/54${t.paciente.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hola ${t.paciente?.nombre} ${t.paciente?.apellido}, este es un recordatorio para mañana de tu turno el día ${formatearFechaLarga(t.dia)} a las ${t.horario} con el/la doctor/a ${t.doctor?.nombre} ${t.doctor?.apellido}. Podras asistir a la consulta?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "5px", color: "#25D366" }}
              >
                (WhatsApp)
              </a>
            )}
            <br />
            <strong>Doctora/o:</strong> {t.doctor?.nombre} {t.doctor?.apellido}<br />
            <strong>Especialidad:</strong> {Array.isArray(t.doctor?.especialidad) ? t.doctor?.especialidad.join(', ') : '-'}<br />
            <strong>Motivo de la consulta:</strong> {t.motivoDeConsulta}<br />
            <strong>Día:</strong> {t.dia} | <strong>Hora:</strong> {t.horario} | <strong>Consultorio:</strong> {t.consultorio}<br />
            <strong>Categoría:</strong> {t.categoria}<br />
            <strong>Estado:</strong>{" "}
            <span style={{
              color: t.estadoAtencion === "atendido" ? "green" : "orange",
              fontWeight: "bold"
            }}>
              {t.estadoAtencion === "atendido" ? "Atendido" : "Pendiente"}
            </span>
            <br />

            {t.estadoAtencion === "pendiente" && (
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/${t._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      },
                      body: JSON.stringify({ estadoAtencion: "atendido" }),
                    });
                    const actualizado = await res.json();
                    if (res.ok) {
                      setTurnos(turnos.map(turno => turno._id === t._id ? actualizado : turno));
                      toast.success("El paciente fue marcado como atendido.");
                    } else {
                      toast.error(actualizado.error || "Error al actualizar el turno.");
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("No se pudo actualizar el estado del turno.");
                  }
                }}
                style={{
                  marginTop: "5px",
                  padding: "5px 10px",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Marcar como Atendido
              </button>
            )}

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
