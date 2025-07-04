// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Member = Tables<'members'>;
type MemberInsert = TablesInsert<'members'>;

interface AuthContextType {
  user: User | null;
  member: Member | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>;
  createMember: (data: Omit<MemberInsert, 'id' | 'role' | 'status'>) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<{ error: any }>;
  isSecretary: boolean;
  isPending: boolean;
  isActive: boolean;
  isVerified: boolean;
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

  const signUp = (email: string, password: string, metadata?: any) =>
    supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/upload-documents`
      }
    });

  const createMember = async (data: Omit<MemberInsert, 'id' | 'role' | 'status'>) => {
    const insertData: MemberInsert = { 
      ...data, 
      status: 'Pending', 
      role: 'member'
    };
    return await supabase.from('members').insert([insertData]);
  };

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
        isVerified: user?.email_confirmed_at ? true : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};