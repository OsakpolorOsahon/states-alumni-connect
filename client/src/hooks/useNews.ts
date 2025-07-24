import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsAPI } from '@/lib/api';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: newsAPI.getAll,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: newsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};