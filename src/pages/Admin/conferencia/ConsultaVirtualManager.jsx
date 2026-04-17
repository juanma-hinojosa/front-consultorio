import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConsultaForm from "./ConsultaForm";
import ConsultaList from "./ConsultaList";
import ConsultaEditModal from "./ConsultaEditModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import SinConsultaComponent from "./SinConsulta";


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

      // toast.success("Consulta asignada con éxito");
      fetchConsultas();
      setVista('listar');
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

      toast.error("Turno Eliminado");
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


      toast.success("Turno alterado");
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
    // 👈 PUNTO 1: Condicionar listado si es Doctor
    let consultasBase = consultas;
    if (user?.role === "doctor") {
      consultasBase = consultas.filter((c) => {
        // Obtenemos el ID del doctor en la consulta (soporta si está populado o no)
        const idDoctorConsulta = String(c.doctorId?._id || c.doctorId);

        // Obtenemos el ID del usuario logueado (soporta si tu auth manda _id o id)
        const idLogueado = String(user?._id || user?.id);

        return idDoctorConsulta === idLogueado;
      });
    }

    if (!diaSeleccionado) {
      const ahora = new Date();

      return consultasBase // 👈 Usar consultasBase en lugar de consultas
        .filter((c) => {
          const [year, month, day] = c.fecha.substring(0, 10).split('-');
          const fechaConsulta = new Date(year, month - 1, day);

          const [h, m] = c.hora.split(":");
          const fechaHoraConsulta = new Date(fechaConsulta);
          fechaHoraConsulta.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

          return fechaHoraConsulta >= ahora;
        })
        .sort((a, b) => {
          const fechaA = new Date(`${a.fecha.substring(0, 10)}T${a.hora}`);
          const fechaB = new Date(`${b.fecha.substring(0, 10)}T${b.hora}`);
          return fechaA - fechaB;
        });
    }

    const ahora = new Date();

    return consultasBase.filter((c) => { // 👈 Usar consultasBase en lugar de consultas
      const [year, month, day] = c.fecha.substring(0, 10).split('-');
      const fechaConsulta = new Date(year, month - 1, day);

      const mismaFecha =
        fechaConsulta.toDateString() ===
        new Date(diaSeleccionado).toDateString();

      if (!mismaFecha) return false;

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

  // Guardamos las consultas filtradas en una variable para poder evaluar si está vacía en el render
  const consultasListado = filtrarConsultas();

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
            {generarDias().map((dia, index) => {
              // 👈 PUNTO 1: Verificamos si el 'dia' de la iteración coincide con la fecha de hoy
              const esHoy = dia.toDateString() === new Date().toDateString();

              return (
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
                  {/* Si es hoy mostramos "Hoy", sino, la fecha formateada */}
                  {esHoy ? "Hoy" : dia.toLocaleDateString("es-AR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                  })}
                </button>
              );
            }
              // (

              //   <button
              //     key={index}
              //     onClick={() => setDiaSeleccionado(dia)}
              //     style={{
              //       padding: "6px 12px",
              //       borderRadius: "6px",
              //       border: "1px solid #ccc",
              //       backgroundColor:
              //         diaSeleccionado &&
              //           new Date(diaSeleccionado).toDateString() === dia.toDateString()
              //           ? "#3B82F6"
              //           : "#fff",
              //       color:
              //         diaSeleccionado &&
              //           new Date(diaSeleccionado).toDateString() === dia.toDateString()
              //           ? "#fff"
              //           : "#000",
              //       cursor: "pointer"
              //     }}
              //   >
              //     {dia.toLocaleDateString("es-AR", {
              //       weekday: "short",
              //       day: "numeric",
              //       month: "short"
              //     })}
              //   </button>
              // )
            )}
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "16px",
                color: "#555",
                minHeight: "300px", // 👈 clave
                width: "100%",
              }}
            >
              <Icon icon="line-md:loading-loop" style={{ fontSize: "20px" }} />
              <p style={{ margin: 0 }}>Cargando...</p>
            </div>
          ) : consultasListado.length === 0 ? (
            // 👈 PUNTO 2: Si el listado de consultas filtrado está vacío, mostramos el componente
            <SinConsultaComponent />
          ) : (
            <ConsultaList
              consultas={consultasListado}
              onDelete={eliminar}
              onEdit={setEditando}
              user={user}
            />
          )

            // (
            //   // La lista debe renderizar unicamente los turnos de el doctor asignado, no de todos los profesionales
            //   <ConsultaList
            //     consultas={filtrarConsultas()}
            //     onDelete={eliminar}
            //     onEdit={setEditando}
            //     user={user}
            //   />
            // )
          }

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