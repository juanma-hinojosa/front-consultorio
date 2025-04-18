import React from 'react';
import { Link } from 'react-router-dom';
import '../css/pages/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <Link to="/" className="notfound-button">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
