import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FichaPaciente from './FichaPaciente';

const ListaPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const token = localStorage.getItem('token');

  const obtenerPacientes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },

      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al obtener Pacientes');

      setPacientes(data);
    } catch (err) {
      toast.error('Error al obtener pacientes');
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);


  const filtrar = (paciente) => {
    const texto = busqueda.toLowerCase();
    return (
      (paciente.numeroPaciente && paciente.numeroPaciente.toString().toLowerCase().includes(texto)) ||
      (paciente.dni && paciente.dni.toString().toLowerCase().includes(texto)) ||
      (paciente.apellido && paciente.apellido.toLowerCase().includes(texto))
    );
  };



  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este paciente?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();
      if (res.ok) {
        toast.success('Paciente eliminado');
        obtenerPacientes();
      } else {
        toast.error(data.message || 'Error al eliminar');
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor');
    }
  };

  const onEditar = (paciente) => {
    setPacienteSeleccionado(paciente);
  };

  const volverListado = () => {
    setPacienteSeleccionado(null);
    obtenerPacientes();
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    if (!fechaISO) return '';
    const [anio, mes, dia] = fechaISO.split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div>
      {pacienteSeleccionado ? (
        <FichaPaciente paciente={pacienteSeleccionado} onBack={volverListado} />
      ) : (
        <>
          <h3 className='poppins-regular' >Lista de Pacientes</h3>
          <input
            placeholder="Buscar por apellido, DNI o número"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <br /><br />
          <ul>
            {pacientes.filter(filtrar).map((p) => (
              <li className='poppins-regular' style={{ borderBottom: "1px solid black", listStyle: "none" }} key={p._id}>
                {p.numeroPaciente} {p.apellido}, {p.nombre} - DNI: {p.dni} <br />
                Observaciones: {p.alergias} <br />
                Telefono: {p.telefono}
                <br />
                Fecha de Nacimiento: {formatearFecha(p.fechaNacimiento)}<br />
                Cobertura: {p.cobertura} <br />
                Numero de afiliado: {p.numeroAfiliado} <br />

                <button style={{ padding: "5px 10px", marginRight: "10px" }} onClick={() => onEditar(p)}>Editar</button>
                <button style={{ padding: "5px 10px", marginRight: "10px" }} onClick={() => handleEliminar(p._id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ListaPacientes;
