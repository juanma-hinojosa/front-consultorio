import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/components/CrearTurno.css"
import ListarTurnosReservados from './ListarTurnosReservados';

const CrearTurno = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [turnoReservado, setTurnoReservado] = useState(false);

  // useEffect(() => {
  //   axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
  //     .then(res => setEspecialidades(res.data));
  // }, []);

  useEffect(() => {
    axios.get('https://consultorio-back-xg97.onrender.com/api/specialties')
      .then(res => setEspecialidades(res.data))
      .catch(err => {
        toast.error('Error al cargar especialidades');
      });
  }, []);

  useEffect(() => {
    if (especialidadId && fecha) {
      const esp = especialidades.find(e => e._id === especialidadId);
      const dia = esp?.availableSlots.find(d => d.date === fecha);
      setHorarios(dia ? dia.times : []);
    }
  }, [fecha, especialidadId, especialidades]);

  // const reservarTurno = async () => {
  //   try {
  //     await axios.post('https://consultorio-back-xg97.onrender.com/api/appointments', {
  //       fullName: nombre,
  //       telefono: telefono,
  //       date: fecha,
  //       time: horarioSeleccionado,
  //       specialtyId: especialidadId
  //     });
  //     alert('Turno reservado con éxito');
  //     setNombre('');
  //     setTelefono('');
  //     setFecha('');
  //     setHorarioSeleccionado('');
  //   } catch (err) {
  //     alert(err.response?.data?.message || 'Error al reservar turno');
  //   }
  // };

  const reservarTurno = async () => {
    if (!nombre || !telefono || !especialidadId || !fecha || !horarioSeleccionado) {
      toast.warning('Por favor completa todos los campos');
      return;
    }

    try {
      await axios.post('https://consultorio-back-xg97.onrender.com/api/appointments', {
        fullName: nombre,
        telefono: telefono,
        date: fecha,
        time: horarioSeleccionado,
        specialtyId: especialidadId
      });
      toast.success('Turno reservado con éxito');
      setNombre('');
      setTelefono('');
      setFecha('');
      setHorarioSeleccionado('');
      setEspecialidadId('');
      setTurnoReservado(true); // Después de reservar, cambia a listar turnos
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al reservar turno');
    }
  };
  if (turnoReservado) {
    return <ListarTurnosReservados />;
  }
  return (
    <div className="crear-turno-container">
      <h3 className="crear-turno-titulo">Reservar Turno</h3>

      <input
        type="text"
        placeholder="Nombre del paciente"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        className="crear-turno-input"
      />

      <input
        type="text"
        placeholder="Teléfono del paciente"
        value={telefono}
        onChange={e => setTelefono(e.target.value)}
        className="crear-turno-input"
      />

      <select
        value={especialidadId}
        onChange={e => setEspecialidadId(e.target.value)}
        className="crear-turno-select"
      >
        <option value="">Seleccionar especialidad</option>
        {especialidades.map(e => (
          <option key={e._id} value={e._id}>{e.title}</option>
        ))}
      </select>

      <input
        type="date"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
        className="crear-turno-input"
      />

      <select
        value={horarioSeleccionado}
        onChange={e => setHorarioSeleccionado(e.target.value)}
        className="crear-turno-select"
      >
        <option value="">Seleccionar horario</option>
        {horarios.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      <button onClick={reservarTurno} className="crear-turno-boton">
        Reservar
      </button>

      <ToastContainer />
    </div>

  );
};

export default CrearTurno;
