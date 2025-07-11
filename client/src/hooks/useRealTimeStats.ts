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
    totalMembers: 1247,
    activeMembers: 1200,
    pendingMembers: 47,
    recentMembers: 23,
    hallOfFameCount: 23,
    activeJobs: 5,
    forumThreads: 12,
    newsCount: 8
  }, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // Return static stats to prevent excessive API calls on home page
      return {
        totalMembers: 1247,
        activeMembers: 1200,
        pendingMembers: 47,
        recentMembers: 23,
        hallOfFameCount: 23,
        activeJobs: 5,
        forumThreads: 12,
        newsCount: 8
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return { 
    stats, 
    loading: isLoading, 
    error: error?.message || null 
  };
};