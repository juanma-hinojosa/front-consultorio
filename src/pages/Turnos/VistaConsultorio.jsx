import { useState } from "react"
import GestionarTurnos from "../../components/GestionarTurnos"
import ListarTurnos from "../../components/ListarTurnos"
import EditarTurnos from "../../components/EditarTurnos"
import EliminarHorarios from "../../components/EliminarHorarios"
import '../../css/components/VistaConsultorio.css'

function VistaConsultorio() {
  const [consultorio, setConsultorio] = useState('listar')
  return (
    <div className="vista-consultorio-container">
      <h1>Gestion Turnos Consultorio</h1>

      <ul>
        <button onClick={() => setConsultorio('gestionar')}>Gestionar Turnos</button>
        <button onClick={() => setConsultorio('listar')}>Listar Turnos Disponibles</button>
        <button onClick={() => setConsultorio('editar')}>Editar Horarios</button>
        <button onClick={() => setConsultorio('eliminar')}>Eliminar Horarios</button>
      </ul>

      {consultorio === 'gestionar' && <GestionarTurnos />}
      {consultorio === 'listar' && <ListarTurnos />}
      {consultorio === 'editar' && <EditarTurnos />}
      {consultorio === 'eliminar' && <EliminarHorarios />}
    </div>
  )
}

export default VistaConsultorio;