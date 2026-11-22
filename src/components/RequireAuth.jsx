import { Navigate, useLocation } from 'react-router-dom';
import { selectUser, useAuthStore } from '../store/authStore';

export default function RequireAuth({ children }) {
  const user = useAuthStore(selectUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
}
