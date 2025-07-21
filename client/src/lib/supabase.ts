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

console.log('Supabase URL (cleaned):', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

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

  createMember: async (member: any) => {
    return await supabase.from('members').insert(member).select().single()
  },

  updateMember: async (id: string, updates: any) => {
    return await supabase.from('members').update(updates).eq('id', id).select().single()
  },

  // News
  getNews: async () => {
    return await supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false })
  },

  createNews: async (news: any) => {
    return await supabase.from('news').insert(news).select().single()
  },

  // Forum
  getForumThreads: async () => {
    return await supabase.from('forum_threads').select('*').order('is_pinned', { ascending: false }).order('updated_at', { ascending: false })
  },

  getForumReplies: async (threadId: string) => {
    return await supabase.from('forum_replies').select('*').eq('thread_id', threadId).order('created_at', { ascending: true })
  },

  createForumThread: async (thread: any) => {
    return await supabase.from('forum_threads').insert(thread).select().single()
  },

  createForumReply: async (reply: any) => {
    return await supabase.from('forum_replies').insert(reply).select().single()
  },

  // Jobs
  getJobPosts: async () => {
    return await supabase.from('job_posts').select('*').eq('is_active', true).order('created_at', { ascending: false })
  },

  createJobPost: async (job: any) => {
    return await supabase.from('job_posts').insert(job).select().single()
  },

  // Hall of Fame
  getHallOfFame: async () => {
    return await supabase.from('hall_of_fame').select('*, members(full_name, photo_url)').order('created_at', { ascending: false })
  },

  createHallOfFame: async (achievement: any) => {
    return await supabase.from('hall_of_fame').insert(achievement).select().single()
  },

  // Events
  getEvents: async () => {
    return await supabase.from('events').select('*').order('event_date', { ascending: true })
  },

  createEvent: async (event: any) => {
    return await supabase.from('events').insert(event).select().single()
  },

  // Job Applications
  getJobApplications: async (jobId?: string) => {
    const query = supabase.from('job_applications').select('*, members(full_name), job_posts(title)');
    if (jobId) {
      return query.eq('job_id', jobId);
    }
    return query.order('created_at', { ascending: false });
  },

  createJobApplication: async (application: any) => {
    return await supabase.from('job_applications').insert(application).select().single()
  },

  // Mentorship
  getMentorshipRequests: async () => {
    return await supabase.from('mentorship_requests').select('*, mentees:members!mentee_id(full_name), mentors:members!mentor_id(full_name)').order('created_at', { ascending: false })
  },

  createMentorshipRequest: async (request: any) => {
    return await supabase.from('mentorship_requests').insert(request).select().single()
  },

  updateMentorshipRequest: async (id: string, updates: any) => {
    return await supabase.from('mentorship_requests').update(updates).eq('id', id).select().single()
  },

  // Notifications
  getNotifications: async (memberId: string) => {
    return await supabase.from('notifications').select('*').eq('member_id', memberId).order('created_at', { ascending: false })
  },

  markNotificationRead: async (id: string) => {
    return await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToMembers: (callback: (payload: any) => void) => {
    return supabase
      .channel('members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, callback)
      .subscribe()
  },

  subscribeToNews: (callback: (payload: any) => void) => {
    return supabase
      .channel('news')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, callback)
      .subscribe()
  },

  subscribeToForumThreads: (callback: (payload: any) => void) => {
    return supabase
      .channel('forum_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_threads' }, callback)
      .subscribe()
  },

  subscribeToNotifications: (memberId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`notifications:${memberId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `member_id=eq.${memberId}`
      }, callback)
      .subscribe()
  }
}