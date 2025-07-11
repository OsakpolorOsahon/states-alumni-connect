import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { createRealtimeSubscription } from '@/lib/realtime';

interface JobPost {
  id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  salary_range?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  posted_by: string;
  members?: {
    full_name: string;
    photo_url?: string;
  };
}

export const useJobPosts = () => {
  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: () => apiRequest('/api/jobs'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createJob = async (jobData: Omit<JobPost, 'id' | 'created_at' | 'posted_by' | 'members'>) => {
    try {
      const result = await apiRequest('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating job:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { 
    jobs, 
    loading: isLoading, 
    error: error?.message || null, 
    refetch, 
    createJob 
  };
};