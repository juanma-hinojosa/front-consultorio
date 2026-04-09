import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const BirthdayAlertManager = ({ setBirthdayAlert }) => {
  const [pacientesCumple, setPacientesCumple] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCumpleaños = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const pacientes = await res.json();
        const hoy = new Date();

        const proximos = [];

        pacientes.forEach(p => {
          if (!p.fechaNacimiento) return;

          // Evitar errores de zona horaria
          const [anioStr, mesStr, diaStr] = p.fechaNacimiento.split("T")[0].split("-");
          const diaNac = parseInt(diaStr);
          const mesNac = parseInt(mesStr);
          const anioNac = parseInt(anioStr);

          const esHoy = hoy.getDate() === diaNac && hoy.getMonth() + 1 === mesNac;

          const años = hoy.getFullYear() - anioNac;

          const cumpleEsteAño = new Date(hoy.getFullYear(), mesNac - 1, diaNac);
          const diff = (cumpleEsteAño - hoy) / (1000 * 60 * 60 * 24);

          if (esHoy || (diff >= 0 && diff <= 7)) {
            proximos.push({
              nombre: p.nombre,
              apellido: p.apellido,
              telefono: p.telefono,
              dia: diaNac,
              mes: mesNac,
              cumpleAnios: años,
              hoy: esHoy
            });
          }
        });

        setPacientesCumple(proximos);

        // Si hay cumpleaños hoy, avisamos al Dashboard
        const hayCumplesHoy = proximos.some(p => p.hoy);
        setBirthdayAlert(hayCumplesHoy);

        if (hayCumplesHoy) {
          const todayKey = new Date().toISOString().split("T")[0];
          const lastPlayed = localStorage.getItem("birthdaySoundPlayed");

          if (lastPlayed !== todayKey) {
            const audio = new Audio('/sonido.mp3')
            audio.play().catch(() => { });
            localStorage.setItem('birthdaySoundPlayed', todayKey)
          }
        }


      } catch (error) {
        console.error("Error obteniendo cumpleaños:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCumpleaños();
  }, []);


  if (loading) return <p>Cargando cumpleaños...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="poppins-regular">🎉 Cumpleaños de Pacientes</h2>

      {/* <button
        onClick={() => {
          const audio = new Audio("/sonido.mp3");
          audio.play().catch(err => console.warn(err));
        }}
        style={{
          marginBottom: "15px",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "none",
          background: "#4caf50",
          color: "white",
          cursor: "pointer"
        }}
      >
        🔊 Probar sonido
      </button> */}

      {pacientesCumple.length === 0 && (
        <p>No hay cumpleaños hoy ni en los próximos días.</p>
      )}

      {pacientesCumple.map((p, idx) => (
        <div
          key={idx}
          style={{
            padding: "15px",
            marginTop: "10px",
            background: p.hoy ? "#ffb3b3" : "#e4f0ff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Icon
            icon={p.hoy ? "mdi:party-popper" : "mdi:calendar"}
            width="30"
          />
          <div>
            <strong>{p.nombre} {p.apellido}</strong>
            <p>
              {p.hoy
                ? `🎂 ¡Hoy cumple ${p.cumpleAnios} años!`
                : `Cumple el ${p.dia}/${p.mes} y cumple ${p.cumpleAnios} años`
              }
            </p>


            <a
              href={`https://wa.me/54${p.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hola que tal ${p.nombre} ${p.apellido}, de parte del Consultorio San Marcos te queremos desear un feliz cumpleaños!!!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              📞 {p.telefono ? p.telefono : "Sin teléfono registrado"}
            </a>

          </div>
        </div>
      ))}
    </div>
  );
};

export default BirthdayAlertManager;

