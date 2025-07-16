import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "../../../css/dashboard/EmpleadoManager.css";
import EmpleadoForm from './EmpleadoForm';
import EmpleadoList from './EmpleadoList';

const EmpleadoManager = () => {
  const [empleados, setEmpleados] = useState([]);
  const [vista, setVista] = useState('lista'); // 'lista', 'crear', 'editar'
  const [empleadoActual, setEmpleadoActual] = useState(null);

  const token = localStorage.getItem("token");

  const fetchEmpleados = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/empleados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEmpleados(data);
    } catch (err) {
      toast.error(err.message || 'Error al cargar empleados');
    }
  };

  useEffect(() => {
    if (vista === 'lista') {
      fetchEmpleados();
    }
  }, [vista]);

  const handleEditar = (empleado) => {
    setEmpleadoActual(empleado);
    setVista('editar');
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este empleado?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Empleado eliminado correctamente');
      fetchEmpleados();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar');
    }
  };

  return (
    <div className="empleado-manager-container">
      {/* Menú de navegación */}
      <div className="menu-opciones"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          // padding: "2rem"
        }}
      >
        <button className="btn" onClick={() => { setVista('crear'); setEmpleadoActual(null); }}>
          Crear Empleado
        </button>
        <button className="btn " onClick={() => setVista('lista')}>
          Listar Empleados
        </button>
      </div>

<br />

      {/* Renderizado dinámico según la vista */}
      {vista === 'crear' && (
        <EmpleadoForm
          onSuccess={() => {
            setVista('lista');
            fetchEmpleados();
          }}
        />
      )}

      {vista === 'editar' && empleadoActual && (
        <EmpleadoForm
          initialData={empleadoActual}
          onSuccess={() => {
            setVista('lista');
            fetchEmpleados();
          }}
          onCancel={() => setVista('lista')}
        />
      )}

      {vista === 'lista' && (
        <EmpleadoList
          empleados={empleados}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      )}
    </div>
  );
};

export default EmpleadoManager;
