import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorshipAPI } from '@/lib/api';

export const useMentorshipRequests = () => {
  return useQuery({
    queryKey: ['mentorship'],
    queryFn: mentorshipAPI.getAll,
  });
};

export const useCreateMentorshipRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mentorshipAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship'] });
    },
  });
};