
import AuthGuard from './AuthGuard';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSecretary?: boolean;
}

const ProtectedRoute = ({ children, requireSecretary = false }: ProtectedRouteProps) => {
  return (
    <AuthGuard requireAuth={true} requireActive={true} requireSecretary={requireSecretary}>
      {children}
    </AuthGuard>
  );
};

export default ProtectedRoute;
