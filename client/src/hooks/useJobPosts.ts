import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsAPI } from '@/lib/api';

export const useJobPosts = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: jobsAPI.getAll,
  });
};

export const useCreateJobPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jobsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};