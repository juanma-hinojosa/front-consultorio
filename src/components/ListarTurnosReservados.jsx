import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/components/ListarTurnosReservados.css"

const ListarTurnosReservados = () => {
  const [turnos, setTurnos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ fullName: '', telefono: '', date: '', time: '', status: '' });

  const fetchTurnos = async () => {
    const res = await axios.get('https://consultorio-back-xg97.onrender.com/api/appointments');
    setTurnos(res.data);
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
    await axios.put(`https://consultorio-back-xg97.onrender.com/api/appointments/${editandoId}`, form);
    setEditandoId(null);
    fetchTurnos();
  };

  const handleCancelar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este turno?')) {
      await axios.delete(`https://consultorio-back-xg97.onrender.com/api/appointments/${id}`);
      fetchTurnos();
    }
  };

  return (
    // <div>
    //   <h3>Turnos Reservados</h3>
    //   <ul>
    //     {turnos.map(turno => (
    //       <li key={turno._id}>
    //         {editandoId === turno._id ? (
    //           <div>
    //             <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
    //             <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
    //             {/* <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /> */}
    //             <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
    //               <option value="pendiente">Pendiente</option>
    //               <option value="confirmado">Confirmado</option>
    //               <option value="cancelado">Cancelado</option>
    //             </select>
    //             <button onClick={handleGuardar}>Guardar</button>
    //           </div>
    //         ) : (
    //           <>
    //             <strong>{turno.fullName}, telefono :{turno.telefono}</strong> - {turno.date} a las {turno.time} ({turno.specialty.title}) [{turno.status}]
    //             <button onClick={() => handleEditar(turno)}>Editar</button>
    //             <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
    //           </>
    //         )}
    //       </li>
    //     ))}
    //   </ul>
    // </div>

    <div className="turnos-container">
    <h3 className="turnos-titulo">Turnos Reservados</h3>
  
    <div className="turnos-columns">
      <div className="turnos-column confirmados">
        <h4>Confirmados</h4>
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
                <strong>{turno.fullName}, teléfono: {turno.telefono}</strong> - {turno.date} a las {turno.time} ({turno.specialty.title})
                <button onClick={() => handleEditar(turno)}>Editar</button>
                <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
              </>
            )}
          </div>
        ))}
      </div>
  
      <div className="turnos-column pendientes">
        <h4>Pendientes</h4>
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
                <strong>{turno.fullName}, teléfono: {turno.telefono}</strong> - {turno.date} a las {turno.time} ({turno.specialty.title})
                <button onClick={() => handleEditar(turno)}>Editar</button>
                <button onClick={() => handleCancelar(turno._id)}>Cancelar</button>
              </>
            )}
          </div>
        ))}
      </div>
  
      <div className="turnos-column cancelados">
        <h4>Cancelados</h4>
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
                <strong>{turno.fullName}, teléfono: {turno.telefono}</strong> - {turno.date} a las {turno.time} ({turno.specialty.title})
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
