import { useState } from "react";

const TurnosPorDia = () => {
  const [dia, setDia] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
    },
    title: {
      fontSize: "28px",
      marginBottom: "20px",
    },
    searchBox: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      flex: 1,
    },
    button: {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#2563eb",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 500,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    card: {
      borderRadius: "12px",
      padding: "16px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      alignItems: "center",
    },
    badge: {
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "14px",
    },
    statusBase: {
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "13px",
      textTransform: "capitalize",
      fontWeight: 500,
    },
    pending: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    done: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    error: {
      color: "#dc2626",
    },
    info: {
      color: "#666",
    },
  };

  const handleBuscar = async () => {
    if (!dia) {
      setError("Seleccioná una fecha");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/turnos/por-dia?dia=${dia}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error en la petición");
      }

      const data = await response.json();
      setTurnos(data);
    } catch (err) {
      setError(err.message || "Error al obtener turnos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Turnos por día</h2>

      <div style={styles.searchBox}>
        <input
          type="date"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleBuscar} style={styles.button}>
          Buscar
        </button>
      </div>

      {loading && <p style={styles.info}>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && turnos.length === 0 && (
        <p style={styles.info}>No hay turnos</p>
      )}

      <div style={styles.list}>
        {turnos.map((turno) => {
          const statusStyle =
            turno.estadoAtencion === "pendiente"
              ? styles.pending
              : styles.done;

          return (
            <div key={turno._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{turno.horario}</span>

                <span style={{ ...styles.statusBase, ...statusStyle }}>
                  {turno.estadoAtencion}
                </span>
              </div>

              <p><strong>Paciente:</strong> {turno.paciente?.nombre}</p>
              <p><strong>Doctor:</strong> {turno.doctor?.nombre}</p>
              <p><strong>Consultorio:</strong> {turno.consultorio}</p>
              <p><strong>Categoría:</strong> {turno.categoria}</p>
              <p><strong>Motivo:</strong> {turno.motivoDeConsulta}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TurnosPorDia;