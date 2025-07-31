import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, db } from '@/lib/supabase'

interface Member {
  id: string
  user_id: string
  full_name: string
  nickname?: string
  role: 'member' | 'secretary'
  status: 'pending' | 'active' | 'inactive'
  stateship_year?: string
  last_mowcub_position?: string
  current_council_office?: string
  latitude?: number
  longitude?: number
  photo_url?: string
  dues_proof_url?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  member: Member | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, memberData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  isSecretary: boolean
  isActiveMember: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMemberData = useCallback(async (userId: string) => {
    try {
      const result = await db.getMemberByUserId(userId)
      if (result.error) {
        console.error('Error fetching member data:', result.error)
        return null
      }
      return result.data
    } catch (error) {
      console.error('Error fetching member data:', error)
      return null
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      console.log('Refreshing session...')
      const { data: { session }, error } = await auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        setUser(null)
        setMember(null)
        setSession(null)
        setLoading(false)
        return
        return
      }

      if (session?.user) {
        console.log('Session found, setting user...')
        setUser(session.user)
        setSession(session)
        
        // Fetch member data
        const memberData = await fetchMemberData(session.user.id)
        setMember(memberData)
      } else {
        console.log('No active session')
        setUser(null)
        setMember(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      setUser(null)
      setMember(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [fetchMemberData])

  useEffect(() => {
    // Initial session check
    refreshSession()

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        setUser(session.user)
        setSession(session)
        
        // Fetch member data
        const memberData = await fetchMemberData(session.user.id)
        setMember(memberData)
      } else {
        setUser(null)
        setMember(null)
        setSession(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshSession, fetchMemberData])

  const signUp = async (email: string, password: string, memberData: any) => {
    try {
      console.log('Starting signup process for:', email)
      
      const { data, error } = await auth.signUp(email, password)
      
      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (data.user) {
        console.log('User created, creating member record...')
        
        // Create member record
        const memberRecord = {
          user_id: data.user.id,
          ...memberData,
          status: 'pending'
        }
        
        const memberResult = await db.createMember(memberRecord)
        
        if (memberResult.error) {
          console.error('Member creation error:', memberResult.error)
          throw memberResult.error
        }
        
        console.log('Member record created successfully')
      }

      return data
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email)
      setLoading(true)
      
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        console.error('Login error:', error)
        setLoading(false)
        throw error
      }

      if (data.user && data.session) {
        console.log('Login successful, setting session...')
        setUser(data.user)
        setSession(data.session)
        
        // Fetch member data immediately
        const memberData = await fetchMemberData(data.user.id)
        setMember(memberData)
        
        console.log('Login complete, member data:', memberData)
        setLoading(false)
        
        // Return success format expected by Login component  
        return { user: data.user, session: data.session, member: memberData, success: true }
      }
      
      setLoading(false)
      throw new Error('Login failed - no user data returned')
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        throw error
      }
      
      setUser(null)
      setMember(null)
      setSession(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const isSecretary = member?.role === 'secretary'
  const isActiveMember = member?.status === 'active'

  return (
    <AuthContext.Provider value={{
      user,
      member,
      session,
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
  )
}