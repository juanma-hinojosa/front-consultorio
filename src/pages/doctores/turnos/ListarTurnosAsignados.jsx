import { useEffect, useState } from "react";
import BuscarTurnoPorNombre from "./BuscarTurnoNombre";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const ListaTurnosAsignados = () => {
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const navigate = useNavigate();

  // Estados para el Modal de Historia Clínica
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [registrosHistoria, setRegistrosHistoria] = useState([]);
  const [cargandoRegistros, setCargandoRegistros] = useState(false);

  // Estados para el formulario de Nueva Entrada dentro del Modal
  const [vistaCrear, setVistaCrear] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const cambiarEstadoTurno = async (id, nuevoEstado, mensajeExito) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ estadoAtencion: nuevoEstado }),
      });

      const actualizado = await res.json();

      if (res.ok) {
        setTurnos(prevTurnos =>
          prevTurnos.map(turno => {
            if (turno._id === id) {
              // Mantenemos la información original de paciente y doctor
              return {
                ...turno,
                ...actualizado,
                paciente: turno.paciente,
                doctor: turno.doctor
              };
            }
            return turno;
          })
        );
        toast.success(mensajeExito);
      } else {
        toast.error(actualizado.error || "Error al actualizar el turno.");
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar el estado del turno.");
    }
  };

  // Función para abrir la historia clínica del paciente del turno
  const abrirHistoriaClinicaModal = async (pacienteObj) => {
    if (!pacienteObj || !pacienteObj._id) {
      toast.error("Información de paciente no disponible");
      return;
    }
    setPacienteSeleccionado(pacienteObj);
    setModalAbierto(true);
    setVistaCrear(false);
    await cargarRegistrosHistoria(pacienteObj._id);
  };

  const cargarRegistrosHistoria = async (pacienteId) => {
    setCargandoRegistros(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/paciente/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setRegistrosHistoria(data);
      } else {
        toast.error("Error al obtener la historia clínica");
      }
    } catch (error) {
      console.error('Error al obtener registros', error);
      toast.error('Error de conexión al buscar historia clínica');
    } finally {
      setCargandoRegistros(false);
    }
  };

  // Guardar nueva entrada de historia clínica desde el modal
  const handleCrearEntrada = async (e) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('paciente', pacienteSeleccionado._id);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    for (let i = 0; i < archivos.length; i++) {
      formData.append('imagenes', archivos[i]); // Manteniendo la key 'imagenes' que usa tu backend multer
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear entrada');

      toast.success('Entrada creada en historia clínica');
      setTitulo('');
      setDescripcion('');
      setArchivos([]);
      setVistaCrear(false);
      await cargarRegistrosHistoria(pacienteSeleccionado._id); // Recargar registros
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al guardar la entrada');
    } finally {
      setIsSubmitting(false);
    }
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

            <strong>Día:</strong> {t.dia} | <strong>Hora:</strong> {t.horario} | <strong>Consultorio:</strong> {t.consultorio}
            {t.consultorio === "Consulta a domicilio" && (
              <> | <strong>Dirección:</strong> {t.paciente?.direccion || "Sin dirección registrada"}</>
            )}
            <br />

            <strong>Categoría:</strong> {t.categoria}<br />
            <strong>Estado:</strong>{" "}
            <span style={{
              color: t.estadoAtencion === "atendido" ? "green" : t.estadoAtencion === "sala de espera" ? "#ff9800" : "orange",
              fontWeight: "bold"
            }}>
              {t.estadoAtencion === "atendido"
                ? "Atendido"
                : t.estadoAtencion === "sala de espera"
                  ? "Sala de espera"
                  : "Pendiente"}
            </span>
            <br />

            {/* BOTONES DE HISTORIA CLÍNICA DIRECTOS */}
            <div style={{ margin: "8px 0" }}>
              <button
                onClick={() => abrirHistoriaClinicaModal(t.paciente)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#673ab7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "8px"
                }}
              >
                📂 Ver / Crear Historia Clínica
              </button>
            </div>

            {/* Botón para pasar de Pendiente a Sala de Espera */}
            {t.estadoAtencion === "pendiente" && (
              <button
                onClick={() => cambiarEstadoTurno(t._id, "sala de espera", "El paciente fue ingresado a la sala de espera.")}
                style={{
                  marginTop: "5px",
                  padding: "5px 10px",
                  backgroundColor: "#ff9800",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Pasar a la Sala de Espera
              </button>
            )}

            {/* Botón para marcar como Atendido (disponible si está pendiente o en sala de espera) */}
            {t.estadoAtencion !== "atendido" && (
              <button
                onClick={() => cambiarEstadoTurno(t._id, "atendido", "El paciente fue marcado como atendido.")}
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

      {/* MODAL DE HISTORIA CLÍNICA */}
      {modalAbierto && pacienteSeleccionado && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 1000, padding: "20px"
          }}>
          <div
            style={{
              backgroundColor: "#fff", borderRadius: "8px", width: "100%", maxWidth: "700px",
              maxHeight: "90vh", overflowY: "auto", padding: "25px", position: "relative",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
            }}>
            <button
              onClick={() => setModalAbierto(false)}
              style={{
                position: "absolute", top: "15px", right: "15px", background: "none",
                border: "none", fontSize: "1.2rem", cursor: "pointer", fontWeight: "bold"
              }}
            >
              ✕
            </button>

            <h2 style={{ marginTop: 0, color: "#333" }}>
              Historia Clínica: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              DNI: {pacienteSeleccionado.dni || "No registrado"} | Teléfono: {pacienteSeleccionado.telefono}
            </p>

            {/* Pestañas internas del Modal: Ver Historial vs Crear Nueva Entrada */}
            <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
              <button
                onClick={() => setVistaCrear(false)}
                style={{
                  padding: "8px 15px", background: !vistaCrear ? "#007bff" : "#e0e0e0",
                  color: !vistaCrear ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer"
                }}
              >
                Ver Entradas ({registrosHistoria.length})
              </button>
              <button
                onClick={() => setVistaCrear(true)}
                style={{
                  padding: "8px 15px", background: vistaCrear ? "#007bff" : "#e0e0e0",
                  color: vistaCrear ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer"
                }}
              >
                ➕ Nueva Entrada
              </button>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "15px 0" }} />

            {/* VISTA 1: CREAR NUEVA ENTRADA */}
            {vistaCrear ? (
              <form onSubmit={handleCrearEntrada} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ margin: 0 }}>Agregar registro a la historia clínica</h4>
                <input
                  type="text"
                  placeholder="Título del tratamiento o diagnóstico"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  required
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <textarea
                  placeholder="Descripción detallada de la consulta..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={6}
                  required
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <div>
                  <label style={{ fontSize: "0.85rem", display: "block", marginBottom: "5px" }}>Adjuntar archivos (Imágenes o PDF):</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => setArchivos([...e.target.files])}
                    accept="image/*,application/pdf"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setVistaCrear(false)}
                    style={{ padding: "8px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ padding: "8px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Entrada"}
                  </button>
                </div>
              </form>
            ) : (
              /* VISTA 2: LISTADO DE REGISTROS DE HISTORIA CLÍNICA */
              <div>
                {cargandoRegistros ? (
                  <p>Cargando historia clínica...</p>
                ) : registrosHistoria.length === 0 ? (
                  <p style={{ color: "#777", fontStyle: "italic" }}>Este paciente aún no registra entradas en su historia clínica.</p>
                ) : (
                  registrosHistoria.map(r => (
                    <div key={r._id} style={{ border: '1px solid #ddd', borderRadius: '6px', margin: '10px 0', padding: '12px', background: '#fafafa' }}>
                      <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{r.titulo}</h4>
                      <p style={{ margin: '3px 0' }}><strong>Doctor:</strong> {r.doctor?.nombre} {r.doctor?.apellido} ({r.doctor?.role})</p>
                      <p style={{ margin: '3px 0' }}><strong>Especialidad:</strong> {Array.isArray(r.doctor?.especialidad) ? r.doctor?.especialidad.join(', ') : '-'}</p>
                      <p style={{ whiteSpace: 'pre-line', margin: '8px 0' }}><strong>Descripción:</strong> {r.descripcion}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '5px 0' }}>
                        <strong>Fecha:</strong> {new Date(r.fecha).toLocaleDateString('es-AR', {
                          timeZone: 'America/Argentina/Buenos_Aires', day: 'numeric', month: 'long', year: 'numeric'
                        })} a las {new Date(r.fecha).toLocaleTimeString('es-AR', {
                          timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false
                        })} hs
                      </p>

                      {/* Visualización de Archivos adjuntos */}
                      {r.archivos && r.archivos.length > 0 && (
                        <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {r.archivos.map((archivo, i) => {
                            const esPDF = archivo.toLowerCase().endsWith('.pdf');
                            return esPDF ? (
                              <a
                                key={i}
                                href={archivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: '#007bff', color: 'white', padding: '5px 10px',
                                  borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem'
                                }}
                              >
                                📄 Ver PDF
                              </a>
                            ) : (
                              <LightGallery key={i} speed={500} plugins={[lgThumbnail, lgZoom]}>
                                <a href={archivo}>
                                  <img src={archivo} alt="adjunto" width="80" style={{ borderRadius: "4px", border: "1px solid #ccc" }} />
                                </a>
                              </LightGallery>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaTurnosAsignados;
