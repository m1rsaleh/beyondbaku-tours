// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // Token yoksa login sayfasına yönlendir
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
