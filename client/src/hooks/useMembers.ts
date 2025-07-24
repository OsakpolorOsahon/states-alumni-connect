import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const result = await db.getMembers()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const useActiveMembers = () => {
  return useQuery({
    queryKey: ['members', 'active'],
    queryFn: async () => {
      const result = await db.getActiveMembers()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const usePendingMembers = () => {
  return useQuery({
    queryKey: ['members', 'pending'],
    queryFn: async () => {
      const result = await db.getPendingMembers()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const useApproveMember = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (memberId: string) => {
      const result = await db.updateMember(memberId, {
        status: 'active',
        approved_at: new Date().toISOString()
      })
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    }
  })
}