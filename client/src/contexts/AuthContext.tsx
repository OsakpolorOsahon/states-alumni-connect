import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';

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
  refreshUserData: () => Promise<void>;
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
      refreshUserData: async () => {},
    };
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid, firebaseUser.email || '');
      } else {
        setUser(null);
        setMember(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId: string, email: string) => {
    try {
      // Try to get existing member data from Firestore
      const memberDoc = await getDoc(doc(db, 'members', userId));
      
      if (memberDoc.exists()) {
        const memberData = memberDoc.data() as Member;
        const userData: User = {
          id: userId,
          email: email,
          role: memberData.role,
          status: memberData.status
        };
        setUser(userData);
        setMember(memberData);
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
      console.log('Starting signup process for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Firebase Auth user created successfully:', user.uid);

      // Create member document in Firestore
      if (memberData) {
        const memberDoc = {
          id: user.uid,
          userId: user.uid,
          fullName: memberData.full_name || '',
          nickname: memberData.nickname || '',
          stateshipYear: memberData.stateship_year || '',
          lastMowcubPosition: memberData.last_mowcub_position || '',
          currentCouncilOffice: memberData.current_council_office || '',
          photoUrl: memberData.photo_url || '',
          duesProofUrl: memberData.dues_proof_url || '',
          latitude: memberData.latitude || null,
          longitude: memberData.longitude || null,
          paidThrough: memberData.paid_through || '',
          role: 'member' as const,
          status: 'pending' as const,
          approvedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log('Creating member document:', memberDoc);
        try {
          await setDoc(doc(db, 'members', user.uid), memberDoc);
          console.log('Member document created successfully');
        } catch (firestoreError) {
          console.error('Firestore document creation failed:', firestoreError);
          // If Firestore fails, we still return success since the Firebase Auth user was created
          // The user can complete their profile later
          return { 
            data: user, 
            error: null,
            warning: 'Account created but profile data could not be saved. You may need to complete your profile later.'
          };
        }
      }

      // Send email verification with custom settings
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/upload-documents`,
          handleCodeInApp: true
        });
        console.log('Email verification sent successfully');
      } catch (emailError) {
        console.error('Email verification failed:', emailError);
        // Don't fail the signup if email verification fails
      }

      return { data: user, error: null };
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Wait for user data to be fetched
      await fetchUserData(userCredential.user.uid, userCredential.user.email || '');
      
      return { data: userCredential.user, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  };

  const createMember = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, 'members'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { data: { id: docRef.id, ...data }, error: null };
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
        refreshUserData: () => fetchUserData(user?.id || '', user?.email || ''),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};