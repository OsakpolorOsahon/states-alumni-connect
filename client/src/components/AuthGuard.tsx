
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSecretary?: boolean;
  requireActive?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, 
  requireSecretary = false,
  requireActive = false 
}) => {
  const { user, member, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    console.log('AuthGuard check:', { user: !!user, member: member?.role, requireAuth, requireSecretary, requireActive });

    if (requireAuth && !user) {
      console.log('No user, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    if (requireSecretary && (!member || member.role !== 'secretary')) {
      console.log('Not secretary, redirecting home');
      navigate('/dashboard', { replace: true });
      return;
    }

    if (requireActive && (!member || member.status !== 'active')) {
      console.log('Not active member, checking status');
      if (member?.status === 'pending') {
        navigate('/pending-approval', { replace: true });
      } else if (user && !member) {
        // User exists but no member record - redirect to upload documents
        navigate('/upload-documents', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
  }, [user, member, loading, requireAuth, requireSecretary, requireActive, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600]"></div>
      </div>
    );
  }

  if (requireAuth && !user) return null;
  if (requireSecretary && (!member || member.role !== 'secretary')) return null;
  if (requireActive && (!member || member.status !== 'active')) return null;

  return <>{children}</>;
};

export default AuthGuard;
