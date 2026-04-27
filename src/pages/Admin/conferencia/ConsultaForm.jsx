// ConsultaForm.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import PacienteSearchSelect from "./PacienteSearchSelect";
import DoctorSelect from "./DoctorSelect";
import { Icon } from '@iconify/react/dist/iconify.js';


export default function ConsultaForm({ onSubmit }) {
  const [form, setForm] = useState({
    pacienteId: "",
    doctorId: "",
    fecha: "",
    motivoConsulta: "",
    hora: "",
    telefono: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit(form); // tu POST

      toast.success("Consulta agendada correctamente ");

      // opcional: limpiar form
      setForm({
        pacienteId: "",
        doctorId: "",
        fecha: "",
        motivoConsulta: "",
        hora: "",
        telefono: ""
      });

    } catch (error) {
      toast.error("Error al agendar la consulta ");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="bg-gray-900 p-4 rounded-xl mb-6">
  //     <h2 className="mb-3 text-lg">Nueva Consulta</h2>

  //     <PacienteSearchSelect
  //       onSelect={(p) =>
  //         setForm({
  //           ...form,
  //           pacienteId: p._id,
  //           telefono: p.telefono
  //         })
  //       }
  //     />

  //     <DoctorSelect
  //       onSelect={(d) => setForm({ ...form, doctorId: d._id })}
  //     />

  //     <div className="grid grid-cols-2 gap-2 mt-2">
  //       <input
  //         type="date"
  //         onChange={(e) => setForm({ ...form, fecha: e.target.value })}
  //       />
  //       <input
  //         placeholder="14:00"
  //         onChange={(e) => setForm({ ...form, hora: e.target.value })}
  //       />
  //     </div>

  //     <button
  //       onClick={() => onSubmit(form)}
  //       className="bg-[#765584] text-white px-4 py-2 mt-3 rounded-xl"
  //     >
  //       <Icon icon="uim:schedule"  />
  //       Agendar
  //     </button>
  //   </div>
  // );

  return (
    <div
      style={{
        // backgroundColor: "#111827",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "24px"
      }}
    >
      <h2 style={{ marginBottom: "12px", fontSize: "18px" }}>
        Nueva Consulta
      </h2>

      <PacienteSearchSelect
        onSelect={(p) =>
          setForm({
            ...form,
            pacienteId: p._id,
            telefono: p.telefono
          })
        }
      />

      <DoctorSelect
        onSelect={(d) => setForm({ ...form, doctorId: d._id })}
      />

      <input
        style={{
          width:'100%',
          borderRadius:'4px',
          padding:'8px',
          marginTop:'8px'
        }}
        placeholder="Motivo de la consulta"
        onChange={(e) => setForm({ ...form, motivoConsulta: e.target.value })}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginTop: "8px"
        }}
      >
        <input
          type="date"
          // onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          onChange={(e) => {
            const fecha = e.target.value; // "2026-04-20"

            setForm({
              ...form,
              fecha: fecha // 🔥 guardar string directa
            });
          }}
        />
        <input
          placeholder="14:00"
          onChange={(e) => setForm({ ...form, hora: e.target.value })}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : "#258d50",
          color: "#fff",
          padding: "10px 16px",
          marginTop: "12px",
          borderRadius: "12px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <Icon icon="uim:schedule" />
        {loading ? "Agendando..." : "Agendar"}
      </button>
    </div>
  );

}