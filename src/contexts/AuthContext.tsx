
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  nickname?: string;
  lastWarSession: string;
  lastMowcubPosition: string;
  currentCouncilOffice?: string;
  profilePhoto?: string;
  isSecretary: boolean;
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for existing session
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem('smmowcub_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === "demo@smmowcub.org" && password === "demo") {
      const mockUser: User = {
        id: "1",
        email: "demo@smmowcub.org",
        fullName: "John Doe",
        nickname: "JD",
        lastWarSession: "2020/2021",
        lastMowcubPosition: "President (PRES)",
        currentCouncilOffice: "President (PRES)",
        profilePhoto: "/placeholder.svg",
        isSecretary: false,
        isApproved: true
      };
      setUser(mockUser);
      localStorage.setItem('smmowcub_user', JSON.stringify(mockUser));
      return true;
    }
    
    if (email === "secretary@smmowcub.org" && password === "secretary") {
      const secretaryUser: User = {
        id: "2",
        email: "secretary@smmowcub.org",
        fullName: "Jane Secretary",
        lastWarSession: "2018/2019",
        lastMowcubPosition: "Secretary General (SEC-GEN)",
        currentCouncilOffice: "Secretary General (SEC-GEN)",
        profilePhoto: "/placeholder.svg",
        isSecretary: true,
        isApproved: true
      };
      setUser(secretaryUser);
      localStorage.setItem('smmowcub_user', JSON.stringify(secretaryUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smmowcub_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
