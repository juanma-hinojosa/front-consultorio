import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/pages/AdminLogin.css"
import loginImg from "/logo.png"

const AdminLoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post('https://consultorio-back-xg97.onrender.com/api/auth/login', {
      // const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier,
        password
      });

      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={loginImg} alt="Logo Administrador" className="login-logo" />
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login Administrador</h2>
          <input
            type="text"
            placeholder="Usuario"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
