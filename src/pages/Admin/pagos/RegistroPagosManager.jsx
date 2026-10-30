// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const RegistroPagosManager = () => {
//   const [pacientes, setPacientes] = useState([]);
//   const [tratamientos, setTratamientos] = useState([]);
//   const [busquedaPaciente, setBusquedaPaciente] = useState("");
  
//   const [formData, setFormData] = useState({
//     paciente: "",
//     concepto: "",
//     montoTotal: "",
//     montoPagado: "",
//     metodoPago: "Efectivo"
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const headers = { Authorization: `Bearer ${token}` };

//     // Cargar pacientes
//     fetch(`${import.meta.env.VITE_API_URL}/api/patients`, { headers, credentials: "include" })
//       .then(res => res.json())
//       .then(data => setPacientes(data))
//       .catch(() => toast.error("Error al cargar pacientes"));

//     // Cargar lista de valores de tratamientos
//     fetch(`${import.meta.env.VITE_API_URL}/api/treatments`, { headers, credentials: "include" })
//       .then(res => res.json())
//       .then(data => setTratamientos(data))
//       .catch(() => toast.error("Error al cargar lista de valores"));
//   }, []);

//   // Al seleccionar un tratamiento de la lista, autocompletar precio y concepto
//   const handleSelectTratamiento = (e) => {
//     const tratamientoNombre = e.target.value;
//     const tratamiento = tratamientos.find(t => t.nombre === tratamientoNombre);
//     if (tratamiento) {
//       setFormData(prev => ({
//         ...prev,
//         concepto: tratamiento.nombre,
//         montoTotal: tratamiento.precio,
//         montoPagado: tratamiento.precio // por defecto pago total
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, concepto: "", montoTotal: "", montoPagado: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/pagos`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         credentials: "include",
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success("¡Pago registrado exitosamente!");
//         setFormData({ paciente: "", concepto: "", montoTotal: "", montoPagado: "", metodoPago: "Efectivo" });
//       } else {
//         toast.error(data.error || "Error al registrar el pago");
//       }
//     } catch (error) {
//       toast.error("Error de conexión con el servidor");
//     }
//   };

//   const saldoPendiente = Number(formData.montoTotal || 0) - Number(formData.montoPagado || 0);

//   return (
//     <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
//       <h3>Registrar Pago / Ingreso</h3>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        
//         {/* Selección de Paciente */}
//         <div>
//           <label>Paciente *</label>
//           <select 
//             required
//             value={formData.paciente} 
//             onChange={e => setFormData({ ...formData, paciente: e.target.value })}
//             style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
//           >
//             <option value="">Seleccione un paciente...</option>
//             {pacientes.map(p => (
//               <option key={p._id} value={p._id}>{p.nombre} {p.apellido} - DNI: {p.dni || "Sin DNI"}</option>
//             ))}
//           </select>
//         </div>

//         {/* Selección desde Lista de Valores */}
//         <div>
//           <label>Seleccionar de Lista de Tratamientos (Opcional)</label>
//           <select onChange={handleSelectTratamiento} style={{ width: "100%", padding: "8px", borderRadius: "4px" }}>
//             <option value="">-- Tratamiento personalizado --</option>
//             {tratamientos.map(t => (
//               <option key={t._id} value={t.nombre}>{t.nombre} ($ {t.precio})</option>
//             ))}
//           </select>
//         </div>

//         {/* Concepto */}
//         <div>
//           <label>Concepto / Tratamiento *</label>
//           <input 
//             type="text" 
//             required
//             value={formData.concepto}
//             onChange={e => setFormData({ ...formData, concepto: e.target.value })}
//             placeholder="Ej: Consulta general, Ecografía..."
//             style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
//           />
//         </div>

//         {/* Montos */}
//         <div style={{ display: "flex", gap: "10px" }}>
//           <div style={{ flex: 1 }}>
//             <label>Monto Total ($) *</label>
//             <input 
//               type="number" 
//               required
//               value={formData.montoTotal}
//               onChange={e => setFormData({ ...formData, montoTotal: e.target.value })}
//               style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
//             />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label>Monto Pagado Hoy ($) *</label>
//             <input 
//               type="number" 
//               required
//               value={formData.montoPagado}
//               onChange={e => setFormData({ ...formData, montoPagado: e.target.value })}
//               style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
//             />
//           </div>
//         </div>

//         {/* Indicador de saldo deudor */}
//         {saldoPendiente > 0 && (
//           <div style={{ padding: "8px", background: "#fff3cd", color: "#856404", borderRadius: "4px", fontSize: "0.9rem" }}>
//             ⚠️ El paciente quedará con un <strong>Saldo Deudor de: $ {saldoPendiente}</strong> (Pago Parcial).
//           </div>
//         )}

//         {/* Método de pago */}
//         <div>
//           <label>Método de Pago *</label>
//           <select 
//             value={formData.metodoPago}
//             onChange={e => setFormData({ ...formData, metodoPago: e.target.value })}
//             style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
//           >
//             <option value="Efectivo">Efectivo</option>
//             <option value="Transferencia">Transferencia</option>
//             <option value="Tarjeta Débito">Tarjeta Débito</option>
//             <option value="Tarjeta Crédito">Tarjeta Crédito</option>
//             <option value="Mercado Pago">Mercado Pago</option>
//             <option value="Otro">Otro</option>
//           </select>
//         </div>

//         <button type="submit" style={{ padding: "10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
//           Registrar Transacción
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegistroPagosManager;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const RegistroPagosManager = () => {
  // Estados de búsqueda de paciente
  const [queryPaciente, setQueryPaciente] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Estados financieros del paciente seleccionado
  const [transaccionesPaciente, setTransaccionesPaciente] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);

  // Formulario de nuevo pago / tratamiento
  const [formData, setFormData] = useState({
    concepto: "",
    montoTotal: "",
    montoPagado: "",
    metodoPago: "Efectivo"
  });

  // Estado para modal o sección de abonar saldo pendiente
  const [pagoParcialModal, setPagoParcialModal] = useState(null); // Transacción a abonar
  const [montoAbonar, setMontoAbonar] = useState("");
  const [metodoAbonar, setMetodoAbonar] = useState("Efectivo");

  // Cargar lista de valores de tratamientos al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/treatments`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setTratamientos(data))
      .catch(() => toast.error("Error al cargar lista de valores"));
  }, []);

  // Buscar pacientes en tiempo real por DNI, nombre o apellido
  useEffect(() => {
    if (queryPaciente.length < 2) {
      setPacientesEncontrados([]);
      return;
    }

    const token = localStorage.getItem("token");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/buscar?query=${queryPaciente}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        });
        const data = await res.json();
        if (res.ok) setPacientesEncontrados(data);
      } catch (error) {
        console.error("Error buscando paciente", error);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [queryPaciente]);

  // Al seleccionar un paciente, cargar sus transacciones/deudas
  const seleccionarPaciente = async (paciente) => {
    setPacienteSeleccionado(paciente);
    setQueryPaciente(`${paciente.nombre} ${paciente.apellido} (DNI: ${paciente.dni || 'S/N'})`);
    setPacientesEncontrados([]);
    await cargarTransaccionesPaciente(paciente._id);
  };

  const cargarTransaccionesPaciente = async (pacienteId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/paciente/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) setTransaccionesPaciente(data);
    } catch (error) {
      toast.error("Error al cargar historial financiero del paciente");
    }
  };

  // Autocompletar precio y concepto desde la lista de valores
  const handleSelectTratamiento = (e) => {
    const tratamientoNombre = e.target.value;
    const tratamiento = tratamientos.find(t => t.nombre === tratamientoNombre);
    if (tratamiento) {
      setFormData(prev => ({
        ...prev,
        concepto: tratamiento.nombre,
        montoTotal: tratamiento.precio,
        montoPagado: tratamiento.precio // por defecto pago total
      }));
    } else {
      setFormData(prev => ({ ...prev, concepto: "", montoTotal: "", montoPagado: "" }));
    }
  };

  // Registrar nuevo cobro o tratamiento
  const handleSubmitNuevoPago = async (e) => {
    e.preventDefault();
    if (!pacienteSeleccionado) {
      toast.error("Debe seleccionar un paciente");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      paciente: pacienteSeleccionado._id,
      ...formData
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("¡Transacción registrada exitosamente!");
        setFormData({ concepto: "", montoTotal: "", montoPagado: "", metodoPago: "Efectivo" });
        await cargarTransaccionesPaciente(pacienteSeleccionado._id);
      } else {
        toast.error(data.error || "Error al registrar el pago");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    }
  };

  // Abonar a un saldo deudor existente (pagos parciales en varias visitas)
  const handleAbonarSaldo = async (e) => {
    e.preventDefault();
    if (!pagoParcialModal) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/pagos/${pagoParcialModal._id}/abonar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({ montoAbonar, metodoPago: metodoAbonar })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("¡Pago parcial registrado con éxito!");
        setPagoParcialModal(null);
        setMontoAbonar("");
        await cargarTransaccionesPaciente(pacienteSeleccionado._id);
      } else {
        toast.error(data.error || "Error al abonar saldo");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  const saldoPendienteNuevo = Number(formData.montoTotal || 0) - Number(formData.montoPagado || 0);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h3>Gestión de Pagos y Saldos de Pacientes</h3>

      {/* 1. BUSCADOR INTELIGENTE POR DNI / NOMBRE */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <label><strong>Buscar Paciente por DNI, Nombre o Apellido:</strong></label>
        <input 
          type="text"
          value={queryPaciente}
          onChange={e => {
            setQueryPaciente(e.target.value);
            if (!e.target.value) setPacienteSeleccionado(null);
          }}
          placeholder="Ingrese DNI o nombre del paciente..."
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "5px" }}
        />

        {pacientesEncontrados.length > 0 && (
          <ul style={{ position: "absolute", width: "100%", background: "#fff", border: "1px solid #ccc", borderRadius: "4px", listStyle: "none", padding: 0, margin: 0, zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
            {pacientesEncontrados.map(p => (
              <li 
                key={p._id}
                onClick={() => seleccionarPaciente(p)}
                style={{ padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer", background: "#fafafa" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e9ecef"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fafafa"}
              >
                <strong>{p.nombre} {p.apellido}</strong> — DNI: {p.dni || "S/D"} | Tel: {p.telefono}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SI HAY UN PACIENTE SELECCIONADO, MOSTRAMOS SU HISTORIAL DE PAGOS Y FORMULARIO */}
      {pacienteSeleccionado && (
        <div>
          <div style={{ background: "#e8f4fd", padding: "12px", borderRadius: "6px", marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 5px 0", color: "#0056b3" }}>Paciente Seleccionado: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</h4>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>DNI: {pacienteSeleccionado.dni || "No registrado"} | Tel: {pacienteSeleccionado.telefono}</p>
          </div>

          {/* HISTORIAL DE TRATAMIENTOS Y SALDOS */}
          <div style={{ marginBottom: "25px" }}>
            <h4>Historial de Tratamientos y Estado de Deudas</h4>
            {transaccionesPaciente.length === 0 ? (
              <p style={{ color: "#666", fontStyle: "italic" }}>Este paciente no registra tratamientos ni transacciones previas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {transaccionesPaciente.map(t => (
                  <div key={t._id} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px", background: t.estado === "Pagado" ? "#f8fff8" : "#fff8f8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{t.concepto}</strong>
                      <span style={{ 
                        padding: "3px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold",
                        background: t.estado === "Pagado" ? "#d4edda" : t.estado === "Parcial" ? "#fff3cd" : "#f8d7da",
                        color: t.estado === "Pagado" ? "#155724" : t.estado === "Parcial" ? "#856404" : "#721c24"
                      }}>
                        {t.estado === "Pagado" ? "✔ Saldado" : t.estado === "Parcial" ? "⚠️ Pago Parcial" : "❌ Pendiente"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "5px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                      <span>Total: <strong>$ {t.montoTotal}</strong></span>
                      <span>Pagado: <strong style={{ color: "green" }}>$ {t.montoPagado}</strong></span>
                      <span>Saldo Deudor: <strong style={{ color: t.saldoDeudor > 0 ? "red" : "green" }}>$ {t.saldoDeudor}</strong></span>
                      <span>Fecha: {new Date(t.fecha).toLocaleDateString("es-AR")}</span>
                    </div>

                    {/* Botón para abonar si quedó saldo pendiente */}
                    {t.saldoDeudor > 0 && (
                      <button 
                        onClick={() => setPagoParcialModal(t)}
                        style={{ marginTop: "8px", padding: "5px 10px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}
                      >
                        💳 Abonar Saldo Pendiente ($ {t.saldoDeudor})
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #ddd", margin: "20px 0" }} />

          {/* FORMULARIO PARA REGISTRAR NUEVO TRATAMIENTO / PAGO */}
          <form onSubmit={handleSubmitNuevoPago} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fdfdfd", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "6px" }}>
            <h4 style={{ margin: 0 }}>Registrar Nuevo Tratamiento / Cobro</h4>

            <div>
              <label>Seleccionar de Lista de Valores (Opcional)</label>
              <select onChange={handleSelectTratamiento} style={{ width: "100%", padding: "8px", borderRadius: "4px" }}>
                <option value="">-- Tratamiento personalizado --</option>
                {tratamientos.map(tr => (
                  <option key={tr._id} value={tr.nombre}>{tr.nombre} ($ {tr.precio})</option>
                ))}
              </select>
            </div>

            <div>
              <label>Concepto / Tratamiento *</label>
              <input 
                type="text" 
                required
                value={formData.concepto}
                onChange={e => setFormData({ ...formData, concepto: e.target.value })}
                placeholder="Ej: Consulta, Práctica médica..."
                style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label>Monto Total ($) *</label>
                <input 
                  type="number" 
                  required
                  value={formData.montoTotal}
                  onChange={e => setFormData({ ...formData, montoTotal: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Monto Pagado Hoy ($) *</label>
                <input 
                  type="number" 
                  required
                  value={formData.montoPagado}
                  onChange={e => setFormData({ ...formData, montoPagado: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              </div>
            </div>

            {saldoPendienteNuevo > 0 && (
              <div style={{ padding: "8px", background: "#fff3cd", color: "#856404", borderRadius: "4px", fontSize: "0.9rem" }}>
                ⚠️ El paciente quedará con un <strong>Saldo Deudor de: $ {saldoPendienteNuevo}</strong> en este tratamiento.
              </div>
            )}

            <div>
              <label>Método de Pago *</label>
              <select 
                value={formData.metodoPago}
                onChange={e => setFormData({ ...formData, metodoPago: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <button type="submit" style={{ padding: "10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
              Registrar Cobro
            </button>
          </form>
        </div>
      )}

      {/* MODAL PARA ABONAR SALDO PENDIENTE EN VISITAS FUTURAS */}
      {pagoParcialModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", width: "90%", maxWidth: "450px" }}>
            <h3 style={{ marginTop: 0 }}>Abonar Saldo Pendiente</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              Tratamiento: <strong>{pagoParcialModal.concepto}</strong><br/>
              Saldo Deudor Actual: <strong style={{ color: "red" }}>$ {pagoParcialModal.saldoDeudor}</strong>
            </p>

            <form onSubmit={handleAbonarSaldo} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label>Monto a Abonar ($) *</label>
                <input 
                  type="number" 
                  max={pagoParcialModal.saldoDeudor}
                  required
                  value={montoAbonar}
                  onChange={e => setMontoAbonar(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label>Método de Pago *</label>
                <select 
                  value={metodoAbonar}
                  onChange={e => setMetodoAbonar(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta Débito">Tarjeta Débito</option>
                  <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setPagoParcialModal(null)} style={{ padding: "8px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ padding: "8px 12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Confirmar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroPagosManager;