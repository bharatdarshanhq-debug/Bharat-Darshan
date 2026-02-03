import { Navigate, Outlet } from 'react-router-dom';
import adminAuthService from '../services/adminAuthService';

const ProtectedAdminRoute = () => {
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
