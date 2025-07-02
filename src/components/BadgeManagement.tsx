
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Award, Plus, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
}

interface BadgeRecord {
  id: string;
  badge_name: string;
  badge_code: string;
  description?: string;
  member_id: string;
  awarded_at: string;
  member_name: string;
  member_nickname?: string;
}

const BadgeManagement = () => {
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newBadge, setNewBadge] = useState({
    member_id: '',
    badge_code: '',
    badge_name: '',
    description: ''
  });

  const predefinedBadges = [
    { code: 'TRAILBLAZER', name: 'Trailblazer', description: 'Awarded to members who are the first to achieve something major in their field' },
    { code: 'LEADERSHIP_ICON', name: 'Leadership Icon', description: 'Awarded to members who served in top roles like CINC, CGS, AG' },
    { code: 'MENTOR_OF_THE_YEAR', name: 'Mentor of the Year', description: 'Given to mentors with the most completed mentorships in a year' },
    { code: 'INNOVATOR', name: 'Innovator', description: 'Awarded to members who launch impactful projects or startups' },
    { code: 'HALL_OF_FAMER', name: 'Hall of Famer', description: 'Given to members inducted into the Hall of Fame' },
    { code: 'OUTSTANDING_SECRETARY', name: 'Outstanding Secretary', description: 'Awarded to past secretaries who maintained exceptional records' }
  ];

  useEffect(() => {
    fetchMembers();
    fetchBadges();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, nickname, stateship_year')
        .eq('status', 'Active')
        .order('full_name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      // First fetch badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('awarded_at', { ascending: false });

      if (badgesError) throw badgesError;

      // Then fetch member details for each badge
      const badgesWithMembers = await Promise.all(
        (badgesData || []).map(async (badge) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('full_name, nickname')
            .eq('id', badge.member_id)
            .single();

          return {
            ...badge,
            member_name: memberData?.full_name || 'Unknown',
            member_nickname: memberData?.nickname
          };
        })
      );

      setBadges(badgesWithMembers);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const awardBadge = async () => {
    if (!newBadge.member_id || !newBadge.badge_code) {
      toast({
        title: "Missing Information",
        description: "Please select a member and badge type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`https://ojxgyaylosexrbvvllzg.supabase.co/functions/v1/awardBadge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId: newBadge.member_id,
          badgeCode: newBadge.badge_code,
          awardedBy: session.user.id
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Badge Awarded",
          description: `Badge "${newBadge.badge_name}" has been awarded successfully`
        });
        setNewBadge({ member_id: '', badge_code: '', badge_name: '', description: '' });
        setShowAwardForm(false);
        fetchBadges();
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
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeSelect = (badge: typeof predefinedBadges[0]) => {
    setNewBadge(prev => ({
      ...prev,
      badge_code: badge.code,
      badge_name: badge.name,
      description: badge.description
    }));
  };

  return (
    <div className="space-y-6">
      {/* Award New Badge Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Badge Management</h3>
        <Button
          onClick={() => setShowAwardForm(true)}
          className="bg-[#E10600] hover:bg-[#C10500]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Award Badge
        </Button>
      </div>

      {/* Award Badge Modal */}
      <AnimatePresence>
        {showAwardForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold">Award Badge</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAwardForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Member</label>
                  <select
                    value={newBadge.member_id}
                    onChange={(e) => setNewBadge(prev => ({ ...prev, member_id: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a member...</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.full_name} ({member.stateship_year})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Badge Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {predefinedBadges.map((badge) => (
                      <Button
                        key={badge.code}
                        variant={newBadge.badge_code === badge.code ? "default" : "outline"}
                        onClick={() => handleBadgeSelect(badge)}
                        className="justify-start text-left h-auto p-3"
                      >
                        <div>
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={awardBadge}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Awarding...' : 'Award Badge'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAwardForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Awarded Badges List */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Awarded Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No badges awarded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {badges.slice(0, 10).map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E10600] text-white rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{badge.badge_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Awarded to {badge.member_name}
                        {badge.member_nickname && ` "${badge.member_nickname}"`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {new Date(badge.awarded_at).toLocaleDateString()}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeManagement;
