import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
      // Removed broken hooks
      setThreads(data || []);
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
      if (threadsChannel && typeof threadsChannel.unsubscribe === 'function') {
        threadsChannel.unsubscribe();
      }
      if (repliesChannel && typeof repliesChannel.unsubscribe === 'function') {
        repliesChannel.unsubscribe();
      }
    };
  }, []);

  const createThread = async (threadData: { title: string; content: string }) => {
    try {
      const result = await api.createForumThread(threadData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating thread:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { threads, loading, error, refetch: fetchThreads, createThread };
};