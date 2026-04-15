// DoctorSelect.jsx
import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/users/listar/doctor`;

export default function DoctorSelect({ onSelect }) {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        setLoading(true);

        const res = await fetch(API, {
          method: "GET",
          credentials: "include",
          headers: getHeaders(),
        });

        const data = await res.json();
        setDoctores(data);
      } catch (error) {
        console.error("Error cargando doctores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctores();
  }, []);

  const handleChange = (e) => {
    const id = e.target.value;
    setSelected(id);

    const doctor = doctores.find((d) => d._id === id);
    if (doctor) onSelect(doctor);
  };

    return (
    <div style={{ marginTop: "8px" }}>
      <select
        value={selected}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          backgroundColor: "#fff",
          color: "#1F2937",
          border: "1px solid #374151"
        }}
      >
        <option value="">Seleccionar doctor</option>

        {doctores.map((d) => (
          <option key={d._id} value={d._id}>
            {d.nombre} {d.apellido}
          </option>
        ))}
      </select>

      {loading && (
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
          Cargando doctores...
        </p>
      )}
    </div>
  );
}