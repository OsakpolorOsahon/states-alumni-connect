import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'

export const useMentorshipRequests = () => {
  return useQuery({
    queryKey: ['mentorship'],
    queryFn: async () => {
      const result = await db.getMentorshipRequests()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const useCreateMentorshipRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (requestData: any) => {
      const result = await db.createMentorshipRequest(requestData)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship'] })
    }
  })
}