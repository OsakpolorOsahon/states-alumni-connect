import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  role: 'member' | 'secretary';
  status: 'active' | 'pending' | 'inactive';
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
}

interface User {
  id: string;
  email: string;
  role: 'member' | 'secretary';
  status: 'active' | 'pending' | 'inactive';
}

interface TestAuthContextType {
  user: User | null;
  member: Member | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  isSecretary: boolean;
  isPending: boolean;
  isActive: boolean;
  isVerified: boolean;
  loginAsTestMember: () => void;
  loginAsTestSecretary: () => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export const useTestAuth = () => {
  const context = useContext(TestAuthContext);
  if (!context) {
    throw new Error('useTestAuth must be used within a TestAuthProvider');
  }
  return context;
};

export const TestAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);

  const loginAsTestMember = () => {
    const testUser: User = {
      id: '9e12c55d-0e4b-421a-8347-c5c46b829957',
      email: 'testmember@smmowcub.org',
      role: 'member',
      status: 'active'
    };
    
    const testMember: Member = {
      id: '9e12c55d-0e4b-421a-8347-c5c46b829957',
      full_name: 'Test Member',
      nickname: 'TestMem',
      role: 'member',
      status: 'active',
      stateship_year: '2019',
      last_mowcub_position: 'Captain',
      current_council_office: 'Member'
    };

    setUser(testUser);
    setMember(testMember);
  };

  const loginAsTestSecretary = () => {
    const testUser: User = {
      id: '71218e71-a833-43d4-ab45-d7c4424b72a2',
      email: 'testsecretary@smmowcub.org',
      role: 'secretary',
      status: 'active'
    };
    
    const testMember: Member = {
      id: '71218e71-a833-43d4-ab45-d7c4424b72a2',
      full_name: 'Test Secretary',
      nickname: 'TestSec',
      role: 'secretary',
      status: 'active',
      stateship_year: '2020',
      last_mowcub_position: 'Colonel',
      current_council_office: 'Secretary General'
    };

    setUser(testUser);
    setMember(testMember);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simple test login logic
    if (email === 'testmember@smmowcub.org' && password === 'password') {
      loginAsTestMember();
      setLoading(false);
      return { data: user, error: null };
    } else if (email === 'testsecretary@smmowcub.org' && password === 'password') {
      loginAsTestSecretary();
      setLoading(false);
      return { data: user, error: null };
    } else {
      setLoading(false);
      return { data: null, error: 'Invalid credentials' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setMember(null);
    return { error: null };
  };

  const isSecretary = member?.role === 'secretary';
  const isPending = member?.status === 'pending';
  const isActive = member?.status === 'active';
  const isVerified = user !== null && !loading;

  return (
    <TestAuthContext.Provider
      value={{
        user,
        member,
        loading,
        signIn,
        signOut,
        isSecretary,
        isPending,
        isActive,
        isVerified,
        loginAsTestMember,
        loginAsTestSecretary,
      }}
    >
      {children}
    </TestAuthContext.Provider>
  );
};