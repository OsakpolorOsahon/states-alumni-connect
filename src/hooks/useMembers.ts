
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Define sorting order for Council Offices
  const councilOfficeOrder: { [key: string]: number } = {
    'President': 1,
    'Vice President': 2, // Assuming a standard hierarchy
    'Secretary': 3,
    'Treasurer': 4,
    'PRO': 5,
    'None': 999, // Put 'None' at the end
    '': 1000, // Handle empty string if necessary
  };

  // Define sorting order for MOWCUB Positions
  // Assuming MOWCUB_POSITIONS is an array of objects with code and title
  // We need to define the specific order from Commander In Chief to Director of Intelligence
  // I'll create a mapping based on the order you specified and a likely full list
  const mowcubPositionOrder: { [key: string]: number } = {
    'Commander In Chief': 1,
    'Chief of Staff': 2,
    'Chief of Operations': 3,
    'Director of Intelligence': 4,
    'Statesman': 5, // Assuming Statesman is a general position
    '': 999, // Handle empty string if necessary
  };
  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription
    const channel = createRealtimeSubscription({
      table: 'members',
      callback: (payload) => {
        const newMember = payload.new as Member;
        const oldMember = payload.old as Member;

        setMembers(prevMembers => {
          switch (payload.eventType) {
            case 'INSERT':
              // Only add active members
              if (newMember.status === 'Active') {
                return [...prevMembers, newMember];
              }
              return prevMembers;
            case 'UPDATE':
              // Replace if active, remove if status changed from Active to something else
              if (newMember.status === 'Active') {
                return prevMembers.map(member => member.id === newMember.id ? newMember : member);
              } else {
                 return prevMembers.filter(member => member.id !== oldMember.id);
              }
            case 'DELETE':
              return prevMembers.filter(member => member.id !== oldMember.id);
            default: return prevMembers;}});
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('members')
        .select('*')
        .eq('status', 'Active')
        .order('current_council_office')
        .order('stateship_year')
        .order('last_mowcub_position');

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

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

  // Apply custom sorting
  const sortedMembers = filteredMembers.sort((a, b) => {
    // 1. Sort by Council Position
    const aOfficeOrder = councilOfficeOrder[a.current_council_office || ''] || 1000;
    const bOfficeOrder = councilOfficeOrder[b.current_council_office || ''] || 1000;
    if (aOfficeOrder !== bOfficeOrder) {
      return aOfficeOrder - bOfficeOrder;
    }

    // 2. Sort by Year of Statesmanship (Oldest to Youngest)
    // Assuming year is in 'YYYY/YYYY' format, compare the first year
    const aYear = parseInt(a.stateship_year.split('/')[0], 10);
    const bYear = parseInt(b.stateship_year.split('/')[0], 10);
    if (aYear !== bYear) {
      return aYear - bYear;
    }

    // 3. Sort by Last MOWCUB Position
    const aPositionOrder = mowcubPositionOrder[a.last_mowcub_position || ''] || 999;
    const bPositionOrder = mowcubPositionOrder[b.last_mowcub_position || ''] || 999;
    return aPositionOrder - bPositionOrder;
  });

  return {
    members: sortedMembers,
    loading,
    error,
    refetch: fetchMembers
  };
};
