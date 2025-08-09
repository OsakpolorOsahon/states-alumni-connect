import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, User, Clock } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { createSupabaseClient } from '@/lib/supabase';

const SecretaryMemberManagement = () => {
  const { config } = useConfig();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'active' | 'all'>('pending');

  // Create Supabase client
  const supabaseClient = config ? createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey) : null;

  // Fetch members based on selected tab using Supabase
  const { data: members, isLoading } = useQuery({
    queryKey: ['members', selectedTab],
    queryFn: async () => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      
      let query = supabaseClient.from('members').select('*');
      
      switch (selectedTab) {
        case 'pending':
          query = query.eq('status', 'pending');
          break;
        case 'active':
          query = query.eq('status', 'active');
          break;
        default:
          break;
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!supabaseClient
  });

  // Approve member mutation using Supabase
  const approveMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('members')
        .update({ status: 'active' })
        .eq('id', memberId)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: 'Member Approved',
        description: 'Member has been successfully approved and notified via email.',
      });
    },
    onError: (error) => {
      console.error('Approval error:', error);
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Reject member mutation using Supabase
  const rejectMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('members')
        .update({ status: 'inactive' })
        .eq('id', memberId)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: 'Member Rejected',
        description: 'Member application has been rejected and they have been notified.',
      });
    },
    onError: (error) => {
      console.error('Rejection error:', error);
      toast({
        title: 'Rejection Failed',
        description: 'Failed to reject member. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { key: 'pending', label: 'Pending Approval', icon: Clock },
          { key: 'active', label: 'Active Members', icon: CheckCircle },
          { key: 'all', label: 'All Members', icon: User },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              selectedTab === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {!members || members.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {selectedTab === 'pending' 
                  ? 'No pending member applications.'
                  : `No ${selectedTab} members found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          members.map((member: any) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.photo_url} alt={member.full_name} />
                      <AvatarFallback className="bg-[#E10600] text-white">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{member.full_name}</h3>
                        {member.nickname && (
                          <p className="text-sm text-muted-foreground">"{member.nickname}"</p>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Stateship Year:</span> {member.stateship_year}</p>
                        <p><span className="font-medium">Last Position:</span> {member.last_mowcub_position}</p>
                        {member.current_council_office && member.current_council_office !== 'None' && (
                          <p><span className="font-medium">Current Office:</span> {member.current_council_office}</p>
                        )}
                        <p><span className="font-medium">Email:</span> {member.email}</p>
                        <p><span className="font-medium">Applied:</span> {formatDate(member.created_at)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            member.status === 'active' ? 'default' :
                            member.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                        {member.role === 'secretary' && (
                          <Badge variant="outline">Secretary</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {member.dues_proof_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(member.dues_proof_url, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Dues Proof
                      </Button>
                    )}
                    
                    {member.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(member.id)}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(member.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SecretaryMemberManagement;