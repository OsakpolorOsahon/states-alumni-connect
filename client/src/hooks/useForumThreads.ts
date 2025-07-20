import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';

export const useForumThreads = () => {
  return useQuery({
    queryKey: ['forum-threads'],
    queryFn: async () => {
      const result = await db.getForumThreads();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data || [];
    },
  });
};

export const useForumReplies = (threadId: string) => {
  return useQuery({
    queryKey: ['forum-replies', threadId],
    queryFn: async () => {
      const result = await db.getForumReplies(threadId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data || [];
    },
    enabled: !!threadId,
  });
};

export const useCreateForumThread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (threadData: any) => {
      const result = await db.createForumThread(threadData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
    },
  });
};

export const useCreateForumReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (replyData: any) => {
      const result = await db.createForumReply(replyData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies', variables.thread_id] });
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
    },
  });
};