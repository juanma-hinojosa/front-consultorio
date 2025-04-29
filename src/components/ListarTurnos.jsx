// ListarTurnos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/components/ListarTurnos.css'
const ListarTurnos = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    // Obtener las especialidades del backend
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(response => setEspecialidades(response.data))
      .catch(error => console.error('Error al obtener especialidades:', error));
  }, []);

  const handleSelectEspecialidad = async (e) => {
    const selectedId = e.target.value;
    setEspecialidadId(selectedId);

    if (selectedId) {
      try {
        const response = await axios.get(`https://consultorio-back-xg97.onrender.com/api/specialties/${selectedId}`);
        const today = new Date().toISOString().split('T')[0];
        const filteredSlots = response.data.availableSlots.filter(slot => slot.date >= today);

        setTurnos(filteredSlots);
      } catch (error) {
        console.error('Error al obtener turnos:', error);
      }
    }
  };

  return (
    <div className="listar-turnos-container">
      <h3 className="titulo-turnos">Listar Turnos Disponibles</h3>

      <div className="select-container">
        <label className="label-especialidad">Especialidad:</label>
        <select
          className="select-especialidad"
          value={especialidadId}
          onChange={handleSelectEspecialidad}
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map((especialidad) => (
            <option key={especialidad._id} value={especialidad._id}>
              {especialidad.title}
            </option>
          ))}
        </select>
      </div>

      <div className="turnos-container">
        <h4 className="subtitulo-turnos">Turnos disponibles:</h4>
        {[...turnos]
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // orden ascendente por fecha
          .map((turno, index) => {
            const [year, month, day] = turno.date.split('-');
            const dateObj = new Date(year, month - 1, day);

            const options = { weekday: 'long' };
            const dayOfWeek = new Intl.DateTimeFormat('es-ES', options).format(dateObj);
            const formattedDay = day.padStart(2, '0');
            const formattedMonth = month.padStart(2, '0');
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

            return (
              <li key={index} className="turno-item">
                {`${capitalize(dayOfWeek)} ${formattedDay} - ${formattedMonth}`}: {turno.times.join(', ')}
              </li>
            );
          })}
      </div>
    </div>
  );
};

export default ListarTurnos;
