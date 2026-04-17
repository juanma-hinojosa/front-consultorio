import { Icon } from '@iconify/react/dist/iconify.js';


export default function ConsultaItem({ consulta, onDelete, onEdit, user }) {
  const {
    _id,
    pacienteId,
    doctorId,
    fecha,
    hora,
    telefono,
    linkMeet,
    estado
  } = consulta;

  const isAdminOrRecep =
    user?.role === "admin" || user?.role === "recepcionista";

  const isDoctor = user?.role === "doctor";

  // 🛠️ SOLUCIÓN AL DESFASE VISUAL:
  // Extraemos año, mes y día del string que viene de la base de datos (YYYY-MM-DD)
  const [year, month, day] = fecha.substring(0, 10).split('-');

  // Creamos la fecha local forzando los números exactos (mes empieza en 0)
  const fechaLocal = new Date(year, month - 1, day);

  const coloresEstado = {
    pendiente: "#F59E0B",   // Naranja
    confirmado: "#10B981",  // Verde
    cancelado: "#EF4444",   // Rojo
    finalizado: "#6B7280"   // Gris
  };

  return (
    <div
      style={{
        // backgroundColor: "#111827",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
      <div>
        <p style={{ fontWeight: "600" }}>
          {pacienteId?.nombre} {pacienteId?.apellido}
        </p>

        {/* 👈 Badge de Estado */}
        <span style={{
          backgroundColor: coloresEstado[estado] || coloresEstado.pendiente,
          color: "#fff",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {estado ? estado.toUpperCase() : "PENDIENTE"}
        </span>

        <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
          Dr: {doctorId?.nombre} {doctorId?.apellido}
        </p>

        <p>
          {/* Mostramos la fecha corregida */}
          {fechaLocal.toLocaleDateString("es-AR")} - {hora}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        {/* 🔵 DOCTOR */}
        {isDoctor && (
          <>
            <a href={linkMeet} target="_blank" rel="noreferrer">
              <button
                style={{
                  backgroundColor: "#22C55E",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Icon icon="logos:google-meet" />
                Unirse
              </button>
            </a>

            <a
              href={`https://wa.me/${telefono}?text=Hola ${pacienteId?.nombre} te recordamos que tu turno es hoy ${fechaLocal} a las ${hora}. La consulta va ser por Google Meet con el link: ${linkMeet}`}
              target="_blank"
              rel="noreferrer"
            >
              <button
                style={{
                  backgroundColor: "#3B82F6",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Icon icon="logos:whatsapp-icon" />
                Compartir Link
              </button>
            </a>
          </>
        )}

        {/* 🟢 ADMIN / RECEPCIONISTA */}
        {isAdminOrRecep && (
          <>
            <a href={linkMeet} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  backgroundColor: "#22C55E",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Icon icon="logos:google-meet" />
                Unirse
              </button>
            </a>

            <a
              href={`https://wa.me/${telefono}?text=Hola ${pacienteId?.nombre} te recordamos que tu turno es hoy ${fechaLocal.toLocaleDateString("es-AR")} - ${hora}. La consulta va ser por Google Meet con el link: ${linkMeet}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  backgroundColor: "#3B82F6",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: 'none'
                }}
              >
                <Icon icon="logos:whatsapp-icon" />
                Compartir Link
              </button>
            </a>

            <button
              onClick={() => onEdit(consulta)}
              style={{
                backgroundColor: "#EAB308",
                padding: "4px 12px",
                borderRadius: "6px",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Icon icon="logos:google-calendar" />
              Alterar
            </button>

            <button
              onClick={() => onDelete(_id)}
              style={{
                backgroundColor: "#EF4444",
                padding: "4px 12px",
                borderRadius: "6px",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Icon icon="fluent:calendar-cancel-16-filled" />
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );

}