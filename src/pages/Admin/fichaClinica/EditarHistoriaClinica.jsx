
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BuscarPacienteInput from './BuscarPaciente';

const EditarHistoriaClinica = () => {
  const [paciente, setPaciente] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarRegistros = async id => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/paciente/${id}`, {
        headers: { Authorization: `Bearer ${token}` },

        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al cargar los registros.');
      const data = await res.json();
      setRegistros(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar los registros.");
    }
  };

  // const handleUpdate = async e => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('titulo', titulo);
  //   formData.append('descripcion', descripcion);
  //   imagenes.forEach(img => formData.append('imagenes', img));

  //   // const token = localStorage.getItem('token');
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/${seleccionado._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       credentials: 'include',
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error('Error al actualizar la entrada.');

  //     toast.success('Entrada actualizada correctamente!');
  //     setSeleccionado(null);
  //     cargarRegistros(paciente._id);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error al actualizar la entrada.");
  //   }
  // };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!seleccionado) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    const token = localStorage.getItem('token');

    // Agregar cada imagen individualmente
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records/${seleccionado._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: formData, // NO establecer Content-Type manualmente
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al actualizar la entrada');
      }

      toast.success('Entrada actualizada correctamente!');
      setSeleccionado(null);
      setImagenes([]);
      cargarRegistros(paciente._id);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "Error al actualizar la entrada");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='poppins-regular'>
      <h3 >Editar entrada</h3>
      <BuscarPacienteInput
        onSelect={p => {
          setPaciente(p);
          cargarRegistros(p._id);
        }}
      />
      <div className="ui-form-container">
        {seleccionado && (
          <form className='ui-form' onSubmit={handleUpdate}>
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título"
              className='ui-input'
            />
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className='ui-input'
            />
            <input
              type="file"
              multiple
              onChange={e => setImagenes([...e.target.files])}
              className='ui-input'
            />
            <button style={{ padding: "10px" }} type="submit">Guardar cambios</button>
          </form>
        )}
      </div>


      <br />

      {registros.map(r => (
        <div key={r._id} style={{ border: '1px solid gray', margin: '5px' }}>
          <h4>{r.titulo}</h4>
          <p><strong>Especialidad:</strong> {r.doctor?.especialidad} - {r.doctor?.role}</p>
          <p><strong>Descripcion:</strong> {r.descripcion}</p>
          <button
            onClick={() => {
              setSeleccionado(r);
              setTitulo(r.titulo);
              setDescripcion(r.descripcion);
            }}
          >
            Editar
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditarHistoriaClinica;
