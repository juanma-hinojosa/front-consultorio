import React, { useState, useEffect } from 'react';

const BuscarPacienteInput = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/`, {
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }
        const data = await res.json();
        setPacientes(data);
      } catch (error) {
        console.error('Error al obtener pacientes', error);
      }
    };
    fetchPacientes();
  }, []);

  useEffect(() => {
    if (query.length < 2) return setResultados([]);
    
    const filtro = pacientes.filter(p => {
      // Verifica y normaliza cada campo antes de usarlo
      const nombre = p.nombre ? p.nombre.toLowerCase() : '';
      const apellido = p.apellido ? p.apellido.toLowerCase() : '';
      const dni = p.dni ? p.dni.toString() : '';
      const numeroPaciente = p.numeroPaciente ? p.numeroPaciente.toLowerCase() : '';
      
      const queryLower = query.toLowerCase();
      
      return (
        nombre.includes(queryLower) ||
        apellido.includes(queryLower) ||
        dni.includes(query) || // No convertimos a lowercase para mantener formato DNI
        numeroPaciente.includes(queryLower)
      );
    });
    
    setResultados(filtro);
  }, [query, pacientes]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, apellido, DNI o número"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      {resultados.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {resultados.map(p => (
            <li 
              style={{
                cursor: "pointer",
                padding: "8px",
                borderBottom: "1px solid #eee",
                transition: "background-color 0.2s ease-in-out"
              }} 
              className='poppins-regular' 
              key={p._id} 
              onClick={() => onSelect(p)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {p.numeroPaciente || 'Sin número'} - {p.nombre || ''} {p.apellido || ''} {p.dni ? `(${p.dni})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscarPacienteInput;