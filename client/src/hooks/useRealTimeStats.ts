import { useQuery } from '@tanstack/react-query';
import { statsAPI } from '@/lib/api';

export const useRealTimeStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: statsAPI.get,
    refetchInterval: 30000, // Refetch every 30 seconds for "real-time" effect
  });
};