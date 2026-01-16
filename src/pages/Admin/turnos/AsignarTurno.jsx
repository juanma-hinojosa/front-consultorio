import React, { useState, useEffect } from "react";
import BuscarPacienteInput from "../fichaClinica/BuscarPaciente";
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

const AsignarTurno = () => {
  const [pacienteId, setPacienteId] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [turnoId, setTurnoId] = useState("");
  const [odontologos, setOdontologos] = useState([]);
  const [odontologoId, setOdontologoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [motivoDeConsulta, setMotivoDeConsulta] = useState("")

  const [nombreNuevo, setNombreNuevo] = useState("");
  const [apellidoNuevo, setApellidoNuevo] = useState("");
  const [telefonoNuevo, setTelefonoNuevo] = useState("");

  const [modoNuevoPaciente, setModoNuevoPaciente] = useState(null); // null, "nuevo", "existente"

  // Obtener odontólogos
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/users/empleados`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },

    })
      .then(res => res.json())
      .then(data => {
        const soloOdontologos = data.filter(user => user.role === "doctor")
        setOdontologos(soloOdontologos)
      })
      .catch(err => toast.error("Error cargando lista de doctores:", err));
  }, []);

  // Buscar turnos desde una fecha
  const buscarTurnos = async () => {
    if (!fecha) return toast.error("Seleccione una fecha primero");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles?dia=${fecha}`, {
        // const res = await fetch(`http://localhost:5000/api/turnos-disponibles?dia=${fecha}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',

      });
      const data = await res.json();
      setTurnos(data);
    } catch (err) {
      console.error("Error buscando turnos:", err);
      toast.error("Error al buscar turnos");
    }
  };

  const crearPacienteRapido = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/registro-rapido`, {
        // const res = await fetch("http://localhost:5000/api/patients/registro-rapido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: nombreNuevo,
          apellido: apellidoNuevo,
          telefono: telefonoNuevo
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Paciente creado");
        setPacienteId(data._id);
        setPacienteSeleccionado(data);
        setNombreNuevo(""); setApellidoNuevo(""); setTelefonoNuevo("");
      } else {
        toast.error("Error: " + (data.mensaje || "No se pudo crear paciente"));
      }
    } catch (err) {
      console.error("Error al crear paciente rápido", err);
      toast.error("Error al crear paciente");
    }
  }

  // Asignar turno
  const asignar = async () => {
    const token = localStorage.getItem("token");
    const turnoSeleccionado = JSON.parse(turnoId);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/asignar`, {
      // const res = await fetch("http://localhost:5000/api/turnos/asignar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        paciente: pacienteId,
        doctor: odontologoId,
        consultorio: turnoSeleccionado.consultorio,
        dia: turnoSeleccionado.dia,
        horario: turnoSeleccionado.horario,
        categoria, // ✅ Enviar categoría
        
        // Nuevo campo "Motivo de Consulta"
        motivoDeConsulta
      }),
    });

    if (res.ok) {
      toast.success("Turno asignado exitosamente.");
      setPacienteSeleccionado(null);
      setPacienteId("");
      setTurnoId("");
      setOdontologoId("");
      setFecha("");
      setTurnos([]);
    } else {
      const error = await res.json();
      toast.error("Error al asignar turno: " + (error.message || "Intente nuevamente."));
    }
  };




  return (

    <div>
      <h3 className="poppins-regular">Asignar Turno</h3>

      {/* Botones para elegir modo */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={{ padding: "5px 10px" }} onClick={() => setModoNuevoPaciente("nuevo")}>Paciente Nuevo</button>
        <button style={{ padding: "5px 10px" }} onClick={() => setModoNuevoPaciente("existente")}>Paciente Existente</button>
      </div>

      {/* Si aún no eligió una opción */}
      {modoNuevoPaciente === null && (
        <p className="poppins-regular">Seleccione una opción para continuar</p>
      )}


      {/* Paciente nuevo */}
      {modoNuevoPaciente === "nuevo" && (
        <>
          <h4 className="poppins-regular">Formulario de nuevo paciente</h4>
          <div className="ui-form-container" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <input
              className="ui-input"
              placeholder="Nombre"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
            />
            <input
              className="ui-input"
              placeholder="Apellido"
              value={apellidoNuevo}
              onChange={(e) => setApellidoNuevo(e.target.value)}
            />
            <input
              className="ui-input"
              placeholder="Teléfono"
              type="number"
              value={telefonoNuevo}
              onChange={(e) => setTelefonoNuevo(e.target.value)}
            />
            <button
              // className="ui-button"
              style={{ padding: "10px" }}
              onClick={crearPacienteRapido}
              disabled={!nombreNuevo || !apellidoNuevo || !telefonoNuevo}
            >
              Crear paciente rápido
            </button>
          </div>
        </>
      )}

      {/* Paciente existente */}
      {modoNuevoPaciente === "existente" && (
        <>
          <h4 className="poppins-regular">Buscar Paciente</h4>
          <BuscarPacienteInput
            onSelect={(p) => {
              setPacienteId(p._id);
              setPacienteSeleccionado(p);
            }}
          />
          <br />
        </>
      )}

      {/* Mostrar datos del paciente seleccionado */}
      {pacienteSeleccionado && (
        <div className="poppins-regular" style={{ margin: "10px 0", fontWeight: "bold", cursor: "pointer" }}>
          Paciente seleccionado: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
        </div>
      )}

      {/* Formulario de turno */}
      {(modoNuevoPaciente && pacienteId) && (
        <section className='ui-form-container'>
          <div className="ui-form">
            <h4 className="poppins-regular">Seleccione un doctor</h4>
            <select className="ui-select" value={odontologoId} onChange={(e) => setOdontologoId(e.target.value)}>
              <option className="ui-option" value="">Seleccione un doctor</option>
              {odontologos.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.nombre} {o.apellido} - {Array.isArray(o.especialidad) ? o.especialidad.join(', ') : '-'}
                  {/* role del perfil */}
                  {/* ({o.role}) */}
                </option>
              ))}
            </select>

            <h4 className="poppins-regular">Categoría del turno</h4>
            <select className="ui-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option className="ui-option" value="">Seleccione una categoría</option>
              <option className="ui-option" value="Particular">Particular</option>
              <option className="ui-option" value="Obra Social">Obra Social</option>
              <option className="ui-option" value="Convenio">Convenio</option>
            </select>

            {/* motivo de la consulta  */}
            <h4 className="poppins-regular">Motivo de la consulta</h4>
            <input type="text" className="ui-input" placeholder="Ej: Control niños" value={motivoDeConsulta} onChange={((e) => setMotivoDeConsulta(e.target.value))}/>

            <h4 className="poppins-regular">Seleccione una fecha</h4>
            <input
              className="ui-input"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <button style={{ padding: "10px" }} onClick={buscarTurnos}>Buscar turnos desde esta fecha</button>

            <h4 className="poppins-regular">Seleccione un turno disponible</h4>
            <select className="ui-select" onChange={(e) => setTurnoId(e.target.value)} value={turnoId}>
              <option className="ui-option" value="">Seleccione un turno</option>
              {turnos.map((t) =>
                t.horarios.map((horario) => (
                  <option key={`${t._id}-${horario}`} value={JSON.stringify({ ...t, horario })}>
                    {t.dia} - {horario} - Consultorio: {t.consultorio}
                  </option>
                ))
              )}
            </select>

            <br />
            <button
              onClick={asignar}
              disabled={!pacienteId || !turnoId || !odontologoId || !categoria || !motivoDeConsulta}
              style={{ marginTop: "10px", padding: "5px 10px" }}
            >
              Asignar Turno
            </button>
          </div>
        </section>
      )}
    </div>

  );
};

export default AsignarTurno;
