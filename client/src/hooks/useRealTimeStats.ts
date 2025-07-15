import { useSupabaseRealTimeStats } from './useSupabaseRealTimeStats';

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
  return useSupabaseRealTimeStats();
};