import React, { useState } from 'react';
import BuscarPacienteInput from './BuscarPaciente';
import { toast } from 'react-toastify';

const EliminarHistoriaClinica = () => {
  const [paciente, setPaciente] = useState(null);
  const [registros, setRegistros] = useState([]);

 
  const cargarRegistros = async (id) => {
    // const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/paciente/${id}`, {
         credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text(); // importante para depurar
        throw new Error(`Error al obtener registros: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setRegistros(data);
    } catch (err) {
      console.error(err.message);
      alert("Error al cargar registros. Ver consola.");
    }
  };

  const eliminar = async id => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta entrada?");
    if (!confirmar) return;

    // const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success('Entrada eliminada');
      cargarRegistros(paciente._id);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un problema al eliminar la entrada.");
    }
  };

  return (
    <div>
      <h3 className='poppins-regular'>Eliminar entrada</h3>
      <BuscarPacienteInput onSelect={p => {
        setPaciente(p);
        cargarRegistros(p._id);
      }} />
      {registros.map(r => (
        <div key={r._id}>
          <h4>- {r.titulo}</h4>
          <p><strong>Doctor:</strong> {r.doctor?.nombre} {r.doctor?.apellido} </p>
          <p><strong>Especialidad:</strong> {r.doctor?.especialidad} - {r.doctor?.role}</p>
          <p><strong>Descripcion:</strong> {r.descripcion}</p>
          <button onClick={() => eliminar(r._id)}>Eliminar</button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EliminarHistoriaClinica;
