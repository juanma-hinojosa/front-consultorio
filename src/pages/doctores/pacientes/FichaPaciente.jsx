import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const FichaPaciente = ({ paciente, onBack }) => {
  const [form, setForm] = useState(paciente || {});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (paciente) {
      setForm(paciente);
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${form._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();
      if (res.ok) {
        toast.success('Ficha actualizada');
        onBack(); // Vuelve al listado u origen
      } else {
        toast.error(data.message || 'Error al actualizar');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div className='poppins-regular'>
      <h3>Ficha de Paciente</h3>
      <section className="ui-form-container">
        <form className='ui-form' onSubmit={handleSubmit}>
          <input
            className='ui-input'
            name="nombre"
            value={form.nombre || ''}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            className='ui-input'
            name="apellido"
            value={form.apellido || ''}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
          <input
            className='ui-input'
            name="dni"
            value={form.dni || ''}
            onChange={handleChange}
            placeholder="DNI"
            required
          />

          <label className='ui-label'>Obra Social</label>
          <select
            className="ui-input"
            name="cobertura"
            value={form.cobertura || 'Ninguna'}
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

          {form.cobertura && form.cobertura !== 'Ninguna' && (
            <>
              <label className='ui-label'>Número de Afiliado</label>
              <input
                className="ui-input"
                name="numeroAfiliado"
                value={form.numeroAfiliado || ''}
                onChange={handleChange}
                placeholder="Número de afiliado"
                required
              />
            </>
          )}

          <input
            className='ui-input'
            name="fechaNacimiento"
            type="date"
            value={form.fechaNacimiento?.slice(0, 10) || ''}
            onChange={handleChange}
            required
          />
          <input
            className='ui-input'
            name="direccion"
            value={form.direccion || ''}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
          <input
            className='ui-input'
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className='ui-input'
            name="telefono"
            value={form.telefono || ''}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
          <input
            className='ui-input'
            name="alergias"
            value={form.alergias || ''}
            onChange={handleChange}
            placeholder="Alergias (opcional)"
          />
          <button style={{ padding: "10px" }} type="submit">Actualizar Ficha</button>
          <button style={{ padding: "10px" }} type="button" onClick={onBack}>Volver</button>
        </form>
      </section>

    </div>
  );
};

export default FichaPaciente;
