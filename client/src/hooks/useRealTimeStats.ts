import { useEffect, useState } from 'react';
import { useMembers } from './useMembers';
import { useNews } from './useNews';
import { useForumThreads } from './useForumThreads';
import { useJobPosts } from './useJobPosts';
import { realtime } from '@/lib/supabase';

export const useRealTimeStats = () => {
  const { data: members = [] } = useMembers();
  const { data: news = [] } = useNews();
  const { data: threads = [] } = useForumThreads();
  const { data: jobs = [] } = useJobPosts();

  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    recentMembers: 0,
    totalNews: 0,
    recentNews: 0,
    totalThreads: 0,
    activeThreads: 0,
    totalJobs: 0,
    activeJobs: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const newStats = {
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        pendingMembers: members.filter(m => m.status === 'pending').length,
        recentMembers: members.filter(m => 
          new Date(m.created_at) > thirtyDaysAgo && m.status === 'active'
        ).length,
        totalNews: news.length,
        recentNews: news.filter(n => 
          new Date(n.published_at || n.updated_at) > sevenDaysAgo
        ).length,
        totalThreads: threads.length,
        activeThreads: threads.filter(t => 
          new Date(t.updated_at) > sevenDaysAgo
        ).length,
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.is_active).length
      };

      setStats(newStats);
    };

    calculateStats();
  }, [members, news, threads, jobs]);

  // Set up real-time subscriptions
  useEffect(() => {
    const subscriptions = [
      realtime.subscribeToMembers(() => {
        // Stats will be recalculated when useMembers updates
      }),
      realtime.subscribeToNews(() => {
        // Stats will be recalculated when useNews updates
      }),
      realtime.subscribeToForumThreads(() => {
        // Stats will be recalculated when useForumThreads updates
      })
    ];

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, []);

  return stats;
};