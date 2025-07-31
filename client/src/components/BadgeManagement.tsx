import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Award, Plus, X, User, Trophy, Star, Crown, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  const { member } = useAuth();
  const { toast } = useToast();
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    { code: 'OUTSTANDING_SECRETARY', name: 'Outstanding Secretary', description: 'Awarded to past secretaries who maintained exceptional records' },
    { code: 'COMMUNITY_CHAMPION', name: 'Community Champion', description: 'For members who actively contribute to community development' },
    { code: 'EXCELLENCE_AWARD', name: 'Excellence Award', description: 'For outstanding professional achievement' }
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
        .eq('status', 'active')
        .order('full_name');
      
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive"
      });
    }
  };

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('badges')
        .select(`
          id,
          badge_name,
          badge_code,
          description,
          member_id,
          awarded_at,
          members!inner(full_name, nickname)
        `)
        .order('awarded_at', { ascending: false });
      
      if (error) throw error;
      
      const badgeRecords = data?.map(badge => ({
        id: badge.id,
        badge_name: badge.badge_name,
        badge_code: badge.badge_code,
        description: badge.description,
        member_id: badge.member_id,
        awarded_at: badge.awarded_at,
        member_name: Array.isArray(badge.members) ? badge.members[0]?.full_name : badge.members?.full_name,
        member_nickname: Array.isArray(badge.members) ? badge.members[0]?.nickname : badge.members?.nickname
      })) || [];
      
      setBadges(badgeRecords);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast({
        title: "Error",
        description: "Failed to load badges",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const awardBadge = async () => {
    if (!newBadge.member_id || !newBadge.badge_code || !newBadge.badge_name) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('badges')
        .insert({
          member_id: newBadge.member_id,
          badge_name: newBadge.badge_name,
          badge_code: newBadge.badge_code,
          description: newBadge.description,
          awarded_by: member?.id,
          awarded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Badge awarded successfully!",
      });

      setNewBadge({
        member_id: '',
        badge_code: '',
        badge_name: '',
        description: ''
      });
      setShowAwardForm(false);
      fetchBadges();
    } catch (error) {
      console.error('Error awarding badge:', error);
      toast({
        title: "Error",
        description: "Failed to award badge",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeBadge = async (badgeId: string) => {
    try {
      const { error } = await supabase
        .from('badges')
        .delete()
        .eq('id', badgeId);

      if (error) throw error;

      toast({
        title: "Success", 
        description: "Badge removed successfully",
      });
      fetchBadges();
    } catch (error) {
      console.error('Error removing badge:', error);
      toast({
        title: "Error",
        description: "Failed to remove badge",
        variant: "destructive"
      });
    }
  };

  const handlePredefinedBadgeSelect = (badgeCode: string) => {
    const predefined = predefinedBadges.find(b => b.code === badgeCode);
    if (predefined) {
      setNewBadge(prev => ({
        ...prev,
        badge_code: predefined.code,
        badge_name: predefined.name,
        description: predefined.description
      }));
    }
  };

  const getBadgeIcon = (badgeCode: string) => {
    switch (badgeCode) {
      case 'TRAILBLAZER': return <Star className="w-4 h-4" />;
      case 'LEADERSHIP_ICON': return <Crown className="w-4 h-4" />;
      case 'HALL_OF_FAMER': return <Trophy className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badgeCode: string) => {
    switch (badgeCode) {
      case 'TRAILBLAZER': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LEADERSHIP_ICON': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'HALL_OF_FAMER': return 'bg-gold-100 text-gold-800 border-gold-300';
      case 'MENTOR_OF_THE_YEAR': return 'bg-green-100 text-green-800 border-green-300';
      case 'INNOVATOR': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Award Badge Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Badge Management</h3>
          <p className="text-sm text-muted-foreground">Award and manage member badges</p>
        </div>
        <Button 
          onClick={() => setShowAwardForm(true)} 
          className="bg-[#E10600] hover:bg-[#E10600]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Award Badge
        </Button>
      </div>

      {/* Award Badge Form */}
      <AnimatePresence>
        {showAwardForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Award New Badge
                  </CardTitle>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAwardForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Member</label>
                    <Select 
                      value={newBadge.member_id} 
                      onValueChange={(value) => setNewBadge(prev => ({ ...prev, member_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name} ({member.stateship_year})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Predefined Badge</label>
                    <Select 
                      value={newBadge.badge_code} 
                      onValueChange={handlePredefinedBadgeSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a badge type" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedBadges.map((badge) => (
                          <SelectItem key={badge.code} value={badge.code}>
                            {badge.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Badge Name</label>
                  <Input
                    value={newBadge.badge_name}
                    onChange={(e) => setNewBadge(prev => ({ ...prev, badge_name: e.target.value }))}
                    placeholder="Enter badge name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newBadge.description}
                    onChange={(e) => setNewBadge(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the achievement or reason for this badge"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAwardForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={awardBadge}
                    disabled={submitting}
                    className="bg-[#E10600] hover:bg-[#E10600]/90"
                  >
                    {submitting ? "Awarding..." : "Award Badge"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge List */}
      <Card>
        <CardHeader>
          <CardTitle>Awarded Badges ({badges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600]"></div>
            </div>
          ) : badges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No badges awarded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getBadgeColor(badge.badge_code)}`}>
                      {getBadgeIcon(badge.badge_code)}
                    </div>
                    <div>
                      <h4 className="font-medium">{badge.badge_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Awarded to {badge.member_name}
                        {badge.member_nickname && ` (${badge.member_nickname})`}
                      </p>
                      {badge.description && (
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(badge.awarded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBadge(badge.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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