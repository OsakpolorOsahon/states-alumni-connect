
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface Member {
  id: string;
  user_id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  status: 'Pending' | 'Active' | 'Rejected' | 'Banned';
  role: 'member' | 'secretary';
  latitude?: number;
  longitude?: number;
  paid_through?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  member: Member | null;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isSecretary: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch member data when user changes
  const fetchMemberData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching member data:', error);
        return null;
      }

      return data as Member;
    } catch (error) {
      console.error('Error fetching member:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer member data fetching
          setTimeout(async () => {
            const memberData = await fetchMemberData(session.user.id);
            setMember(memberData);
            setIsLoading(false);
          }, 0);
        } else {
          setMember(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchMemberData(session.user.id).then(memberData => {
          setMember(memberData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isSecretary = member?.role === 'secretary' && member?.status === 'Active';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      member, 
      login, 
      logout, 
      isLoading, 
      isSecretary 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
