import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const especialidades = [
  'Gastroenterologia Infantil',
  "Gastroenterologia General",
  'Clinica Medica',
  'Traumatologia General',
  'Traumatologia Infantil',
  'Pediatria',
  'Medicina General',
  'Cardiologia General',
  'Cardiologia Pediatrica',
  "kinesiologia",
  "Gerontologia",
  "Endoscopia",
  "Oftamologia Infantil",
  "Oftamologia General",
  "Nutricionista"
];

const EmpleadoForm = ({ initialData, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    role: 'doctor',
    especialidad: []
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre,
        apellido: initialData.apellido,
        email: initialData.email,
        contraseña: '',
        role: initialData.role,
        especialidad: Array.isArray(initialData.especialidad)
          ? initialData.especialidad
          : [initialData.especialidad || '']
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && name === 'especialidad') {
      setForm(prev => ({
        ...prev,
        especialidad: prev.especialidad.includes(value)
          ? prev.especialidad.filter(esp => esp !== value)
          : [...prev.especialidad, value]
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const editing = Boolean(initialData);
      const endpoint = editing
        ? `/api/users/${initialData._id}`
        : form.role === 'doctor'
          ? '/api/users/crear-doctor'
          : '/api/users/crear-recepcionista';

      const method = editing ? 'PUT' : 'POST';

      const payload = { ...form };
      if (editing) delete payload.contraseña;

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al procesar empleado');

      toast.success(editing ? 'Empleado actualizado correctamente ✅' : 'Empleado creado ✅');
      setForm({
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        role: 'doctor',
        especialidad: []
      });
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Error al guardar empleado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="empleado-form">
      <h2>{initialData ? 'Actualizar Empleado' : 'Crear Empleado'}</h2>
      <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      {!initialData && (
        <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" required />
      )}
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="doctor">Doctor</option>
        <option value="recepcionista">Recepcionista</option>
      </select>

      {form.role === 'doctor' && (
        <div className="checkbox-group">
          {especialidades.map((esp, idx) => (
            <label key={idx} className="checkbox-label">
              <input
                type="checkbox"
                name="especialidad"
                value={esp}
                checked={form.especialidad.includes(esp)}
                onChange={handleChange}
              />
              {esp}
            </label>
          ))}
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        {initialData ? 'Actualizar Empleado' : `Crear ${form.role}`}
      </button>
      {initialData && (
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar edición
        </button>
      )}
    </form>
  );
};

export default EmpleadoForm;
