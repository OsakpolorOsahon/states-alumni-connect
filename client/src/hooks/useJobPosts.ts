import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getActiveJobPosts();
      setJobs(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscription
    const channel = createRealtimeSubscription({
      table: 'job_posts',
      callback: () => fetchJobs()
    });

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    };
  }, []);

  const createJob = async (jobData: Omit<JobPost, 'id' | 'created_at' | 'posted_by' | 'members'>) => {
    try {
      const result = await api.createJobPost(jobData);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating job:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { jobs, loading, error, refetch: fetchJobs, createJob };
};