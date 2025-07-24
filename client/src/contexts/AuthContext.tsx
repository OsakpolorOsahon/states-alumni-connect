import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  email: string;
}

interface Member {
  id: string;
  userId: string;
  fullName: string;
  nickname?: string;
  role: 'member' | 'secretary';
  status: 'pending' | 'active' | 'inactive';
  stateshipYear?: string;
  lastMowcubPosition?: string;
  currentCouncilOffice?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  duesProofUrl?: string;
  createdAt: string;
  updatedAt: string;
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
      console.log('Refreshing session...');
      const response = await authAPI.getMe();
      
      console.log('Session found, setting user...');
      setUser(response.user);
      setMember(response.member);
    } catch (error) {
      console.log('No active session');
      setUser(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signUp = async (email: string, password: string, memberData: any) => {
    try {
      const response = await authAPI.register(email, password, memberData);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      const response = await authAPI.login(email, password);
      
      console.log('Login successful, setting user data');
      setUser(response.user);
      setMember(response.member);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setMember(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      setMember(null);
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