
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

    if (requireAuth && !user) {
      navigate('/login');
      return;
    }

    if (requireSecretary && (!member || member.role !== 'secretary')) {
      navigate('/');
      return;
    }

    if (requireActive && (!member || member.status !== 'Active')) {
      if (member?.status === 'Pending') {
        navigate('/pending-approval');
      } else if (user && !member) {
        // User exists but no member record - redirect to upload documents
        navigate('/upload-documents');
      } else {
        navigate('/');
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
  if (requireActive && (!member || member.status !== 'Active')) return null;

  return <>{children}</>;
};

export default AuthGuard;
