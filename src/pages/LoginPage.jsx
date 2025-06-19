// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../css/pages/AdminLogin.css"

import logo from "/img/logo.png"
import leftImg from "/img/background-login.avif";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

// viejo login 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Error al iniciar sesión');
        return; // Salir temprano si hay error
      }

      // Guardar token y datos de usuario solo si la respuesta es exitosa
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      toast.success('Login exitoso');

      // Esperar un momento antes de redirigir para que se vea el toast
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirigir según el rol
      switch (data.user?.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'recepcionista':
          navigate('/recepcion/dashboard');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      // Mostrar error solo si no es un error de redirección
      if (!error.message.includes('redirect')) {
        toast.error(error.message || 'Error del servidor');
        setError("Error del servidor");
      }
    }
  };


  return (
    <div className="admin-login-wrapper_765584">
      {/* Columna izquierda */}
      <div className="admin-login-image_765584">
        <img src={leftImg} alt="Consultorio dental" />
      </div>

      {/* Columna derecha */}
      <div className="admin-login-container_765584">
        <img src={logo} alt="Logo" className="admin-login-logo_765584" />
        <div>
          <h2 className="admin-login-title_765584">Iniciar Sesión</h2>

          <p className="admin-login-subtext_765584">
            Bienvenido al panel de administración del consultorio.<br />
            Por favor inicia sesión
          </p>
        </div>


        <form onSubmit={handleLogin} className="admin-login-form_765584">
          <label htmlFor="email">Ingresa tu email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-login-input_765584"
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            placeholder="*******"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="admin-login-input_765584"
            required
          />
          <button type="submit" className="admin-login-button_765584">
            Iniciar Sesión
          </button>
          {error && <p className="admin-login-error_765584">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
