
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { createRealtimeSubscription } from '@/lib/realtime';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  status: string;
  paid_through?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

interface FiltersType {
  search: string;
  year: string;
  position: string;
  office: string;
}

export const useMembers = (filters: FiltersType = { search: '', year: '', position: '', office: '' }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription
    const channel = createRealtimeSubscription({
      table: 'members',
      callback: (payload) => {
        console.log('Member change:', payload);
        fetchMembers(); // Refetch to get latest data
      }
    });

    return () => {
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    };
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getActiveMembers();
      setMembers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = !filters.search || 
      member.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (member.nickname && member.nickname.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesYear = !filters.year || member.stateship_year === filters.year;
    const matchesPosition = !filters.position || member.last_mowcub_position === filters.position;
    const matchesOffice = !filters.office || member.current_council_office === filters.office;

    return matchesSearch && matchesYear && matchesPosition && matchesOffice;
  });

  return {
    members: filteredMembers,
    loading,
    error,
    refetch: fetchMembers
  };
};
