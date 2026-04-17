import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const BirthdayAlertManager = ({ pacientesCumple, loading }) => {

  if (loading) return <p>Cargando cumpleaños...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="poppins-regular">🎉 Cumpleaños de Pacientes</h2>

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
