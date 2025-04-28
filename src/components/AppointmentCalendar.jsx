
import React, { useState } from 'react';
import { toast } from 'react-toastify'; // 👈 importamos toast
import 'react-toastify/dist/ReactToastify.css'; // 👈 importamos los estilos
import '../css/components/AppointmentCalendar.css';

const AppointmentCalendar = ({ specialty }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [telefono, setTelefono] = useState('');
  // const [message, setMessage] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
    // setMessage('');
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://consultorio-back-xg97.onrender.com/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          telefono,
          date: selectedDate,
          time: selectedTime,
          specialtyId: specialty._id
        })
      });

      const data = await res.json();
      if (res.ok) {
        // setMessage('✅ Turno reservado con éxito');
        toast.success('Turno reservado con éxito'); // 🎯
        setFormVisible(false);
        setFullName('');
        setTelefono('');
      } else {
        toast.warning(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al reservar turno.');
    }
  };

  // Filtrar fechas para que solo se muestren las de mañana en adelante
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Dejamos en 00:00:00
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const filteredSlots = specialty?.availableSlots?.filter(slot => {
    const [year, month, day] = slot.date.split('-');
    const slotDate = new Date(year, month - 1, day); // Correcto para LOCAL
    return slotDate >= tomorrow;
  }) || [];


  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const horariosDisponibles = specialty?.availableSlots?.find(
    slot => slot.date === selectedDate
  )?.times || [];

  return (

    <div className="appointment-calendar">
      <h3 className="calendar-title">Reservar turno para: {specialty.name}</h3>

      <div className="calendar-section">
        <label className="calendar-label">Seleccioná una fecha:</label>
        <select
          className="calendar-select"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="">-- Elegí una fecha --</option>
          {filteredSlots.map(slot => (
            <option key={slot.date} value={slot.date}>
              {formatDate(slot.date)}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && horariosDisponibles.length > 0 && (
        <div className="horarios">
          <p className="horarios-title">Horarios disponibles:</p>
          <div className="horarios-grid">
            {horariosDisponibles.map((time, idx) => (
              <button
                key={idx}
                className="horario-btn"
                onClick={() => handleSelectTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && horariosDisponibles.length === 0 && (
        <p className="no-horarios">No hay horarios disponibles para este día.</p>
      )}

      {formVisible && (
        <form className="turno-form" onSubmit={handleSubmit}>
          <h4 className="form-title">
            Confirmar Turno para {formatDate(selectedDate)} a las {selectedTime}
          </h4>
          <input
            className="form-input"
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="number"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
          <div className="form-buttons">
            <button type="submit" className="form-btn confirmar">
              Confirmar Turno
            </button>
            <button
              type="button"
              className="form-btn cancelar"
              onClick={() => setFormVisible(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* {message && <p className="mensaje-turno">{message}</p>} */}
    </div>
  );
};

export default AppointmentCalendar;
