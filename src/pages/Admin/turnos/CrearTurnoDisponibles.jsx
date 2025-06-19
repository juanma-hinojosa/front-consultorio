
import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
// import es from "react-multi-date-picker/locales/es";
// import { spanish } from "react-multi-date-picker/locales";

import { toast } from "react-toastify";
// import moment from 'moment-timezone';


const CrearTurnosDisponibles = () => {
  const [dias, setDias] = useState([]); // array de fechas seleccionadas
  const [consultorio, setConsultorio] = useState("1");
  const [horarios, setHorarios] = useState("");


  const handleCrear = async () => {
    const token = localStorage.getItem('token');
    const horariosArray = horarios.split(",").map(h => h.trim());

    try {
      for (const fecha of dias) {
        const diaISO = fecha.toDate().toISOString().split("T")[0]; // Convierte la fecha a formato ISO

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ dia: diaISO, consultorio, horarios: horariosArray })
        });

        const data = await res.json();
        // console.log(data);

        if (!res.ok) throw new Error(data.message || "Error al crear el turno");
      }

      // Mostrar mensaje de éxito si todos los turnos fueron creados correctamente
      toast.success("Turnos creados para los días seleccionados.");
    } catch (error) {
      console.error(error);
      // Mostrar mensaje de error si algo falla
      toast.error("Hubo un error al crear los turnos.");
    }
  };


  // const handleCrear = async () => {
  //   const token = localStorage.getItem('token');
  //   const horariosArray = horarios.split(",").map(h => h.trim());

  //   try {
  //     for (const fecha of dias) {
  //       // Convertir a hora de Buenos Aires
  //       const diaISO = moment(fecha.toDate())
  //         .tz('America/Argentina/Buenos_Aires')
  //         .format('DD-MM-YYYY');

  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos-disponibles`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: 'include',
  //         body: JSON.stringify({
  //           dia: diaISO,
  //           consultorio,
  //           horarios: horariosArray
  //         })
  //       });

  //       if (!res.ok) throw new Error("Error al crear el turno");
  //     }

  //     toast.success("Turnos creados correctamente (hora Buenos Aires)");
  //   } catch (error) {
  //     toast.error("Error: " + error.message);
  //   }
  // };

  return (
    <div className="poppins-regular" >
      <h3>Crear Turnos Disponibles</h3>
      <section className='ui-form-container'>
        <div className="ui-form">
          <label>Seleccionar días:</label>
          <DatePicker
            className="ui-input"
            multiple
            value={dias}
            onChange={setDias}
            format="YYYY-MM-DD"
            // format="DD-MM-YYYY"
            // locale={es}
            //  locale={spanish}
            // Usa el locale importado
          />

          <label className="ui-label">Consultorio:</label>
          <select className="ui-select" value={consultorio} onChange={e => setConsultorio(e.target.value)}>
            <option className="ui-option" value="1">Consultorio 1</option>
            <option className="ui-option" value="2">Consultorio 2</option>
            <option className="ui-option" value="3">Consultorio 3</option>
          </select>

          <label className="ui-label">Horarios (ej: 09:00, 10:00, 11:00):</label>
          <input
            className="ui-input"
            type="text"
            placeholder="Ej: 09:30, 10:00, 10:30"
            value={horarios}
            onChange={e => setHorarios(e.target.value)}
          />

          <button style={{ padding: "5px 20px" }} onClick={handleCrear}>Crear</button>
        </div>
      </section>

    </div>
  );
};

export default CrearTurnosDisponibles;
