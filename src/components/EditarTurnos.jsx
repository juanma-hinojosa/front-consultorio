import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/components/EditarTurno.css"
const EditarTurnos = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [fecha, setFecha] = useState('');
  const [nuevosHorarios, setNuevosHorarios] = useState('');

  useEffect(() => {
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(res => setEspecialidades(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleActualizar = async () => {
    try {
      const response = await axios.put('https://consultorio-back-xg97.onrender.com/api/specialties/update-slots', {
        specialtyId: especialidadId,
        date: fecha,
        times: nuevosHorarios.split(',').map(h => h.trim())
      });
      alert('Horarios actualizados con éxito');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar horarios');
    }
  };

  return (
    // <div>
    //   <h3>Editar Horarios por Fecha</h3>
    //   <select onChange={e => setEspecialidadId(e.target.value)}>
    //     <option value="">Selecciona una especialidad</option>
    //     {especialidades.map(e => (
    //       <option key={e._id} value={e._id}>{e.title}</option>
    //     ))}
    //   </select>
    //   <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
    //   <input
    //     type="text"
    //     placeholder="Nuevos horarios (ej: 10:00, 11:30)"
    //     value={nuevosHorarios}
    //     onChange={e => setNuevosHorarios(e.target.value)}
    //   />
    //   <button onClick={handleActualizar}>Actualizar</button>
    // </div>

    <div className="editar-horarios-container">
      <h3 className="editar-horarios-title">Editar Horarios por Fecha</h3>

      <div className="editar-horarios-form">
        <select
          className="editar-select"
          onChange={e => setEspecialidadId(e.target.value)}
        >
          <option value="">Selecciona una especialidad</option>
          {especialidades.map(e => (
            <option key={e._id} value={e._id}>{e.title}</option>
          ))}
        </select>

        <input
          type="date"
          className="editar-input"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />

        <input
          type="text"
          className="editar-input"
          placeholder="Nuevos horarios (ej: 10:00, 11:30)"
          value={nuevosHorarios}
          onChange={e => setNuevosHorarios(e.target.value)}
        />

        <button className="editar-button" onClick={handleActualizar}>
          Actualizar
        </button>
      </div>
    </div>

  );
};

export default EditarTurnos;
