// src/contexts/AuthContext.tsx

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
  dues_proof_url?: string;
  latitude?: number;
  longitude?: number;
}

interface AuthContextType {
  user: User | null;
  member: Member | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  createMember: (data: Omit<Member, 'id' | 'role' | 'status'>) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isSecretary: boolean;
  isPending: boolean;
  isActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchMemberData(session.user.id);
      else setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchMemberData(session.user.id);
      else {
        setMember(null);
        setLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchMemberData = async (uid: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();
    if (data) setMember(data);
    setLoading(false);
  };

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

  const createMember = (data: Omit<Member, 'id' | 'role' | 'status'>) =>
    supabase.from('members').insert([{ ...data, status: 'Pending', role: 'member' }]);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        session,
        loading,
        signUp,
        createMember,
        signIn,
        signOut,
        isSecretary: member?.role === 'secretary',
        isPending: member?.status === 'Pending',
        isActive: member?.status === 'Active',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};