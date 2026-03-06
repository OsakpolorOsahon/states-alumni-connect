import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { User, Session, SupabaseClient } from '@supabase/supabase-js'
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
  supabaseClient: SupabaseClient | null
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
  
  const supabaseClient = useMemo(() => {
    if (!config) return null
    return createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey)
  }, [config?.supabaseUrl, config?.supabaseAnonKey])

  const fetchMemberData = useCallback(async (userId: string, client?: SupabaseClient | null) => {
    const sc = client || supabaseClient
    if (!sc) return null
    
    let timedOut = false
    const timeoutId = setTimeout(() => { timedOut = true }, 15000)
    
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (timedOut) {
          console.warn('fetchMemberData: 15s timeout reached')
          return null
        }
        try {
          if (attempt > 0) {
            console.log(`Retrying member fetch (attempt ${attempt + 1})...`)
            await new Promise(r => setTimeout(r, 1000))
          }

          const { data, error } = await sc
            .from('members')
            .select('*')
            .eq('user_id', userId)
            .single()
            
          if (error) {
            console.error(`Error fetching member data (attempt ${attempt + 1}):`, error)
            continue
          }
          return data
        } catch (error) {
          console.error(`Error fetching member data (attempt ${attempt + 1}):`, error)
        }
      }
      return null
    } finally {
      clearTimeout(timeoutId)
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

  useEffect(() => {
    const checkSession = () => {
      if (!loading && !user) {
        maintainSession()
      }
    }
    
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
    
    const handleAuthCallback = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const hasHashToken = window.location.hash.includes('access_token')
      
      if (code) {
        console.log('Detected auth callback code, exchanging for session...')
        try {
          const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Code exchange error:', error)
          } else if (data.session?.user) {
            console.log('Code exchange successful, setting session...')
            setUser(data.session.user)
            setSession(data.session)
            const memberData = await fetchMemberData(data.session.user.id, supabaseClient)
            setMember(memberData)
          }
          window.history.replaceState({}, '', url.pathname)
          setLoading(false)
          return true
        } catch (e) {
          console.error('Code exchange failed:', e)
        }
      }
      
      if (hasHashToken) {
        console.log('Detected hash token, waiting for Supabase to process...')
        await new Promise(r => setTimeout(r, 500))
      }
      
      return false
    }

    handleAuthCallback().then((handled) => {
      if (!handled) refreshSession()
    })

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        setUser(session.user)
        setSession(session)
        const memberData = await fetchMemberData(session.user.id, supabaseClient)
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
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verified`
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (data.user) {
        console.log('User created, creating member record...')
        
        const { data: newMemberData, error: memberError } = await supabaseClient
          .rpc('create_member_on_signup', {
            p_user_id: data.user.id,
            p_full_name: memberData.full_name,
            p_nickname: memberData.nickname || null,
            p_stateship_year: memberData.stateship_year || '',
            p_last_mowcub_position: memberData.last_mowcub_position || '',
            p_current_council_office: memberData.current_council_office || null,
            p_latitude: memberData.latitude || null,
            p_longitude: memberData.longitude || null,
          })
        
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
        
        const memberData = await fetchMemberData(data.user.id, supabaseClient)
        setMember(memberData)
        
        console.log('Login complete, member data:', memberData)
        setLoading(false)
        
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
      supabaseClient,
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
