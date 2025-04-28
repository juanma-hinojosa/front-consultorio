// GestionarTurnos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/components/GestionarTurnos.css"

import { toast, ToastContainer } from 'react-toastify';


const GestionarTurnos = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Obtener las especialidades del backend
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(response => setEspecialidades(response.data))
      .catch(error => console.error('Error al obtener especialidades:', error));
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const horariosArray = horarios.split(',').map(h => h.trim());
  //     const response = await axios.post('https://consultorio-back-xg97.onrender.com/api/specialties/add-available-slots', {
  //       specialtyId: especialidadId,
  //       date: fecha,
  //       times: horariosArray,
  //     });
  //     setMessage('Turnos agregados con éxito');
  //   } catch (error) {
  //     setMessage('Error al agregar los turnos');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const horariosArray = horarios.split(',').map(h => h.trim());
      await axios.post('https://consultorio-back-xg97.onrender.com/api/specialties/add-available-slots', {
        specialtyId: especialidadId,
        date: fecha,
        times: horariosArray,
      });
      toast.success('Turnos agregados con éxito');
      setEspecialidadId('');
      setFecha('');
      setHorarios('');
    } catch (error) {
      toast.error('Error al agregar los turnos');
    }
  };

  return (
    <div className="turnos-container">
      <h3 className="turnos-title">Gestionar Turnos</h3>
      <form onSubmit={handleSubmit} className="turnos-form">
        <div className="form-group">
          <label className="form-label">Especialidad:</label>
          <select
            className="form-select"
            value={especialidadId}
            onChange={(e) => setEspecialidadId(e.target.value)}
          >
            <option value="">Selecciona una especialidad</option>
            {especialidades.map((especialidad) => (
              <option key={especialidad._id} value={especialidad._id}>
                {especialidad.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha:</label>
          <input
            type="date"
            className="form-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Horarios (separados por coma):</label>
          <input
            type="text"
            className="form-input"
            value={horarios}
            placeholder="ej: 09:30, 10:00"
            onChange={(e) => setHorarios(e.target.value)}
          />
        </div>

        <button type="submit" className="form-button">Agregar Turnos</button>
      </form>

      {/* {message && <p className="message">{message}</p>} */}
      <ToastContainer />
    </div>

  );
};

export default GestionarTurnos;
