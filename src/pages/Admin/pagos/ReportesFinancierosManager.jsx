import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportesFinancierosManager = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("mes"); // hoy, semana, mes, año, personalizado
  const [desde, setDesde] = useState("");
  const [hasta, Hasta] = useState("");

  // Modal para administrar lista de valores
  const [modalPrecios, setModalPrecios] = useState(false);
  const [nuevoTratamiento, setNuevoTratamiento] = useState({ nombre: "", precio: "", descripcion: "" });

  // Estados para la Edición de Tratamientos
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", precio: "" });

  // Calcular fechas automáticas según filtro rápido
  useEffect(() => {
    const hoy = new Date();
    let d = new Date();
    let h = new Date();

    if (filtroTipo === "hoy") {
      d = hoy;
      h = hoy;
    } else if (filtroTipo === "semana") {
      const primerDia = hoy.getDate() - hoy.getDay();
      d = new Date(hoy.setDate(primerDia));
      h = new Date();
    } else if (filtroTipo === "mes") {
      d = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      h = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    } else if (filtroTipo === "anio") {
      d = new Date(hoy.getFullYear(), 0, 1);
      h = new Date(hoy.getFullYear(), 11, 31);
    }

    if (filtroTipo !== "personalizado") {
      setDesde(d.toISOString().split("T")[0]);
      Hasta(h.toISOString().split("T")[0]);
    }
  }, [filtroTipo]);

  const cargarDatos = async () => {
    if (!desde || !hasta) return;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Cargar transacciones filtradas
      const resTrans = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/transacciones?desde=${desde}&hasta=${hasta}`, { headers, credentials: "include" });
      const dataTrans = await resTrans.json();
      setTransacciones(dataTrans);

      // Cargar lista de valores
      const resTrat = await fetch(`${import.meta.env.VITE_API_URL}/api/treatments`, { headers, credentials: "include" });
      const dataTrat = await resTrat.json();
      setTratamientos(dataTrat);
    } catch (error) {
      toast.error("Error al cargar datos financieros");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [desde, hasta]);

  // Totales de resumen
  const totalIngresado = transacciones.reduce((acc, t) => acc + t.montoPagado, 0);
  const totalDeudor = transacciones.reduce((acc, t) => acc + t.saldoDeudor, 0);

  // Exportar a PDF
  // const exportarPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(18);
  //   doc.text("Reporte Financiero - Consultorio", 14, 20);

  //   doc.setFontSize(11);
  //   doc.text(`Período: Desde ${desde} hasta ${hasta}`, 14, 28);
  //   doc.text(`Total Ingresado: $ ${totalIngresado} | Total Deudor: $ ${totalDeudor}`, 14, 35);

  //   const tableColumn = ["Fecha", "Paciente", "Concepto", "Total", "Pagado", "Saldo", "Método", "Estado"];
  //   const tableRows = [];

  //   transacciones.forEach(t => {
  //     const fechaFormateada = new Date(t.fecha).toLocaleDateString("es-AR");
  //     const pacienteNombre = t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : "Paciente eliminado";
  //     tableRows.push([
  //       fechaFormateada,
  //       pacienteNombre,
  //       t.concepto,
  //       `$ ${t.montoTotal}`,
  //       `$ ${t.montoPagado}`,
  //       `$ ${t.saldoDeudor}`,
  //       t.metodoPago,
  //       t.estado
  //     ]);
  //   });

  //   doc.autoTable({
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 42,
  //   });

  //   doc.save(`reporte-financiero_${desde}_al_${hasta}.pdf`);
  // };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte Financiero - Consultorio", 14, 20);

    doc.setFontSize(11);
    doc.text(`Período: Desde ${desde} hasta ${hasta}`, 14, 28);
    doc.text(`Total Ingresado: $ ${totalIngresado} | Total Deudor: $ ${totalDeudor}`, 14, 35);

    const tableColumn = ["Fecha", "Paciente", "Concepto", "Total", "Pagado", "Saldo", "Método", "Estado"];
    const tableRows = [];

    transacciones.forEach(t => {
      const fechaFormateada = new Date(t.fecha).toLocaleDateString("es-AR");
      const pacienteNombre = t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : "Paciente eliminado";
      tableRows.push([
        fechaFormateada,
        pacienteNombre,
        t.concepto,
        `$ ${t.montoTotal}`,
        `$ ${t.montoPagado}`,
        `$ ${t.saldoDeudor}`,
        t.metodoPago,
        t.estado
      ]);
    });

    // 👇 Llama a autoTable pasándole el doc y las opciones
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
    });

    doc.save(`reporte-financiero_${desde}_al_${hasta}.pdf`);
  };

  // Crear nuevo precio en catálogo
  const handleCrearPrecio = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(nuevoTratamiento)
      });
      if (res.ok) {
        toast.success("Tratamiento agregado a la lista de valores");
        setNuevoTratamiento({ nombre: "", precio: "", descripcion: "" });
        cargarDatos();
      } else {
        toast.error("Error al guardar valor");
      }
    } catch (err) {
      toast.error("Error de conexión");
    }
  };

  // Guardar edición de un tratamiento existente
  const handleGuardarEdicion = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/treatments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(editData)
      });

      if (res.ok) {
        toast.success("¡Precio actualizado correctamente!");
        setEditandoId(null);
        cargarDatos();
      } else {
        toast.error("Error al actualizar el tratamiento");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>Gestión de Finanzas y Reportes</h2>

      {/* Botones de filtros rápidos */}
      <div style={{ display: "flex", gap: "10px", margin: "15px 0", flexWrap: "wrap" }}>
        <button onClick={() => setFiltroTipo("hoy")} style={{ padding: "6px 12px", background: filtroTipo === "hoy" ? "#007bff" : "#e0e0e0", color: filtroTipo === "hoy" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hoy</button>
        <button onClick={() => setFiltroTipo("semana")} style={{ padding: "6px 12px", background: filtroTipo === "semana" ? "#007bff" : "#e0e0e0", color: filtroTipo === "semana" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>Esta Semana</button>
        <button onClick={() => setFiltroTipo("mes")} style={{ padding: "6px 12px", background: filtroTipo === "mes" ? "#007bff" : "#e0e0e0", color: filtroTipo === "mes" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>Este Mes</button>
        <button onClick={() => setFiltroTipo("anio")} style={{ padding: "6px 12px", background: filtroTipo === "anio" ? "#007bff" : "#e0e0e0", color: filtroTipo === "anio" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>Este Año</button>
        <button onClick={() => setFiltroTipo("personalizado")} style={{ padding: "6px 12px", background: filtroTipo === "personalizado" ? "#007bff" : "#e0e0e0", color: filtroTipo === "personalizado" ? "#fff" : "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}>Personalizado</button>

        <button onClick={() => setModalPrecios(true)} style={{ marginLeft: "auto", padding: "6px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          📋 Ver / Editar Lista de Valores
        </button>
      </div>

      {/* Inputs personalizados si se selecciona fecha custom */}
      {filtroTipo === "personalizado" && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div><label>Desde: </label><input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></div>
          <div><label>Hasta: </label><input type="date" value={hasta} onChange={e => Hasta(e.target.value)} /></div>
        </div>
      )}

      {/* Tarjetas de Resumen */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1, background: "#d4edda", padding: "15px", borderRadius: "6px", color: "#155724" }}>
          <h4>Total Ingresado</h4>
          <h2>$ {totalIngresado}</h2>
        </div>
        <div style={{ flex: 1, background: "#f8d7da", padding: "15px", borderRadius: "6px", color: "#721c24" }}>
          <h4>Total Deudor Pendiente</h4>
          <h2>$ {totalDeudor}</h2>
        </div>
      </div>

      <button onClick={exportarPDF} style={{ marginBottom: "15px", padding: "8px 15px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
        📥 Exportar Reporte a PDF
      </button>

      {/* Tabla de Transacciones */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6", textAlign: "left" }}>
              <th style={{ padding: "8px" }}>Fecha</th>
              <th style={{ padding: "8px" }}>Paciente</th>
              <th style={{ padding: "8px" }}>Concepto</th>
              <th style={{ padding: "8px" }}>Total</th>
              <th style={{ padding: "8px" }}>Pagado</th>
              <th style={{ padding: "8px" }}>Saldo Deudor</th>
              <th style={{ padding: "8px" }}>Método</th>
              <th style={{ padding: "8px" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No hay transacciones en este período.</td></tr>
            ) : (
              transacciones.map(t => (
                <tr key={t._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "8px" }}>{new Date(t.fecha).toLocaleDateString("es-AR")}</td>
                  <td style={{ padding: "8px" }}>{t.paciente ? `${t.paciente.nombre} ${t.paciente.apellido}` : "Eliminado"}</td>
                  <td style={{ padding: "8px" }}>{t.concepto}</td>
                  <td style={{ padding: "8px" }}>$ {t.montoTotal}</td>
                  <td style={{ padding: "8px", color: "green" }}>$ {t.montoPagado}</td>
                  <td style={{ padding: "8px", color: t.saldoDeudor > 0 ? "red" : "inherit" }}>$ {t.saldoDeudor}</td>
                  <td style={{ padding: "8px" }}>{t.metodoPago}</td>
                  <td style={{ padding: "8px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.8rem", background: t.estado === "Pagado" ? "#d4edda" : t.estado === "Parcial" ? "#fff3cd" : "#f8d7da", color: t.estado === "Pagado" ? "#155724" : t.estado === "Parcial" ? "#856404" : "#721c24" }}>
                      {t.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL LISTA DE VALORES */}
      {/* MODAL LISTA DE VALORES (CON OPCIÓN DE EDICIÓN) */}
      {modalPrecios && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", width: "95%", maxWidth: "650px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModalPrecios(false)} style={{ position: "absolute", top: "15px", right: "15px", border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            <h3>Lista de Valores de Tratamientos</h3>

            {/* Formulario para agregar nuevo */}
            <form onSubmit={handleCrearPrecio} style={{ display: "flex", gap: "10px", margin: "15px 0", flexWrap: "wrap" }}>
              <input type="text" placeholder="Nombre tratamiento" required value={nuevoTratamiento.nombre} onChange={e => setNuevoTratamiento({ ...nuevoTratamiento, nombre: e.target.value })} style={{ flex: 2, padding: "6px" }} />
              <input type="number" placeholder="Precio ($)" required value={nuevoTratamiento.precio} onChange={e => setNuevoTratamiento({ ...nuevoTratamiento, precio: e.target.value })} style={{ flex: 1, padding: "6px" }} />
              <button type="submit" style={{ padding: "6px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Agregar</button>
            </form>

            <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "15px 0" }} />

            {/* Lista con opción de edición inline */}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tratamientos.map(t => (
                <li key={t._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                  {editandoId === t._id ? (
                    <div style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                      <input
                        type="text"
                        value={editData.nombre}
                        onChange={e => setEditData({ ...editData, nombre: e.target.value })}
                        style={{ flex: 2, padding: "4px" }}
                      />
                      <input
                        type="number"
                        value={editData.precio}
                        onChange={e => setEditData({ ...editData, precio: e.target.value })}
                        style={{ flex: 1, padding: "4px" }}
                      />
                      <button onClick={() => handleGuardarEdicion(t._id)} style={{ padding: "4px 8px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Guardar</button>
                      <button onClick={() => setEditandoId(null)} style={{ padding: "4px 8px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <span><strong>{t.nombre}</strong></span>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ color: "#28a745", fontWeight: "bold" }}>$ {t.precio}</span>
                        <button
                          onClick={() => {
                            setEditandoId(t._id);
                            setEditData({ nombre: t.nombre, precio: t.precio });
                          }}
                          style={{ padding: "4px 8px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                        >
                          ✏️ Editar Precio
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* {modalPrecios && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", width: "95%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModalPrecios(false)} style={{ position: "absolute", top: "15px", right: "15px", border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            <h3>Lista de Valores de Tratamientos</h3>

            <form onSubmit={handleCrearPrecio} style={{ display: "flex", gap: "10px", margin: "15px 0", flexWrap: "wrap" }}>
              <input type="text" placeholder="Nombre tratamiento" required value={nuevoTratamiento.nombre} onChange={e => setNuevoTratamiento({ ...nuevoTratamiento, nombre: e.target.value })} style={{ flex: 2, padding: "6px" }} />
              <input type="number" placeholder="Precio ($)" required value={nuevoTratamiento.precio} onChange={e => setNuevoTratamiento({ ...nuevoTratamiento, precio: e.target.value })} style={{ flex: 1, padding: "6px" }} />
              <button type="submit" style={{ padding: "6px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Agregar</button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {tratamientos.map(t => (
                <li key={t._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #eee" }}>
                  <span>{t.nombre}</span>
                  <strong>$ {t.precio}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ReportesFinancierosManager;