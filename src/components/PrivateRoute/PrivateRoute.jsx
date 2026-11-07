import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // guarda de onde a pessoa veio pra voltar pra lá depois do login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}