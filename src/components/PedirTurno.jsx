// PedirTurno.jsx
import React, { useState, useEffect } from 'react';

const PedirTurno = ({ specialtyId }) => {
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (date) {
      fetch(`/api/specialties/${specialtyId}`)
        .then(res => res.json())
        .then(data => {
          const slot = data.specialty.availableSlots.find(s => s.date === date);
          setAvailableTimes(slot ? slot.times : []);
        });
    }
  }, [date, specialtyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, date, time, specialtyId })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Turno reservado con éxito');
      setFullName('');
      setDate('');
      setTime('');
    } else {
      alert(data.message || 'Error al reservar el turno');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="turno-form">
      <h3>Solicitar Turno</h3>
      <input type="text" placeholder="Nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <select value={time} onChange={e => setTime(e.target.value)} required>
        <option value="">Seleccionar horario</option>
        {availableTimes.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
      </select>
      <button type="submit">Reservar turno</button>
    </form>
  );
};

export default PedirTurno;
