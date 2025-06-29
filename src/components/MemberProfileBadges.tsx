
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface BadgeRecord {
  id: string;
  badge_name: string;
  badge_code: string;
  description?: string;
  awarded_at: string;
}

interface MemberProfileBadgesProps {
  memberId: string;
}

const MemberProfileBadges = ({ memberId }: MemberProfileBadgesProps) => {
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberBadges();
  }, [memberId]);

  const fetchMemberBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('member_id', memberId)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching member badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recognition Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recognition Badges ({badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="space-y-4">
            {badges.map(badge => (
              <div key={badge.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-[#E10600] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{badge.badge_name}</h4>
                  {badge.description && (
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {badge.badge_code}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(badge.awarded_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No badges awarded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberProfileBadges;
