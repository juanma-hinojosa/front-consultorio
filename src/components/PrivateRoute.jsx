import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({children}) => {
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute;
