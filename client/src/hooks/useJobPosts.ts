import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';

export const useJobPosts = () => {
  return useQuery({
    queryKey: ['job-posts'],
    queryFn: async () => {
      const result = await db.getJobPosts();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data || [];
    },
  });
};

export const useCreateJobPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: any) => {
      const result = await db.createJobPost(jobData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-posts'] });
    },
  });
};