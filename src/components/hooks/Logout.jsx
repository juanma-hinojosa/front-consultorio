// components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Sesión cerrada');
        navigate('/login');
      } else {
        throw new Error('Error al cerrar sesión');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <button style={{ border: "none", backgroundColor: "transparent", color: "white", cursor:"pointer" }} onClick={handleLogout} className="logout-button">
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;