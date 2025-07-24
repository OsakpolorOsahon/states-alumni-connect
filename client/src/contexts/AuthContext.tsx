import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, auth, db } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
      console.log('Refreshing session...');
      const { data: { session } } = await auth.getSession();
      
      if (session?.user) {
        console.log('Session found, setting user...');
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        });

        // Get member data with timeout
        console.log('Fetching member data...');
        const memberPromise = db.getMemberByUserId(session.user.id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Member data fetch timeout')), 5000)
        );
        
        try {
          const memberResult = await Promise.race([memberPromise, timeoutPromise]) as any;
          
          if (memberResult.data) {
            console.log('Member data found:', memberResult.data.full_name);
            setMember({
              id: memberResult.data.id,
              userId: memberResult.data.user_id,
              full_name: memberResult.data.full_name,
              nickname: memberResult.data.nickname,
              role: memberResult.data.role as 'member' | 'secretary',
              status: memberResult.data.status as 'pending' | 'active' | 'inactive',
              stateship_year: memberResult.data.stateship_year,
              last_mowcub_position: memberResult.data.last_mowcub_position,
              current_council_office: memberResult.data.current_council_office,
              latitude: memberResult.data.latitude,
              longitude: memberResult.data.longitude,
              photo_url: memberResult.data.photo_url,
              dues_proof_url: memberResult.data.dues_proof_url,
              created_at: memberResult.data.created_at,
              updated_at: memberResult.data.updated_at
            });
          } else {
            console.warn('No member data found for user');
            setMember(null);
          }
        } catch (memberError) {
          console.error('Error fetching member data:', memberError);
          // Don't fail the whole process if member data fails
          setMember(null);
        }
      } else {
        console.log('No session found');
        setUser(null);
        setMember(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setMember(null);
      throw error; // Re-throw so calling code knows it failed
    }
  }, []);

  useEffect(() => {
    // Listen to auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        });
        await refreshSession();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setMember(null);
      }
      setLoading(false);
    });

    // Initial session check
    refreshSession().finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, [refreshSession]);

  const signUp = async (email: string, password: string, memberData: any) => {
    try {
      const { data: authData, error: authError } = await auth.signUp(email, password);
      
      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        // Create member record
        const memberResult = await db.createMember({
          user_id: authData.user.id,
          full_name: memberData.full_name,
          nickname: memberData.nickname || null,
          stateship_year: memberData.stateship_year,
          last_mowcub_position: memberData.last_mowcub_position,
          current_council_office: memberData.current_council_office === 'none' ? null : memberData.current_council_office,
          photo_url: memberData.photo_url || null,
          dues_proof_url: memberData.dues_proof_url || null,
          latitude: memberData.latitude,
          longitude: memberData.longitude
        });

        if (memberResult.error) {
          throw new Error(memberResult.error.message);
        }

        return { success: true, message: 'Account created successfully. Please check your email for verification.' };
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message);
      }

      if (data?.user) {
        console.log('User authenticated successfully');
        
        // Set user immediately for faster login experience
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        });
        
        // Try to get member data but don't block on it
        try {
          const memberResult = await db.getMemberByUserId(data.user.id);
          if (memberResult.data) {
            setMember({
              id: memberResult.data.id,
              userId: memberResult.data.user_id,
              full_name: memberResult.data.full_name,
              nickname: memberResult.data.nickname,
              role: memberResult.data.role as 'member' | 'secretary',
              status: memberResult.data.status as 'pending' | 'active' | 'inactive',
              stateship_year: memberResult.data.stateship_year,
              last_mowcub_position: memberResult.data.last_mowcub_position,
              current_council_office: memberResult.data.current_council_office,
              latitude: memberResult.data.latitude,
              longitude: memberResult.data.longitude,
              photo_url: memberResult.data.photo_url,
              dues_proof_url: memberResult.data.dues_proof_url,
              created_at: memberResult.data.created_at,
              updated_at: memberResult.data.updated_at
            });
          }
        } catch (memberError) {
          console.warn('Could not fetch member data:', memberError);
          // Don't fail the login if member data fails
        }
        
        return { success: true, message: 'Signed in successfully' };
      } else {
        throw new Error('Authentication failed - no user data returned');
      }
    } catch (error: any) {
      console.error('SignIn error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before signing in.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setMember(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Clear local state regardless
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