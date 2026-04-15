import { useEffect, useState } from "react";
import ConsultaForm from "./ConsultaForm";
import ConsultaList from "./ConsultaList";
import ConsultaEditModal from "./ConsultaEditModal";

const API = `${import.meta.env.VITE_API_URL}/api/consultas-virtuales`;

export default function ConsultaVirtualManager() {
  const [consultas, setConsultas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('listar');
  const [user, setUser] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // 🟢 GET
  const fetchConsultas = async () => {
    try {
      setLoading(true);

      const res = await fetch(API, {
        method: "GET",
        credentials: "include",
        headers: getHeaders(),
      });

      const data = await res.json();
      setConsultas(data);
    } catch (error) {
      console.error("Error al obtener consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // 🟡 POST
  const crear = async (data) => {
    try {
      await fetch(API, {
        method: "POST",
        credentials: "include",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      fetchConsultas();
    } catch (error) {
      console.error("Error al crear consulta:", error);
    }
  };

  // 🔴 DELETE
  const eliminar = async (id) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getHeaders(),
      });

      fetchConsultas();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // 🔵 PUT
  const actualizar = async (id, data) => {
    try {
      await fetch(`${API}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      setEditando(null);
      fetchConsultas();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const isAdminOrRecep =
    user?.role === "admin" || user?.role === "recepcionista";


  const generarDias = () => {
    const dias = [];
    const hoy = new Date();

    let i = 0;
    while (dias.length < 7) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);

      const esDomingo = fecha.getDay() === 0;

      if (!esDomingo) {
        dias.push(new Date(fecha));
      }

      i++;
    }

    return dias;
  };

  const filtrarConsultas = () => {
    // if (!diaSeleccionado) return consultas;

    if (!diaSeleccionado) {
      const ahora = new Date();

      return consultas
        .filter((c) => {
          const [year, month, day] = c.fecha.substring(0, 10).split('-');
          const fechaConsulta = new Date(year, month - 1, day);

          const [h, m] = c.hora.split(":");
          const fechaHoraConsulta = new Date(fechaConsulta);
          fechaHoraConsulta.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

          return fechaHoraConsulta >= ahora; // 👈 solo futuros
        })
        .sort((a, b) => {
          const fechaA = new Date(`${a.fecha.substring(0, 10)}T${a.hora}`);
          const fechaB = new Date(`${b.fecha.substring(0, 10)}T${b.hora}`);
          return fechaA - fechaB; // más próximo primero
        });
    }

    const ahora = new Date();

    return consultas.filter((c) => {
      // 🛠️ SOLUCIÓN AL DESFASE DE DÍA:
      // Cortamos los primeros 10 caracteres (YYYY-MM-DD) y los separamos
      const [year, month, day] = c.fecha.substring(0, 10).split('-');

      // Armamos la fecha forzando la zona horaria local. 
      // Nota: El mes en JavaScript empieza en 0, por eso month - 1.
      const fechaConsulta = new Date(year, month - 1, day);

      const mismaFecha =
        fechaConsulta.toDateString() ===
        new Date(diaSeleccionado).toDateString();

      if (!mismaFecha) return false;

      // Si es hoy, filtrar por hora actual
      const esHoy =
        fechaConsulta.toDateString() === ahora.toDateString();

      if (esHoy) {
        const [h, m] = c.hora.split(":");
        const fechaHoraConsulta = new Date(fechaConsulta);
        fechaHoraConsulta.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

        return fechaHoraConsulta >= ahora;
      }

      return true;
    });

  };

  return (
    <div style={{ padding: "24px", maxWidth: "1024px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Consultas Virtuales
      </h1>

      <div>
        {isAdminOrRecep && (
          <button
            style={{ padding: "5px 10px" }}
            onClick={() => setVista('crear')}
          >
            Agendar Consulta
          </button>
        )}

        <button
          style={{ padding: "5px 10px", marginLeft: "8px" }}
          onClick={() => setVista('listar')}
        >
          Consultas Agendadas
        </button>
      </div>

      {vista === 'crear' && <ConsultaForm onSubmit={crear} />}


      {vista === 'listar' && (
        <>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
            <button
              onClick={() => setDiaSeleccionado(null)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: diaSeleccionado === null ? "#3B82F6" : "#fff",
                color: diaSeleccionado === null ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: diaSeleccionado === null ? "bold" : "normal"
              }}
            >
              Todos
            </button>
            {generarDias().map((dia, index) => (
              <button
                key={index}
                onClick={() => setDiaSeleccionado(dia)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor:
                    diaSeleccionado &&
                      new Date(diaSeleccionado).toDateString() === dia.toDateString()
                      ? "#3B82F6"
                      : "#fff",
                  color:
                    diaSeleccionado &&
                      new Date(diaSeleccionado).toDateString() === dia.toDateString()
                      ? "#fff"
                      : "#000",
                  cursor: "pointer"
                }}
              >
                {dia.toLocaleDateString("es-AR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                })}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ConsultaList
              // consultas={consultas}
              consultas={filtrarConsultas()}
              // consultas={[...filtrarConsultas()].reverse()}
              onDelete={eliminar}
              onEdit={setEditando}
              user={user}
            />
          )}

          {editando && (
            <ConsultaEditModal
              consulta={editando}
              onClose={() => setEditando(null)}
              onSave={actualizar}
            />
          )}
        </>
      )}
    </div>
  );
}