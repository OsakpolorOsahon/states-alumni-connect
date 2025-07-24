import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumAPI } from '@/lib/api';

export const useForumThreads = () => {
  return useQuery({
    queryKey: ['forum', 'threads'],
    queryFn: forumAPI.getThreads,
  });
};

export const useForumReplies = (threadId: string) => {
  return useQuery({
    queryKey: ['forum', 'threads', threadId, 'replies'],
    queryFn: () => forumAPI.getReplies(threadId),
    enabled: !!threadId,
  });
};

export const useCreateForumThread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: forumAPI.createThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] });
    },
  });
};

export const useCreateForumReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ threadId, data }: { threadId: string; data: any }) => 
      forumAPI.createReply(threadId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['forum', 'threads', variables.threadId, 'replies'] 
      });
    },
  });
};