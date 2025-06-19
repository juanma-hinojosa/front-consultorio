import React, { useState } from 'react';

const EditarTurnoDisponible = () => {
  const [id, setId] = useState('');
  const [nuevosHorarios, setNuevosHorarios] = useState('');

  const handleEditar = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:5000/api/turnos-disponibles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ horarios: nuevosHorarios.split(',').map(h => h.trim()) })
    });

    const data = await res.json();
    alert(data.message || 'Turno actualizado');
  };

  return (
    <div>
      <h3>Editar Turno Disponible</h3>
      <input type="text" placeholder="ID del turno" value={id} onChange={e => setId(e.target.value)} />
      <input type="text" placeholder="Ej: 09:00,09:30,10:00" value={nuevosHorarios} onChange={e => setNuevosHorarios(e.target.value)} />
      <button onClick={handleEditar}>Actualizar</button>
    </div>
  );
};

export default EditarTurnoDisponible;
