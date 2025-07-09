import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'member' | 'secretary';
  status: 'pending' | 'active' | 'inactive';
}

interface Member {
  id: string;
  userId: string | null;
  fullName: string;
  nickname?: string;
  stateshipYear: string;
  lastMowcubPosition: string;
  currentCouncilOffice?: string;
  photoUrl?: string;
  duesProofUrl?: string;
  latitude?: number;
  longitude?: number;
  paidThrough?: string;
  role: 'member' | 'secretary';
  status: 'pending' | 'active' | 'inactive';
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  signUp: (email: string, password: string, memberData?: any) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<{ error: any }>;
  isSecretary: boolean;
  isPending: boolean;
  isActive: boolean;
  isVerified: boolean;
  createMember: (data: any) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn('useAuth must be used within AuthProvider');
    // Return a default context value to prevent crashes
    return {
      user: null,
      member: null,
      loading: true,
      signUp: async () => ({ data: null, error: 'Not available' }),
      signIn: async () => ({ data: null, error: 'Not available' }),
      signOut: async () => ({ error: 'Not available' }),
      isSecretary: false,
      isPending: false,
      isActive: false,
      isVerified: false,
      createMember: async () => ({ data: null, error: 'Not available' }),
    };
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    authService.checkAuth();
    
    const unsubscribe = authService.subscribe((state) => {
      setUser(state.user);
      setLoading(state.loading);
      
      // Fetch member data when user is authenticated
      if (state.user && !state.loading) {
        fetchMemberData(state.user.id);
      } else if (!state.user) {
        setMember(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchMemberData = async (userId: string) => {
    try {
      // For now, create a mock member since we don't have the full auth system
      const mockMember: Member = {
        id: '1',
        userId: userId,
        fullName: 'John Doe',
        stateshipYear: '2020',
        lastMowcubPosition: 'Captain',
        role: 'member',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMember(mockMember);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const signUp = async (email: string, password: string, memberData?: any) => {
    try {
      const result = await authService.signUp(email, password, memberData);
      return { data: result.success ? { user: authService.getState().user } : null, error: result.error };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      return { data: result.success ? { user: authService.getState().user } : null, error: result.error };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  };

  const createMember = async (data: any) => {
    try {
      const result = await api.createMember(data);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create member' };
    }
  };

  const isSecretary = member?.role === 'secretary';
  const isPending = member?.status === 'pending';
  const isActive = member?.status === 'active';
  const isVerified = user !== null && !loading;

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        loading,
        signUp,
        signIn,
        signOut,
        isSecretary,
        isPending,
        isActive,
        isVerified,
        createMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};