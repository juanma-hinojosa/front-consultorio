// src/components/Loader.jsx
import React from 'react';
import '../css/components/Loader.css';
import logo from '/logo.png'; // Asegurate de que esté bien la ruta

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={logo} alt="Logo del consultorio" className="loader-logo" />
      <div className="spinner"></div>
      <p>Cargando contenido...</p>
    </div>
  );
};

export default Loader;
