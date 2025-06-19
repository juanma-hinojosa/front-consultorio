import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "../../../css/dashboard/EmpleadoManager.css"
import { Icon } from '@iconify/react/dist/iconify.js';

const especialidades = [
  'Gastroenterologia Infantil',
  'Medicina Integral',
  'Traumatologia General',
  'Pediatria',
  'Medicina General',
  'Traumatologia Infantil',
  'Cardiologia General',
  'Cardiologia Pediatrica'
];

const EmpleadoManager = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    role: 'doctor',
    especialidad: ''
  });

  const [empleados, setEmpleados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");


  const fetchEmpleados = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/empleados`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al obtener empleados');

      setEmpleados(data);
    } catch (err) {
      toast.error(err.message || 'Error al cargar empleados');
      setEmpleados([]);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingId
        ? `/api/users/${editingId}`
        : form.role === 'doctor'
          ? '/api/users/crear-doctor'
          : '/api/users/crear-recepcionista';

      const method = editingId ? 'PUT' : 'POST';

      const payload = { ...form };
      if (editingId) {
        delete payload.contraseña;
      }

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
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al procesar empleado');
      }

      if (editingId) {
        toast.success('Empleado actualizado correctamente ✅');
      } else {
        toast.success(`${form.role === 'doctor' ? 'Doctor' : 'Recepcionista'} creado correctamente ✅`);
      }

      setForm({
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        role: 'doctor',
        especialidad: ''
      });
      setEditingId(null);
      fetchEmpleados();
    } catch (err) {
      toast.error(err.message || 'Error al guardar empleado');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
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
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');

      toast.success('Empleado eliminado correctamente');
      fetchEmpleados();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar empleado');
    }
  };

  const handleEditar = (emp) => {
    setEditingId(emp._id);
    setForm({
      nombre: emp.nombre,
      apellido: emp.apellido,
      email: emp.email,
      contraseña: '',
      role: emp.role,
      especialidad: emp.especialidad || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="empleado-manager-container">
      <h2>{editingId ? 'Actualizar Empleado' : 'Crear Empleado'}</h2>
      <form onSubmit={handleSubmit} className="empleado-form">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        {!editingId && (
          <input
            type="password"
            name="contraseña"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        )}

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="doctor">Doctor</option>
          <option value="recepcionista">Recepcionista</option>
        </select>

        {form.role === 'doctor' && (
          <select
            name="especialidad"
            value={form.especialidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar especialidad</option>
            {especialidades.map((esp, idx) => (
              <option key={idx} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="btn btn-primary">
          {editingId ? 'Actualizar Empleado' : `Crear ${form.role}`}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingId(null);
              setForm({
                nombre: '',
                apellido: '',
                email: '',
                contraseña: '',
                role: 'doctor',
                especialidad: ''
              });
            }}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Lista de Empleados</h3>
      <div className="table-responsive">
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map(emp => (
              <tr key={emp._id}>
                <td>{emp.nombre}</td>
                <td>{emp.apellido}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={`badge ${emp.role === 'doctor' ? 'badge-doctor' : 'badge-recepcionista'}`}>
                    {emp.role}
                  </span>
                </td>
                <td>{emp.especialidad || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditar(emp)}
                      className="btn btn-edit"
                      title="Editar"
                    >
                      {/* <i className="icon-edit"></i> */}
                      <Icon icon="iconamoon:edit" />
                    </button>
                    <button
                      onClick={() => handleEliminar(emp._id)}
                      className="btn btn-delete"
                      title="Eliminar"
                    >
                      <Icon icon="material-symbols:delete-outline" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpleadoManager;