
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { createRealtimeSubscription } from '@/lib/realtime';

interface Member {
  id: string;
  fullName: string;
  full_name: string;
  nickname?: string;
  stateshipYear: string;
  stateship_year: string;
  lastMowcubPosition: string;
  last_mowcub_position: string;
  currentCouncilOffice?: string;
  current_council_office?: string;
  photoUrl?: string;
  photo_url?: string;
  status: string;
  email: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
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
      // Normalize the data to handle both camelCase and snake_case
      const normalizedData = (data || []).map((member: any) => ({
        ...member,
        fullName: member.full_name || member.fullName,
        stateshipYear: member.stateship_year || member.stateshipYear,
        lastMowcubPosition: member.last_mowcub_position || member.lastMowcubPosition,
        currentCouncilOffice: member.current_council_office || member.currentCouncilOffice,
        photoUrl: member.photo_url || member.photoUrl,
        createdAt: member.created_at || member.createdAt
      }));
      setMembers(normalizedData);
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
      (member.fullName && member.fullName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (member.nickname && member.nickname.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesYear = !filters.year || filters.year === 'all' || member.stateshipYear === filters.year;
    const matchesPosition = !filters.position || filters.position === 'all' || member.lastMowcubPosition === filters.position;
    const matchesOffice = !filters.office || filters.office === 'all' || member.currentCouncilOffice === filters.office;

    return matchesSearch && matchesYear && matchesPosition && matchesOffice;
  });

  return {
    members: filteredMembers,
    loading,
    error,
    refetch: fetchMembers
  };
};
