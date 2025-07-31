import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SecretaryStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['secretary-stats'],
    queryFn: async () => {
      const [membersResult, pendingResult, newsResult] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact' }),
        supabase.from('members').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('news').select('*', { count: 'exact' })
      ]);

      return {
        totalMembers: membersResult.count || 0,
        pendingApprovals: pendingResult.count || 0,
        newsArticles: newsResult.count || 0,
        thisMonthGrowth: 12 // TODO: Calculate actual growth
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-600">{stats?.pendingApprovals}</p>
            </div>
            <UserCheck className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{stats?.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-[#E10600]" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-green-600">+{stats?.thisMonthGrowth}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">News Articles</p>
              <p className="text-2xl font-bold">{stats?.newsArticles}</p>
            </div>
            <Award className="h-8 w-8 text-[#E10600]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryStats;