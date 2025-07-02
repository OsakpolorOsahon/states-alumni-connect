
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  role: 'member' | 'secretary';
  status: 'Pending' | 'Active' | 'Rejected' | 'Banned';
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  paid_through?: string;
}

interface AuthContextType {
  user: User | null;
  member: Member | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, memberData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isSecretary: boolean;
  isPending: boolean;
  isActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMemberData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer the Supabase call
          setTimeout(() => {
            fetchMemberData(session.user.id);
          }, 0);
        } else {
          setMember(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchMemberData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching member data:', error);
      } else if (data) {
        setMember(data);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, memberData: any) => {
    // Validate required fields before attempting signup
    if (!memberData.photoUrl || !memberData.duesProofUrl) {
      return { error: { message: "Please upload both profile photo and dues proof" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: memberData.fullName
        }
      }
    });

    if (error) return { error };

    if (data.user) {
      // Create member record
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: data.user.id,
          full_name: memberData.fullName,
          nickname: memberData.nickname,
          stateship_year: memberData.stateshipYear,
          last_mowcub_position: memberData.lastPosition,
          current_council_office: memberData.councilOffice || 'None',
          photo_url: memberData.photoUrl,
          dues_proof_url: memberData.duesProofUrl,
          latitude: memberData.latitude,
          longitude: memberData.longitude,
          status: 'Pending'
        });

      if (memberError) return { error: memberError };
    }

    return { data };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    member,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isSecretary: member?.role === 'secretary',
    isPending: member?.status === 'Pending',
    isActive: member?.status === 'Active'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
