import React, { useState } from 'react';
import BuscarPacienteInput from './BuscarPaciente';
import { toast } from 'react-toastify';

const CrearHistoriaClinica = () => {
  const [paciente, setPaciente] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!paciente) {
      toast.error('Debe seleccionar un paciente');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('paciente', paciente._id);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    // Agregar cada imagen individualmente
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include', // Para incluir cookies
        body: formData, // NO establecer Content-Type manualmente, el navegador lo hará con el boundary correcto
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al crear historia clínica');
      }

      toast.success('Entrada creada en historia clínica');
      // Resetear el formulario
      setTitulo('');
      setDescripcion('');
      setImagenes([]);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al crear historia clínica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className='poppins-regular'>Crear nueva entrada</h3>
      <BuscarPacienteInput onSelect={setPaciente} />
      {paciente && (
        <section className='ui-form-container'>
          <form className='ui-form' onSubmit={handleSubmit}>
            <p className='poppins-light'>Paciente: {paciente.nombre} {paciente.apellido}</p>
            <input
              className='ui-input'
              type="text"
              placeholder="Título del tratamiento"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
            <textarea
              className='ui-textarea'
              placeholder="Descripción del tratamiento"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={20}
              required
            />
            <input
              className='ui-input'
              type="file"
              multiple
              onChange={e => setImagenes([...e.target.files])}
              accept="image/*,application/pdf"
            />
            <button type="submit" style={{padding: "10px"}} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar entrada'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default CrearHistoriaClinica;