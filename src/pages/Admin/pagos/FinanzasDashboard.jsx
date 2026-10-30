import React, { useState } from "react";
import RegistroPagosManager from "./RegistroPagosManager"; // Asegúrate de ajustar las rutas de importación según tu estructura de archivos
import ReportesFinancierosManager from "./ReportesFinancierosManager";

const FinanzasDashboard = () => {
  // Estado para controlar la pestaña activa ("registro" o "reportes")
  const [vistaActiva, setVistaActiva] = useState("registro");

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      {/* Barra de navegación de botones */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px", 
          marginBottom: "20px",
          borderBottom: "2px solid #eaeaea",
          paddingBottom: "15px"
        }}
      >
        <button
          onClick={() => setVistaActiva("registro")}
          style={{
            padding: "10px 20px",
            background: vistaActiva === "registro" ? "#007bff" : "#f8f9fa",
            color: vistaActiva === "registro" ? "#fff" : "#333",
            border: vistaActiva === "registro" ? "none" : "1px solid #ced4da",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: vistaActiva === "registro" ? "0 2px 5px rgba(0,123,255,0.3)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          💳 Registrar Pago / Ingreso
        </button>

        <button
          onClick={() => setVistaActiva("reportes")}
          style={{
            padding: "10px 20px",
            background: vistaActiva === "reportes" ? "#007bff" : "#f8f9fa",
            color: vistaActiva === "reportes" ? "#fff" : "#333",
            border: vistaActiva === "reportes" ? "none" : "1px solid #ced4da",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: vistaActiva === "reportes" ? "0 2px 5px rgba(0,123,255,0.3)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          📊 Reportes y Finanzas
        </button>
      </div>

      {/* Renderizado condicional del componente activo */}
      <div>
        {vistaActiva === "registro" && <RegistroPagosManager />}
        {vistaActiva === "reportes" && <ReportesFinancierosManager />}
      </div>
    </div>
  );
};

export default FinanzasDashboard;