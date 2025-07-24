import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersAPI } from '@/lib/api';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: membersAPI.getAll,
  });
};

export const useActiveMembers = () => {
  return useQuery({
    queryKey: ['members', 'active'],
    queryFn: membersAPI.getActive,
  });
};

export const usePendingMembers = () => {
  return useQuery({
    queryKey: ['members', 'pending'],
    queryFn: membersAPI.getPending,
  });
};

export const useApproveMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberId: string) => membersAPI.approve(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};