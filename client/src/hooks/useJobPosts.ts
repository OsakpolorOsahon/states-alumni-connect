import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const useJobPosts = () => {
  return useQuery({
    queryKey: ['job-posts'],
    queryFn: async () => {
      const result = await db.getJobPosts();
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    }
  });
};

export const useCreateJobPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: any) => {
      const result = await db.createJobPost(jobData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-posts'] });
      toast.success('Job posting created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create job posting');
    }
  });
};

export const useJobApplications = (jobId?: string) => {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: async () => {
      const result = await db.getJobApplications(jobId);
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    }
  });
};

export const useCreateJobApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: any) => {
      const result = await db.createJobApplication(applicationData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications', variables.job_id] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    }
  });
};