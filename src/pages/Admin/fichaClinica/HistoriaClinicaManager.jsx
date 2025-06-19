import React, { useState } from 'react';
import CrearHistoriaClinica from './CrearHistoriaClinica';
import ListaHistoriaClinica from './ListaHistoriaClinica';
import EditarHistoriaClinica from './EditarHistoriaClinica';
import EliminarHistoriaClinica from './EliminarHistoriaClinica';
// import CrearHistoriaClinica from './CrearHistoriaClinica';
// import ListaHistoriaClinica from './ListaHistoriaClinica';
// import BuscarPaciente from './BuscarPaciente';
// import EditarHistoriaClinica from './EditarHistoriaClinica';

const HistoriaClinicaManager = () => {
  const [vista, setVista] = useState("listar");

  const handleVista = (componente) => {
    setVista(componente);
  };

  return (
    <div>
      <h2 className='poppins-semibold'>Historia Clínica</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        // padding: "2rem"
      }}>
        <button style={{ padding: "5px 10px" }} className='poppins-light' onClick={() => handleVista('crear')}>Crear nueva entrada</button>
        <button style={{ padding: "5px 10px" }} className='poppins-light' onClick={() => handleVista('listar')}>Ver historial</button>
        <button style={{ padding: "5px 10px" }} className='poppins-light' onClick={() => handleVista('editar')}>Editar entrada</button>
        <button style={{ padding: "5px 10px" }} className='poppins-light' onClick={() => handleVista('eliminar')}>Eliminar</button>
      </div>

      <br />
      <hr />

      <div style={{ marginTop: '1rem' }}>
        {vista === 'crear' && <CrearHistoriaClinica />}
        {vista === 'listar' && <ListaHistoriaClinica />}
        {vista === 'editar' && <EditarHistoriaClinica />}
        {vista === 'eliminar' && <EliminarHistoriaClinica />}
      </div>
    </div>
  );
};

export default HistoriaClinicaManager;
