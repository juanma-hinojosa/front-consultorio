// PacienteSearchSelect.jsx
import { useState, useRef } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/patients/buscar`;

export default function PacienteSearchSelect({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const buscar = (value) => {
    setQuery(value);

    // limpiar si borra texto
    if (value.length < 2) {
      setResults([]);
      return;
    }

    // debounce (espera 300ms)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}?query=${value}`, {
          method: "GET",
          credentials: "include",
          headers: getHeaders(),
        });

        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error buscando pacientes:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // return (
  //   <div className="relative">
  //     <input
  //       placeholder="Buscar paciente..."
  //       value={query}
  //       onChange={(e) => buscar(e.target.value)}
  //       className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
  //     />

  //     {loading && (
  //       <p className="text-sm text-gray-400">Buscando...</p>
  //     )}

  //     {results.length > 0 && (
  //       <div className="absolute z-10 w-full bg-gray-800 rounded max-h-40 overflow-y-auto shadow-lg">
  //         {results.map((p) => (
  //           <div
  //             key={p._id}
  //             onClick={() => {
  //               onSelect(p);
  //               setQuery(`${p.nombre} ${p.apellido}`);
  //               setResults([]);
  //             }}
  //             className="p-2 hover:bg-gray-700 cursor-pointer"
  //           >
  //             {p.nombre} {p.apellido} - {p.telefono}
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder="Buscar paciente por DNI..."
        value={query}
        onChange={(e) => buscar(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "8px",
          padding: "8px",
          borderRadius: "6px",
          color: "#1F2937",
          backgroundColor: "#fff",
          border: "1px solid #374151",
          outline: "none"
        }}
      />

      {loading && (
        <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
          Buscando...
        </p>
      )}

      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "6px",
            maxHeight: "160px",
            overflowY: "auto",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
          }}
        >
          {results.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                onSelect(p);
                setQuery(`${p.nombre} ${p.apellido}`);
                setResults([]);
              }}
              style={{
                padding: "8px",
                cursor: "pointer"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4aa741")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {p.nombre} {p.apellido} - {p.telefono} - DNI: {p.dni}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}