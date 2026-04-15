import { Icon } from '@iconify/react/dist/iconify.js';


export default function ConsultaItem({ consulta, onDelete, onEdit, user }) {
  const {
    _id,
    pacienteId,
    doctorId,
    fecha,
    hora,
    telefono,
    linkMeet
  } = consulta;

  const isAdminOrRecep =
    user?.role === "admin" || user?.role === "recepcionista";

  const isDoctor = user?.role === "doctor";

  // 🛠️ SOLUCIÓN AL DESFASE VISUAL:
  // Extraemos año, mes y día del string que viene de la base de datos (YYYY-MM-DD)
  const [year, month, day] = fecha.substring(0, 10).split('-');
  
  // Creamos la fecha local forzando los números exactos (mes empieza en 0)
  const fechaLocal = new Date(year, month - 1, day);

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

        <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
          Dr: {doctorId?.nombre} {doctorId?.apellido}
        </p>

        {/* <p>
          {new Date(fecha).toLocaleDateString()} - {hora}

          {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR")}
        </p> */}

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
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );

}