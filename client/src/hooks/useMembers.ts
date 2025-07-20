import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const result = await db.getMembers();
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    }
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      const result = await db.getMember(id);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    enabled: !!id
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (memberData: any) => {
      const result = await db.createMember(memberData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create member');
    }
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const result = await db.updateMember(id, updates);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] });
      toast.success('Member updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update member');
    }
  });
};