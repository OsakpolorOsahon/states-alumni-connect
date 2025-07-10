import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserData(session.user.id, session.user.email);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setMember(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string, email: string) => {
    try {
      // Try to get existing member data
      const members = await api.getAllMembers();
      const existingMember = members.find(m => m.userId === userId);
      
      if (existingMember) {
        const userData: User = {
          id: userId,
          email: email,
          role: existingMember.role,
          status: existingMember.status
        };
        setUser(userData);
        setMember(existingMember);
      } else {
        // Create temporary user without member data
        const userData: User = {
          id: userId,
          email: email,
          role: 'member',
          status: 'pending'
        };
        setUser(userData);
        setMember(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set basic user data even if member fetch fails
      const userData: User = {
        id: userId,
        email: email,
        role: 'member',
        status: 'pending'
      };
      setUser(userData);
      setMember(null);
    }
  };

  const signUp = async (email: string, password: string, memberData?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: memberData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { data: null, error: error.message };
      }

      // Return success immediately - member creation will happen after email verification
      return { data: data.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        return { data: null, error: error.message };
      }

      return { data: data.user, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
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