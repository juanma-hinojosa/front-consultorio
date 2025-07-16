import { Icon } from '@iconify/react';

const EmpleadoList = ({ empleados, onEditar, onEliminar }) => (
  <div>
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
              <td>{Array.isArray(emp.especialidad) ? emp.especialidad.join(', ') : '-'} </td>
              <td>
                <button className="btn btn-edit" onClick={() => onEditar(emp)}>
                  <Icon icon="iconamoon:edit" />
                </button>
                <button className="btn btn-delete" onClick={() => onEliminar(emp._id)}>
                  <Icon icon="material-symbols:delete-outline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmpleadoList;
