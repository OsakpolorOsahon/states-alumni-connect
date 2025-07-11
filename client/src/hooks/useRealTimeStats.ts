import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { createRealtimeSubscription } from '@/lib/realtime';

interface Stats {
  totalMembers: number;
  activeMembers: number;  
  pendingMembers: number;
  hallOfFameCount: number;
  recentMembers: number;
  totalNews: number;
  totalJobs: number;
  totalForumPosts: number;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    hallOfFameCount: 0,
    recentMembers: 0,
    totalNews: 0,
    totalJobs: 0,
    totalForumPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      // Fetch all required data
      const [members, hallOfFame, news, jobs, forumThreads] = await Promise.all([
        api.getAllMembers(),
        api.getAllHallOfFame(),
        api.getAllNews(),
        api.getAllJobPosts(),
        api.getAllForumThreads()
      ]);

      // Calculate stats
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.status === 'active').length;
      const pendingMembers = members.filter(m => m.status === 'pending').length;
      const hallOfFameCount = hallOfFame.length;
      const totalNews = news.length;
      const totalJobs = jobs.filter(j => j.isActive).length;
      const totalForumPosts = forumThreads.length;
      
      // Recent members (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentMembers = members.filter(m => 
        new Date(m.createdAt) > thirtyDaysAgo
      ).length;

      setStats({
        totalMembers,
        activeMembers,
        pendingMembers,
        hallOfFameCount,
        recentMembers,
        totalNews,
        totalJobs,
        totalForumPosts
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Disable realtime subscriptions until Firebase security rules are properly configured
    // This prevents permission denied errors in the console
    // TODO: Enable after Firebase security rules are set up
    
    // Set up periodic refresh instead of realtime subscriptions
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};