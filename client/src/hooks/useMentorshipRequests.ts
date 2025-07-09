import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
      const data = await api.getAllMentorshipRequests();
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
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    };
  }, []);

  const createRequest = async (mentorId: string, message: string) => {
    try {
      const result = await api.createMentorshipRequest({
        mentorId,
        requestMessage: message
      });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error creating mentorship request:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const respondToRequest = async (requestId: string, status: 'active' | 'completed') => {
    try {
      const result = await api.updateMentorshipRequest(requestId, { status });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error responding to mentorship request:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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