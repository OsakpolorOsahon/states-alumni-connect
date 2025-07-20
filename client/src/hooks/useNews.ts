import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const result = await db.getNews();
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    }
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newsData: any) => {
      const result = await db.createNews(newsData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News article created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create news article');
    }
  });
};