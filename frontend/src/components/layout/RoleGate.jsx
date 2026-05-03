import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleGate({ roles }) {
  const { hasRole } = useAuth();
  return roles.some((r) => hasRole(r)) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
