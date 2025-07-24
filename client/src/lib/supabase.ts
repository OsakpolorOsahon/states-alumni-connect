import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Handle case where environment variables include the variable name
if (supabaseUrl?.includes('=')) {
  supabaseUrl = supabaseUrl.split('=')[1]
}
if (supabaseAnonKey?.includes('=')) {
  supabaseAnonKey = supabaseAnonKey.split('=')[1]
}

// URLs cleaned and validated
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Members
  getMembers: async () => {
    return await supabase.from('members').select('*').order('created_at', { ascending: false })
  },

  getMember: async (id: string) => {
    return await supabase.from('members').select('*').eq('id', id).single()
  },

  getMemberByUserId: async (userId: string) => {
    return await supabase.from('members').select('*').eq('user_id', userId).single()
  },

  getActiveMembers: async () => {
    return await supabase.from('members').select('*').eq('status', 'active').order('created_at', { ascending: false })
  },

  getPendingMembers: async () => {
    return await supabase.from('members').select('*').eq('status', 'pending').order('created_at', { ascending: false })
  },

  createMember: async (memberData: any) => {
    return await supabase.from('members').insert(memberData).select().single()
  },

  updateMember: async (id: string, updates: any) => {
    return await supabase.from('members').update(updates).eq('id', id).select().single()
  },

  // News
  getNews: async () => {
    return await supabase.from('news').select(`
      *,
      author:members(full_name)
    `).eq('is_published', true).order('published_at', { ascending: false })
  },

  createNews: async (newsData: any) => {
    return await supabase.from('news').insert(newsData).select().single()
  },

  // Forum
  getForumThreads: async () => {
    return await supabase.from('forum_threads').select(`
      *,
      author:members(full_name),
      replies:forum_replies(count)
    `).order('created_at', { ascending: false })
  },

  getForumReplies: async (threadId: string) => {
    return await supabase.from('forum_replies').select(`
      *,
      author:members(full_name)
    `).eq('thread_id', threadId).order('created_at', { ascending: true })
  },

  createForumThread: async (threadData: any) => {
    return await supabase.from('forum_threads').insert(threadData).select().single()
  },

  createForumReply: async (replyData: any) => {
    return await supabase.from('forum_replies').insert(replyData).select().single()
  },

  // Jobs
  getJobPosts: async () => {
    return await supabase.from('job_posts').select(`
      *,
      posted_by_member:members(full_name)
    `).eq('is_active', true).order('created_at', { ascending: false })
  },

  createJobPost: async (jobData: any) => {
    return await supabase.from('job_posts').insert(jobData).select().single()
  },

  // Mentorship
  getMentorshipRequests: async () => {
    return await supabase.from('mentorship_requests').select(`
      *,
      mentees:members!mentorship_requests_mentee_id_fkey(full_name),
      mentors:members!mentorship_requests_mentor_id_fkey(full_name)
    `).order('created_at', { ascending: false })
  },

  createMentorshipRequest: async (requestData: any) => {
    return await supabase.from('mentorship_requests').insert(requestData).select().single()
  },

  // Hall of Fame
  getHallOfFame: async () => {
    return await supabase.from('hall_of_fame').select(`
      *,
      member:members(full_name)
    `).order('created_at', { ascending: false })
  },

  // Statistics
  getStats: async () => {
    const [membersResult, newsResult] = await Promise.all([
      supabase.from('members').select('status', { count: 'exact' }),
      supabase.from('news').select('id', { count: 'exact' })
    ])

    return {
      totalMembers: membersResult.count || 0,
      activeMembers: membersResult.data?.filter(m => m.status === 'active').length || 0,
      pendingMembers: membersResult.data?.filter(m => m.status === 'pending').length || 0,
      totalNews: newsResult.count || 0
    }
  }
}

export default supabase