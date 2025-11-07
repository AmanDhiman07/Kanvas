import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../../features/dashboard/ui/Dashboard.page';
import LoginPage from '../../features/auth/ui/Login.page';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

