import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'

export const useForumThreads = () => {
  return useQuery({
    queryKey: ['forum', 'threads'],
    queryFn: async () => {
      const result = await db.getForumThreads()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const useForumReplies = (threadId: string) => {
  return useQuery({
    queryKey: ['forum', 'threads', threadId, 'replies'],
    queryFn: async () => {
      const result = await db.getForumReplies(threadId)
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    },
    enabled: !!threadId
  })
}

export const useCreateForumThread = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (threadData: any) => {
      const result = await db.createForumThread(threadData)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] })
    }
  })
}

export const useCreateForumReply = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ threadId, replyData }: { threadId: string; replyData: any }) => {
      const result = await db.createForumReply({ ...replyData, thread_id: threadId })
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['forum', 'threads', variables.threadId, 'replies'] 
      })
    }
  })
}