import { Icon } from '@iconify/react';

const EmpleadoList = ({ empleados, onEditar, onToggleEstado }) => (
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
            <th>Estado</th>
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
                <span className={`badge 
  ${emp.role === 'doctor' ? 'badge-doctor' :
                    emp.role === 'marketing' ? 'badge-marketing' :
                      'badge-recepcionista'}`}
                >

                  {emp.role}
                </span>
              </td>
              <td>{Array.isArray(emp.especialidad) ? emp.especialidad.join(', ') : '-'} </td>
            
            {/* 👇 Columna de Estado */}
              <td>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                  fontWeight: 'bold',
                  backgroundColor: emp.activo === false ? '#ffebee' : '#e8f5e9',
                  color: emp.activo === false ? '#c62828' : '#2e7d32'
                }}>
                  {emp.activo === false ? 'Inactivo' : 'Activo'}
                </span>
              </td>
            
            
              {/* <td>
                <button className="btn btn-edit" onClick={() => onEditar(emp)}>
                  <Icon icon="iconamoon:edit" />
                </button>
                <button className="btn btn-delete" onClick={() => onEliminar(emp._id)}>
                  <Icon icon="material-symbols:delete-outline" />
                </button>
              </td> */}

              <td>
                <button className="btn btn-edit" onClick={() => onEditar(emp)}>
                  <Icon icon="iconamoon:edit" />
                </button>
                
                {/* 👇 Botón para activar/desactivar en lugar de eliminar */}
                <button 
                  className="btn" 
                  style={{ backgroundColor: emp.activo === false ? '#4caf50' : '#f44336', color: 'white' }}
                  onClick={() => onToggleEstado(emp)}
                  title={emp.activo === false ? 'Activar Perfil' : 'Desactivar Perfil'}
                >
                  <Icon icon={emp.activo === false ? "material-symbols:check-circle-outline" : "material-symbols:cancel-outline"} />
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
