
import { useState, useEffect } from 'react';
import { firebaseApi } from '@/lib/firebaseApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX, Award, Eye } from "lucide-react";
import { BADGE_DEFINITIONS } from '@/data/memberData';

interface PendingMember {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  photo_url?: string;
  dues_proof_url?: string;
  created_at: string;
}

const SecretaryMemberManagement = () => {
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');
  const [awardingTo, setAwardingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingMembers();
  }, []);

  const fetchPendingMembers = async () => {
    try {
      const data = await firebaseApi.getPendingMembers();
      setPendingMembers(data || []);
    } catch (error) {
      console.error('Error fetching pending members:', error);
      toast({
        title: "Error",
        description: "Failed to load pending members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveMember = async (memberId: string) => {
    try {
      // Use Firebase for member approval
      await firebaseApi.updateMember(memberId, { status: 'active' });

      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/approveMember`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ memberId })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Member Approved",
          description: "Member has been successfully approved"
        });
        fetchPendingMembers();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error approving member:', error);
      toast({
        title: "Error",
        description: "Failed to approve member",
        variant: "destructive"
      });
    }
  };

  const rejectMember = async (memberId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/rejectMember`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ memberId })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Member Rejected",
          description: "Member has been rejected"
        });
        fetchPendingMembers();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast({
        title: "Error",
        description: "Failed to reject member",
        variant: "destructive"
      });
    }
  };

  const awardBadge = async (memberId: string) => {
    if (!selectedBadge || !badgeDescription) {
      toast({
        title: "Missing Information",
        description: "Please select a badge and provide a description",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const selectedBadgeData = BADGE_DEFINITIONS.find(b => b.code === selectedBadge);
      
      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/awardBadge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId,
          badgeCode: selectedBadge,
          badgeName: selectedBadgeData?.name || selectedBadge,
          description: badgeDescription
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Badge Awarded",
          description: `${selectedBadgeData?.name} badge has been awarded`
        });
        setSelectedBadge('');
        setBadgeDescription('');
        setAwardingTo(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
      toast({
        title: "Error",
        description: "Failed to award badge",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600] mr-3"></div>
            <p>Loading pending members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Pending Member Approvals ({pendingMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending member approvals
            </p>
          ) : (
            <div className="space-y-4">
              {pendingMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.photo_url} alt={member.full_name} />
                      <AvatarFallback className="bg-[#E10600] text-white">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{member.full_name}</h3>
                      {member.nickname && (
                        <p className="text-sm text-muted-foreground">"{member.nickname}"</p>
                      )}
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Year:</span> {member.stateship_year}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Position:</span> {member.last_mowcub_position}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Applied:</span> {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {member.dues_proof_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={member.dues_proof_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-1" />
                            View Proof
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => approveMember(member.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectMember(member.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setAwardingTo(awardingTo === member.id ? null : member.id)}
                      >
                        <Award className="h-4 w-4 mr-1" />
                        Award Badge
                      </Button>
                    </div>
                  </div>

                  {awardingTo === member.id && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                      <div>
                        <label className="text-sm font-medium">Select Badge</label>
                        <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a badge" />
                          </SelectTrigger>
                          <SelectContent>
                            {BADGE_DEFINITIONS.map((badge) => (
                              <SelectItem key={badge.code} value={badge.code}>
                                {badge.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={badgeDescription}
                          onChange={(e) => setBadgeDescription(e.target.value)}
                          placeholder="Reason for awarding this badge..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => awardBadge(member.id)}>
                          Award Badge
                        </Button>
                        <Button variant="outline" onClick={() => setAwardingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryMemberManagement;
