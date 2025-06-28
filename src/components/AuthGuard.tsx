
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireSecretary?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  requireSecretary = false,
  redirectTo = '/login'
}: AuthGuardProps) => {
  const { user, member, isLoading, isSecretary } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check if user has a member record and is active
    if (requireAuth && user && (!member || member.status !== 'Active')) {
      if (member?.status === 'Pending') {
        navigate('/pending-approval', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Check secretary role requirement
    if (requireSecretary && !isSecretary) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, member, isLoading, isSecretary, requireAuth, requireSecretary, navigate, location, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show children if all checks pass
  return <>{children}</>;
};

export default AuthGuard;
