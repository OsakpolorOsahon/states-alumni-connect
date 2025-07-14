import { useQuery } from '@tanstack/react-query';

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

export const useRealTimeStats = () => {
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
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Return fallback data in case of error
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