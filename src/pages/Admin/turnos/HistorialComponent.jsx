import { useState } from "react";

const TurnosPorDia = () => {
  const [dia, setDia] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 IMPORTANTE: fetch no tira error en 400/500
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error en la petición");
      }

      const data = await response.json();
      setTurnos(data);

    } catch (err) {
      console.error(err);
      setError(err.message || "Error al obtener turnos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Turnos por día</h2>

      {/* Buscador */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="date"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
        />
        <button onClick={handleBuscar} style={{ marginLeft: "10px" }}>
          Buscar
        </button>
      </div>

      {/* Estados */}
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista */}
      {!loading && turnos.length === 0 && <p>No hay turnos</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {turnos.map((turno) => (
          <li
            key={turno._id}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "12px",
            }}
          >
            <p><strong>Horario:</strong> {turno.horario}</p>
            <p><strong>Paciente:</strong> {turno.paciente?.nombre}</p>
            <p><strong>Doctor:</strong> {turno.doctor?.nombre}</p>
            <p><strong>Consultorio:</strong> {turno.consultorio}</p>
            <p><strong>Categoría:</strong> {turno.categoria}</p>

            <p>
              <strong>Motivo:</strong> {turno.motivoDeConsulta}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {turno.estadoAtencion === "pendiente"
                ? "Pendiente"
                : "Atendido"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TurnosPorDia;