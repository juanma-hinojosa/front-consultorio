import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CrearPaciente = ({ onVolver }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    direccion: '',
    email: '',
    telefono: '',
    alergias: '',
    cobertura: 'Ninguna',
    numeroAfiliado: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`

        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();
      if (res.ok) {
        toast.success('Paciente creado con éxito');
        setForm({
          nombre: '', apellido: '', dni: '', fechaNacimiento: '',
          direccion: '', email: '', telefono: '', alergias: ''
        });
      } else {
        toast.error(data.message || 'Error al crear paciente');
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
    }
  };

  return (
    <div className="crear-paciente">
      <h3 className='poppins-regular'>Crear Paciente</h3>
      <section className='ui-form-container'>
        <form className="ui-form poppins-light" onSubmit={handleSubmit}>
          <label htmlFor="" className='ui-label'>Nombre Completo</label>
          <input className="ui-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
          <label htmlFor="" className='ui-label'>Apellido</label>
          <input className="ui-input" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
          <label htmlFor="" className='ui-label'>Numero de Documento</label>
          <input className="ui-input" name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" required />

          <label className='ui-label'>Obra Social</label>
          <select
            className="ui-input"
            name="cobertura"
            value={form.cobertura}
            onChange={handleChange}
          >
            <option value="Ninguna">Ninguna</option>
            <option value="OSECAC">OSECAC</option>
            <option value="OSDE">OSDE</option>
            <option value="Swiss Medical">Swiss Medical</option>
            <option value="Medicus">Medicus</option>
            <option value="Sancor Salud">Sancor Salud</option>
            <option value="PAMI">PAMI</option>
            <option value="IOMA">IOMA</option>
            <option value="OSPE">OSPE</option>
            <option value="OSPRERA">OSPRERA</option>
            <option value="OSUTHGRA">OSUTHGRA</option>
            <option value="Galeno">Galeno</option>
            <option value="Accord Salud">Accord Salud</option>
            <option value="Omint">Omint</option>
            <option value="Medifé">Medifé</option>
            <option value="Otra">Otra</option>
          </select>

          {form.cobertura !== 'Ninguna' && (
            <>
              <label className='ui-label'>Número de Afiliado</label>
              <input
                className="ui-input"
                name="numeroAfiliado"
                value={form.numeroAfiliado}
                onChange={handleChange}
                placeholder="Número de afiliado"
                required
              />
            </>
          )}

          <label htmlFor="" className='ui-label'>Fecha de nacimiento</label>
          <input className="ui-input" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required />
          <label htmlFor="" className='ui-label'>Domicilio</label>
          <input className="ui-input" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
          <label htmlFor="" className='ui-label'>Email de contacto</label>
          <input className="ui-input" name="email" value={form.email} onChange={handleChange} placeholder="Email opcional" />
          <label htmlFor="" className='ui-label'>Celular de contacto</label>
          <input className="ui-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required />
          <label htmlFor="" className='ui-label'>Observaciones</label>
          <textarea rows={20} className="ui-textarea" name="alergias" value={form.alergias} onChange={handleChange} placeholder="Alergias (si hay)" />
          <button style={{ padding: "10px" }} type="submit">Guardar</button>
          <button style={{ padding: "10px" }} type="button" onClick={onVolver}>Volver</button>
        </form>
      </section>

    </div>
  );
};

export default CrearPaciente;
