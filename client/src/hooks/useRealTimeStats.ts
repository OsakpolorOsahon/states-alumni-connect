import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabase';

export const useRealTimeStats = () => {
  return useQuery({
    queryKey: ['stats', 'realtime'],
    queryFn: async () => {
      const result = await db.getStats();
      
      return {
        totalMembers: result.totalMembers || 0,
        activeMembers: result.activeMembers || 0,
        pendingMembers: result.pendingMembers || 0,
        totalNews: result.totalNews || 0,
        hallOfFameCount: 0 // Will be implemented when hall of fame data is available
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};