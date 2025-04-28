import React, { useState } from 'react';
import axios from 'axios';  // Si necesitas enviar la consulta a un backend
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify
import '../css/components/ConsultaForm.css';

const ConsultaForm = () => {
  // Estado para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [consulta, setConsulta] = useState('');

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevenir el comportamiento por defecto de recargar la página

    // Validación simple
    if (!nombre || !apellido || !email || !consulta) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    // Creando el objeto para enviar la consulta
    const formData = {
      nombre,
      apellido,
      email,
      consulta
    };

    try {
      // Si estás enviando la consulta a un backend
      await axios.post('https://tu-backend.com/api/consulta', formData);
      toast.success('¡Consulta enviada con éxito!');  // Notificación de éxito

      // Limpiar los campos del formulario después del envío
      setNombre('');
      setApellido('');
      setEmail('');
      setConsulta('');
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al enviar tu consulta. Intenta de nuevo más tarde.');
    }
  };

  return (
    <section className="consulta-section">
      <div className="consulta-overlay">
        <div className="consulta-content">
          <form className="consulta-form" onSubmit={handleSubmit}>
            <h2>Dejanos tu consulta</h2>
            <input 
              type="text" 
              placeholder="Nombre" 
              name="nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Apellido" 
              name="apellido" 
              value={apellido} 
              onChange={(e) => setApellido(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Consulta" 
              name="consulta" 
              value={consulta} 
              onChange={(e) => setConsulta(e.target.value)} 
              required 
            />
            <button type="submit">Enviar Consulta</button>
          </form>
        </div>
      </div>
      <ToastContainer /> {/* Aquí se renderizan las notificaciones */}
    </section>
  );
};

export default ConsultaForm;
