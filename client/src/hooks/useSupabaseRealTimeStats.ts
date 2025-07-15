import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface StatsData {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  recentMembers: number;
  hallOfFameCount: number;
  activeJobs: number;
  forumThreads: number;
  newsCount: number;
}

export const useSupabaseRealTimeStats = () => {
  const { data: stats = {
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    recentMembers: 0,
    hallOfFameCount: 0,
    activeJobs: 0,
    forumThreads: 0,
    newsCount: 0
  }, isLoading, error } = useQuery({
    queryKey: ['supabase-stats'],
    queryFn: async () => {
      try {
        const [
          { count: totalMembers },
          { count: activeMembers },
          { count: pendingMembers },
          { count: hallOfFameCount },
          { count: newsCount },
          { count: forumThreads },
          { count: activeJobs }
        ] = await Promise.all([
          supabase.from('members').select('*', { count: 'exact', head: true }),
          supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('hall_of_fame').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
          supabase.from('forum_threads').select('*', { count: 'exact', head: true }),
          supabase.from('job_posts').select('*', { count: 'exact', head: true })
        ]);

        // Calculate recent members (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: recentMembers } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        return {
          totalMembers: totalMembers || 0,
          activeMembers: activeMembers || 0,
          pendingMembers: pendingMembers || 0,
          recentMembers: recentMembers || 0,
          hallOfFameCount: hallOfFameCount || 0,
          activeJobs: activeJobs || 0,
          forumThreads: forumThreads || 0,
          newsCount: newsCount || 0
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          totalMembers: 0,
          activeMembers: 0,
          pendingMembers: 0,
          recentMembers: 0,
          hallOfFameCount: 0,
          activeJobs: 0,
          forumThreads: 0,
          newsCount: 0
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // refetch every 10 minutes
  });

  return { 
    stats, 
    loading: isLoading, 
    error: error?.message || null 
  };
};