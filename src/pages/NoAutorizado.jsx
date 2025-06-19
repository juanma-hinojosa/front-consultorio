// pages/UnauthorizedPage.jsx
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1>403 - Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/login" className="btn-primary">
        Volver al inicio de sesión
      </Link>
      <Link to="/" className="btn-secondary">
        Ir a la página principal
      </Link>
    </div>
  );
};

export default UnauthorizedPage;