import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/supabase'

export const useRealTimeStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const result = await db.getStats()
      return result
    },
    refetchInterval: 30000, // Refetch every 30 seconds for "real-time" effect
  })
}