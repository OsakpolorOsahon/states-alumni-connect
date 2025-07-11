import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  updated_at: string;
  author_id: string;
  members?: {
    full_name: string;
    photo_url?: string;
  };
}

export const useNews = () => {
  const { data: news = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => apiRequest('/api/news'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    news, 
    loading: isLoading, 
    error: error?.message || null, 
    refetch 
  };
};