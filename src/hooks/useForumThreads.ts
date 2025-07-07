import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createRealtimeSubscription } from '@/lib/realtime';

interface ForumThread {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  author_id: string;
  members?: {
    full_name: string;
    photo_url?: string;
    nickname?: string;
  };
  reply_count?: number;
  last_reply?: string;
}

export const useForumThreads = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          members:author_id (
            full_name,
            photo_url,
            nickname
          )
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get reply counts for each thread
      const threadsWithCounts = await Promise.all(
        (data || []).map(async (thread) => {
          const { count } = await supabase
            .from('forum_replies')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
          
          const { data: lastReply } = await supabase
            .from('forum_replies')
            .select('created_at')
            .eq('thread_id', thread.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...thread,
            reply_count: count || 0,
            last_reply: lastReply?.[0]?.created_at || thread.created_at
          };
        })
      );

      setThreads(threadsWithCounts);
      setError(null);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError('Failed to load forum threads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();

    // Set up real-time subscription
    const threadsChannel = createRealtimeSubscription({
      table: 'forum_threads',
      callback: () => fetchThreads()
    });

    const repliesChannel = createRealtimeSubscription({
      table: 'forum_replies',
      callback: () => fetchThreads()
    });

    return () => {
      supabase.removeChannel(threadsChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, []);

  const createThread = async (threadData: { title: string; content: string }) => {
    try {
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!member) throw new Error('Member not found');

      const { error } = await supabase
        .from('forum_threads')
        .insert([{ ...threadData, author_id: member.id }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error creating thread:', error);
      return { success: false, error: error.message };
    }
  };

  return { threads, loading, error, refetch: fetchThreads, createThread };
};