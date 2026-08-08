import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const BirthdayEmployeeManager = ({ empleadosCumple, loading }) => {
  if (loading) return <p style={{ padding: "20px" }}>Cargando cumpleaños del personal...</p>;

 return (
    <div style={{ padding: "20px" }}>
      <h2 className="poppins-regular">🎉 Cumpleaños del Personal</h2>

      {empleadosCumple.length === 0 && (
        <p>No hay cumpleaños del personal hoy ni en los próximos 7 días.</p>
      )}

      {empleadosCumple.map((p, idx) => (
        <div
          key={idx}
          style={{
            padding: "15px",
            marginTop: "10px",
            // Alerta roja de fondo si es hoy, azul si solo es próximo
            background: p.hoy ? "#ffb3b3" : "#e4f0ff",
            border: p.hoy ? "2px solid red" : "1px solid #b3d7ff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Icon
            icon={p.hoy ? "mdi:cake-variant" : "mdi:calendar-clock"}
            width="30"
            color={p.hoy ? "red" : "#0056b3"}
          />
          <div>
            <strong>{p.nombre} {p.apellido}</strong>
            <span style={{ fontSize: '11px', background: '#ccc', padding: '2px 6px', borderRadius: '5px', marginLeft: '10px', textTransform: 'uppercase' }}>
              {p.role}
            </span>
            
            <p style={{ margin: "5px 0 0 0" }}>
              {p.hoy
                ? `🎂 ¡Hoy es su cumpleaños! Cumple ${p.cumpleAnios} años.`
                : `Cumple el ${p.dia}/${p.mes} (en ${p.diasFaltantes} ${p.diasFaltantes === 1 ? 'día' : 'días'}) y cumple ${p.cumpleAnios} años.`
              }
            </p>
            <span style={{ fontSize: '13px', color: '#555' }}>🎈 ¡Felicita a tu compañero/a de equipo en su día!</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BirthdayEmployeeManager;