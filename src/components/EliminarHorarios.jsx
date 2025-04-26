import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EliminarHorarios = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(res => setEspecialidades(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEliminar = async () => {
    try {
      await axios.delete(`https://consultorio-back-xg97.onrender.com/api/specialties/delete-slots`, {
        data: { specialtyId: especialidadId, date: fecha }
      });
      alert('Horarios eliminados');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar horarios');
    }
  };

  return (
    <div>
      <h3>Eliminar Horarios por Fecha</h3>
      <select onChange={e => setEspecialidadId(e.target.value)}>
        <option value="">Selecciona una especialidad</option>
        {especialidades.map(e => (
          <option key={e._id} value={e._id}>{e.title}</option>
        ))}
      </select>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      <button onClick={handleEliminar}>Eliminar</button>
    </div>
  );
};

export default EliminarHorarios;
