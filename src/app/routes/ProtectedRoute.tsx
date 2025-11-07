import { Outlet, Navigate } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}