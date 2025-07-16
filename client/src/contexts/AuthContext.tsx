import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
}

interface Member {
  id: string;
  userId: string;
  full_name: string;
  nickname?: string;
  role: 'member' | 'secretary';
  status: 'pending' | 'active' | 'inactive';
  stateship_year?: string;
  last_mowcub_position?: string;
  current_council_office?: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  dues_proof_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  signUp: (email: string, password: string, memberData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isSecretary: boolean;
  isActiveMember: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await apiRequest('/api/auth/me');
      setUser(response.user);
      setMember(response.member);
    } catch (error) {
      // Silently handle unauthenticated users - this is normal
      setUser(null);
      setMember(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const signUp = async (email: string, password: string, memberData: any) => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, ...memberData }),
      });
      
      setUser(response.user);
      setMember(response.member);
      return { data: response, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { data: null, error: error.message || 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      setUser(response.user);
      setMember(response.member);
      return { data: response, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      setMember(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isSecretary = member?.role === 'secretary';
  const isActiveMember = member?.status === 'active';

  return (
    <AuthContext.Provider value={{
      user,
      member,
      loading,
      signUp,
      signIn,
      signOut,
      isSecretary,
      isActiveMember,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};