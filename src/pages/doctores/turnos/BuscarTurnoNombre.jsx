import React, { useState } from "react";

const BuscarTurnoPorNombre = () => {
  const [nombre, setNombre] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  const buscarTurnos = async () => {
    if (!nombre.trim()) {
      setError("Ingrese un nombre o apellido");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/turnos/paciente?nombre=${encodeURIComponent(nombre)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: 'include',
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          setError("No se encontraron pacientes.");
          setResultados([]);
          return;
        }
        throw new Error("Error en la búsqueda");
      }

      const data = await res.json();
      setResultados(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al buscar.");
      setResultados([]);
    }
  };

  return (
    <div className="poppins-regular">
      <h3>Buscar Turnos por Nombre o Apellido</h3>
      <input
        type="text"
        placeholder="Ingrese nombre o apellido"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={buscarTurnos} style={{ padding: "5px 10px" }}>
        Buscar
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {resultados.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          {resultados.map(({ paciente, turnos }) => (
            <div key={paciente._id} style={{ marginBottom: "20px" }}>
              <h4>
                {paciente.nombre} {paciente.apellido} – DNI: {paciente.dni}
              </h4>
              {turnos.length > 0 ? (
                <ul>
                  {turnos.map((turno) => (
                    <li style={{listStyle:"none"}} key={turno._id}>
                      <strong>Día:</strong> {turno.dia} | <strong>Hora:</strong> {turno.horario} |{" "}
                      <strong>Consultorio:</strong> {turno.consultorio} |{" "}
                      <strong>Doctor:</strong> {turno.doctor?.nombre} {turno.doctor?.apellido} |{" "}
                      <strong>Especialidad:</strong> {turno.doctor?.especialidad} 
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "gray" }}>Este paciente no tiene turnos desde hoy.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuscarTurnoPorNombre;
