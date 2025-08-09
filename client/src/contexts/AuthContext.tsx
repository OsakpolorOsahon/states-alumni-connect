import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import { useConfig } from '@/contexts/ConfigContext'

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
  const { config, loading: configLoading } = useConfig()
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Create Supabase client when config is available
  const supabaseClient = config ? createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey) : null

  const fetchMemberData = useCallback(async (userId: string) => {
    if (!supabaseClient) return null
    
    try {
      const { data, error } = await supabaseClient
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .single()
        
      if (error) {
        console.error('Error fetching member data:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error fetching member data:', error)
      return null
    }
  }, [supabaseClient])

  const refreshSession = useCallback(async () => {
    if (!supabaseClient) {
      setLoading(false)
      return
    }
    
    try {
      console.log('Refreshing session...')
      const { data: { session }, error } = await supabaseClient.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        setUser(null)
        setMember(null)
        setSession(null)
        setLoading(false)
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
  }, [supabaseClient, fetchMemberData])

  // Improved session persistence
  const maintainSession = useCallback(async () => {
    if (!supabaseClient) return
    
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (session?.user && !user) {
        console.log('Restoring session...')
        setUser(session.user)
        setSession(session)
        const memberData = await fetchMemberData(session.user.id)
        setMember(memberData)
      }
    } catch (error) {
      console.error('Session maintenance error:', error)
    }
  }, [supabaseClient, user, fetchMemberData])

  // Check session on navigation/refresh
  useEffect(() => {
    const checkSession = () => {
      if (!loading && !user) {
        maintainSession()
      }
    }
    
    // Check session on focus/visibility change
    const handleFocus = () => checkSession()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loading, user, maintainSession])

  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false)
      return
    }
    
    // Initial session check
    refreshSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event: string, session: any) => {
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
  }, [supabaseClient, refreshSession, fetchMemberData])

  const signUp = async (email: string, password: string, memberData: any) => {
    if (!supabaseClient) throw new Error('Supabase client not available')
    
    try {
      console.log('Starting signup process for:', email)
      
      const { data, error } = await supabaseClient.auth.signUp({ email, password })
      
      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (data.user) {
        console.log('User created, creating member record...')
        
        // Create member record
        const memberRecord: any = {
          user_id: data.user.id,
          ...memberData,
          status: 'pending'
        }
        
        const { data: newMemberData, error: memberError } = await supabaseClient
          .from('members')
          .insert(memberRecord)
          .select()
          .single()
        
        if (memberError) {
          console.error('Member creation error:', memberError)
          throw memberError
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
    if (!supabaseClient) throw new Error('Supabase client not available')
    
    try {
      console.log('Starting login process for:', email)
      setLoading(true)
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
      
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
    if (!supabaseClient) throw new Error('Supabase client not available')
    
    try {
      const { error } = await supabaseClient.auth.signOut()
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

  // Don't render children until config is loaded
  if (configLoading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600]"></div>
      </div>
    )
  }

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