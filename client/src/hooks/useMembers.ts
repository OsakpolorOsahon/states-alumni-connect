
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/members/active'],
    queryFn: async () => {
      const data = await apiRequest('/api/members/active');
      // Normalize the data to handle both camelCase and snake_case
      return (data || []).map((member: any) => ({
        ...member,
        fullName: member.full_name || member.fullName,
        stateshipYear: member.stateship_year || member.stateshipYear,
        lastMowcubPosition: member.last_mowcub_position || member.lastMowcubPosition,
        currentCouncilOffice: member.current_council_office || member.currentCouncilOffice,
        photoUrl: member.photo_url || member.photoUrl,
        createdAt: member.created_at || member.createdAt
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
};
