import { useState } from "react";

export default function ConsultaEditModal({ consulta, onClose, onSave }) {
  const [form, setForm] = useState(consulta);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "#62b857",
          padding: "24px",
          borderRadius: "12px",
          width: "400px"
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>
          Editar Consulta
        </h2>

        <div style={{ display: "grid", gap: "8px" }}>
          <input name="fecha" type="date" onChange={handleChange} />
          <input name="hora" placeholder="14:00" onChange={handleChange} />
          <select 
            name="estado" 
            value={form.estado || "pendiente"} 
            onChange={handleChange}
            style={{ padding: "4px" }}
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
            <option value="finalizado">Finalizado</option>
          </select>
          {/* <input name="telefono" onChange={handleChange} /> */}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px"
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#6B7280",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(consulta._id, form)}
            style={{
              backgroundColor: "#0004ff",
              padding: "10px 12px",
              borderRadius: "6px",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}