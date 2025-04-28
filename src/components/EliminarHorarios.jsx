import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Importa Toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify
import "../css/components/EliminarHorarios.css"
const EliminarHorarios = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(res => setEspecialidades(res.data))
      .catch(err => console.error(err));
  }, []);

  // const handleEliminar = async () => {
  //   try {
  //     await axios.delete(`https://consultorio-back-xg97.onrender.com/api/specialties/delete-slots`, {
  //       data: { specialtyId: especialidadId, date: fecha }
  //     });
  //     alert('Horarios eliminados');
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error al eliminar horarios');
  //   }
  // };

  const handleEliminar = async () => {
    try {
      await axios.delete(`https://consultorio-back-xg97.onrender.com/api/specialties/delete-slots`, {
        data: { specialtyId: especialidadId, date: fecha }
      });
      toast.success('Horarios eliminados con éxito'); // Notificación de éxito
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar horarios'); // Notificación de error
    }
  };

  return (
    // <div>
    //   <h3>Eliminar Horarios por Fecha</h3>
    //   <select onChange={e => setEspecialidadId(e.target.value)}>
    //     <option value="">Selecciona una especialidad</option>
    //     {especialidades.map(e => (
    //       <option key={e._id} value={e._id}>{e.title}</option>
    //     ))}
    //   </select>
    //   <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
    //   <button onClick={handleEliminar}>Eliminar</button>
    //   <ToastContainer />
    // </div>
 
    <div className="eliminar-horarios-container">
    <h3 className="eliminar-horarios-title">Eliminar Horarios por Fecha</h3>
    <div className="eliminar-horarios-form">
      <select 
        className="eliminar-select" 
        onChange={e => setEspecialidadId(e.target.value)}
      >
        <option value="">Selecciona una especialidad</option>
        {especialidades.map(e => (
          <option key={e._id} value={e._id}>{e.title}</option>
        ))}
      </select>
      <input 
        type="date" 
        className="eliminar-input" 
        value={fecha} 
        onChange={e => setFecha(e.target.value)} 
      />
      <button className="eliminar-button" onClick={handleEliminar}>
        Eliminar
      </button>
    </div>
    <ToastContainer /> {/* Aquí se renderizan las notificaciones */}
  </div>
  );
};

export default EliminarHorarios;
