import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import "../css/components/ListarTurnosReservados.css"

const ListarTurnosReservados = () => {
  const [turnos, setTurnos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ fullName: '', telefono: '', date: '', time: '', status: '' });

  const formatearFecha = (fechaString) => {
    const [year, month, day] = fechaString.split('-');
    const fecha = new Date(year, month - 1, day); // ¡Mes empieza en 0!
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  const fetchTurnos = async () => {
    try {
      const res = await axios.get('https://consultorio-back-xg97.onrender.com/api/appointments');
      setTurnos(res.data);
    } catch (error) {
      toast.error('Error al cargar los turnos.');
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const handleEditar = (turno) => {
    setEditandoId(turno._id);
    setForm({
      fullName: turno.fullName,
      telefono: turno.telefono,
      date: turno.date,
      time: turno.time,
      status: turno.status
    });
  };

  const handleGuardar = async () => {
    try {
      await axios.put(`https://consultorio-back-xg97.onrender.com/api/appointments/${editandoId}`, form);
      toast.success('Turno actualizado correctamente.');
      setEditandoId(null);
      fetchTurnos();
    } catch (error) {
      toast.error('Error al actualizar el turno.');
    }
  };


  const handleCancelar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este turno?')) {
      try {
        await axios.delete(`https://consultorio-back-xg97.onrender.com/api/appointments/${id}`);
        toast.success('Turno cancelado exitosamente.');
        fetchTurnos();
      } catch (error) {
        toast.error('Error al cancelar el turno.');
      }
    }
  };

  return (
    <div className="turnos-container">

      <ToastContainer />

      <h2 className="turnos-titulo">Gestion de turnos para pacientes
        <br />
        <span style={{ fontSize: '20px' }}>
          Turnos Reservados Pacientes
        </span>
      </h2>


      <div className="turnos-columns">
        <h4>Confirmados</h4>
        <div className="turnos-column confirmados">
          {turnos.filter(turno => turno.status === 'confirmado').map(turno => (
            <div key={turno._id} className="turno-card">
              {editandoId === turno._id ? (
                <div className="turno-form">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button onClick={handleGuardar}>Guardar</button>
                </div>
              ) : (
                <>
                  <strong>{turno.fullName}, teléfono: {turno.telefono} </strong> - {formatearFecha(turno.date)} a las {turno.time} ({turno.specialty.title})
                  <button onClick={() => handleEditar(turno)}>Editar</button>
                  <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
                </>
              )}
            </div>
          ))}
        </div>


        <h4>Pendientes</h4>

        <div className="turnos-column pendientes">
          {turnos.filter(turno => turno.status === 'pendiente').map(turno => (
            <div key={turno._id} className="turno-card">
              {editandoId === turno._id ? (
                <div className="turno-form">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button onClick={handleGuardar}>Guardar</button>
                </div>
              ) : (
                <>
                  <strong>{turno.fullName}, teléfono: {turno.telefono}</strong> - {formatearFecha(turno.date)} a las {turno.time} ({turno.specialty.title})
                  <button onClick={() => handleEditar(turno)}>Editar</button>
                  <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
                </>
              )}
            </div>
          ))}
        </div>

        <h4>Cancelados</h4>

        <div className="turnos-column cancelados">
          {turnos.filter(turno => turno.status === 'cancelado').map(turno => (
            <div key={turno._id} className="turno-card">
              {editandoId === turno._id ? (
                <div className="turno-form">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button onClick={handleGuardar}>Guardar</button>
                </div>
              ) : (
                <>
                  <strong>{turno.fullName}, teléfono: {turno.telefono}</strong> - {formatearFecha(turno.date)} a las {turno.time} ({turno.specialty.title})
                  <button onClick={() => handleEditar(turno)}>Editar</button>
                  <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>



  );
};

export default ListarTurnosReservados;
