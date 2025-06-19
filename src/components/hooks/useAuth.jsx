// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = (requiredRole) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          credentials: 'include' // Importante para enviar cookies
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            user: data.user,
            loading: false
          });

          // Verificar rol si es necesario
          if (requiredRole && data.user.role !== requiredRole) {
            navigate('/unauthorized');
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
        navigate('/login');
      }
    };

    verifyAuth();
  }, [requiredRole, navigate]);

  return authState;
};

export default useAuth;