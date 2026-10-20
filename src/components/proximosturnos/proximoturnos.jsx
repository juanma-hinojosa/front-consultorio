import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const GrillaTurnosRapida = () => {
  const [slotsDisponibles, setSlotsDisponibles] = useState([]);
  const [doctores, setDoctores] = useState([]); // Lista de doctores para el formulario
  const [pacientes, setPacientes] = useState([]); // Lista/búsqueda de pacientes
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de reserva rápida
  const [modalAbierto, setModalAbierto] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");

  // Formulario de asignación de turno
  const [formData, setFormData] = useState({
    paciente: "",
    doctor: "",
    categoria: "Particular",
    motivoDeConsulta: "",
  });

  // Obtener fechas de hoy y los próximos 3 días (formato YYYY-MM-DD)
  const obtenerDiasProximos = () => {
    const dias = [];
    const hoy = new Date();
    for (let i = 0; i < 4; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      dias.push(fecha.toISOString().split("T")[0]);
    }
    return dias;
  };

  // Cargar disponibilidad desde la API para los próximos días
  const cargarDisponibilidad = async () => {
    setCargando(true);
    const token = localStorage.getItem("token");
    const diasProximos = obtenerDiasProximos();

    try {
      // Hacemos la consulta para obtener los slots
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles/`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al obtener disponibilidad");
      const data = await res.json();

      // Filtrar slots para los próximos 4 días (hoy + 3 días en adelante)
      const slotsFiltrados = data.filter((slot) =>
        diasProximos.includes(slot.dia) && slot.horarios.length > 0
      );

      setSlotsDisponibles(slotsFiltrados);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar la grilla de disponibilidad");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDisponibilidad();
  }, []);

  // Formatear texto descriptivo de la fecha (Ej: "Turnos mañana", "Turnos el jueves")
  const obtenerTextoEstado = (fechaIsoStr) => {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const mananaStr = manana.toISOString().split("T")[0];

    if (fechaIsoStr === hoyStr) {
      return { texto: "Turnos hoy", color: "#4caf50", bg: "#e8f5e9" };
    } else if (fechaIsoStr === mananaStr) {
      return { texto: "Turnos mañana", color: "#2e7d32", bg: "#e8f5e9" };
    } else {
      const [anio, mes, dia] = fechaIsoStr.split("-").map(Number);
      const fechaObj = new Date(anio, mes - 1, dia);
      const diaSemana = fechaObj.toLocaleDateString("es-AR", { weekday: "long" });
      return {
        texto: `Turnos el ${diaSemana}`,
        color: "#d84315",
        bg: "#fbe9e7",
      };
    }
  };

  // Abrir modal de asignación rápida al hacer clic en un horario
  const abrirFormularioReserva = (slot, horario) => {
    setSlotSeleccionado(slot);
    setHorarioSeleccionado(horario);
    setModalAbierto(true);
  };

  // Confirmar y guardar la cita
  const handleAsignarTurno = async (e) => {
    e.preventDefault();
    if (!formData.paciente || !formData.doctor || !formData.motivoDeConsulta) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    const payload = {
      paciente: formData.paciente,
      doctor: formData.doctor,
      consultorio: slotSeleccionado.consultorio,
      dia: slotSeleccionado.dia,
      horario: horarioSeleccionado,
      categoria: formData.categoria,
      motivoDeConsulta: formData.motivoDeConsulta,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("¡Turno asignado con éxito!");
        setModalAbierto(false);
        setFormData({ paciente: "", doctor: "", categoria: "Particular", motivoDeConsulta: "" });
        cargarDisponibilidad(); // Recargar la grilla para quitar el horario reservado
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Error al asignar el turno");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ height: "12px", width: "12px", backgroundColor: "#25D366", borderRadius: "50%", display: "inline-block" }}></span>
          <h2 style={{ margin: 0, color: "#4a154b", fontSize: "1.2rem", fontWeight: "bold" }}>DISPONIBILIDAD DE TURNOS</h2>
        </div>
        <span style={{ backgroundColor: "#f3e5f5", color: "#6a1b9a", padding: "6px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
          Próximos días
        </span>
      </div>

      <h1 style={{ color: "#4a154b", fontSize: "1.6rem", marginBottom: "25px", fontWeight: "800" }}>
        Consultorios con turnos inmediatos:
      </h1>

      {cargando ? (
        <p>Cargando turnos disponibles...</p>
      ) : slotsDisponibles.length === 0 ? (
        <p>No hay turnos disponibles para los próximos días.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {slotsDisponibles.map((slot) => {
            const estado = obtenerTextoEstado(slot.dia);
            return (
              <div
                key={slot._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #f0f0f0",
                  borderRadius: "16px",
                  padding: "18px 24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  backgroundColor: "#fff",
                }}
              >
                {/* Lado Izquierdo: Información del consultorio y horarios */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      backgroundColor: "#fce4ec",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ad1457" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>

                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333", fontWeight: "bold" }}>
                      {slot.consultorio}
                    </h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                      {slot.horarios.map((horario, index) => (
                        <button
                          key={index}
                          onClick={() => abrirFormularioReserva(slot, horario)}
                          style={{
                            border: "1px solid #e0e0e0",
                            backgroundColor: "#fafafa",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "0.85rem",
                            color: "#555",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => (e.target.style.backgroundColor = "#e8f5e9")}
                          onMouseOut={(e) => (e.target.style.backgroundColor = "#fafafa")}
                        >
                          🕒 {horario}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lado Derecho: Etiqueta de disponibilidad */}
                <div>
                  <span
                    style={{
                      backgroundColor: estado.bg,
                      color: estado.color,
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ height: "8px", width: "8px", backgroundColor: estado.color, borderRadius: "50%" }}></span>
                    {estado.texto}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de asignación rápida de turno */}
      {modalAbierto && slotSeleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "25px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#4a154b" }}>Asignar Turno Rápido</h3>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
              <strong>Lugar:</strong> {slotSeleccionado.consultorio} | <strong>Fecha:</strong> {slotSeleccionado.dia} | <strong>Hora:</strong> {horarioSeleccionado}
            </p>

            <form onSubmit={handleAsignarTurno}>
              {/* ID Paciente */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                  ID / MongoDB ID Paciente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ingrese el ID del paciente"
                  value={formData.paciente}
                  onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              {/* ID Doctor */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                  ID / MongoDB ID Doctor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ingrese el ID del doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              {/* Categoría */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  <option value="Particular">Particular</option>
                  <option value="Obra Social">Obra Social</option>
                  <option value="Convenio">Convenio</option>
                </select>
              </div>

              {/* Motivo de consulta */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                  Motivo de la consulta *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ej: Chequeo general, dolor abdominal..."
                  value={formData.motivoDeConsulta}
                  onChange={(e) => setFormData({ ...formData, motivoDeConsulta: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              {/* Botones de acción */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#e0e0e0",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Confirmar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrillaTurnosRapida;