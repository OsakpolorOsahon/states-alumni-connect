import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createRealtimeSubscription } from '@/lib/realtime';

interface MentorshipRequest {
  id: string;
  request_message?: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  responded_at?: string;
  mentee_id: string;
  mentor_id: string;
  mentee?: {
    full_name: string;
    photo_url?: string;
    nickname?: string;
    stateship_year: string;
    last_mowcub_position: string;
  };
  mentor?: {
    full_name: string;
    photo_url?: string;
    nickname?: string;
    stateship_year: string;
    last_mowcub_position: string;
  };
}

export const useMentorshipRequests = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          mentee:members!mentee_id (
            full_name,
            photo_url,
            nickname,
            stateship_year,
            last_mowcub_position
          ),
          mentor:members!mentor_id (
            full_name,
            photo_url,
            nickname,
            stateship_year,
            last_mowcub_position
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching mentorship requests:', err);
      setError('Failed to load mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up real-time subscription
    const channel = createRealtimeSubscription({
      table: 'mentorship_requests',
      callback: () => fetchRequests()
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createRequest = async (mentorId: string, message: string) => {
    try {
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!member) throw new Error('Member not found');

      const { error } = await supabase
        .from('mentorship_requests')
        .insert([{
          mentee_id: member.id,
          mentor_id: mentorId,
          request_message: message
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error creating mentorship request:', error);
      return { success: false, error: error.message };
    }
  };

  const respondToRequest = async (requestId: string, status: 'active' | 'completed') => {
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({
          status,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error responding to mentorship request:', error);
      return { success: false, error: error.message };
    }
  };

  return { 
    requests,
    loading,
    error,
    refetch: fetchRequests,
    createRequest,
    respondToRequest
  };
};