import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('job_posts')
        .select(`
          *,
          members:posted_by (
            full_name,
            photo_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      supabase.removeChannel(channel);
    };
  }, []);

  const createJob = async (jobData: Omit<JobPost, 'id' | 'created_at' | 'posted_by' | 'members'>) => {
    try {
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!member) throw new Error('Member not found');

      const { error } = await supabase
        .from('job_posts')
        .insert([{ ...jobData, posted_by: member.id }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error creating job:', error);
      return { success: false, error: error.message };
    }
  };

  return { jobs, loading, error, refetch: fetchJobs, createJob };
};