import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Award, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  MapPin,
  Briefcase,
  MessageSquare,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  totalBadges: number;
  hallOfFameEntries: number;
  jobPosts: number;
  forumThreads: number;
  membersByYear: Array<{ year: string; count: number }>;
  membersByStatus: Array<{ status: string; count: number; color: string }>;
  badgeDistribution: Array<{ badge: string; count: number }>;
  monthlyGrowth: Array<{ month: string; members: number; badges: number }>;
  topContributors: Array<{ name: string; contributions: number; type: string }>;
}

const SecretaryAnalytics = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [
        membersResult,
        badgesResult,
        hallOfFameResult,
        jobsResult,
        forumResult
      ] = await Promise.all([
        supabase.from('members').select('id, status, stateship_year, created_at'),
        supabase.from('badges').select('id, badge_name, member_id, awarded_at'),
        supabase.from('hall_of_fame').select('id, created_at'),
        supabase.from('job_posts').select('id, created_at, is_active'),
        supabase.from('forum_threads').select('id, created_at, author_id')
      ]);

      const members = membersResult.data || [];
      const badges = badgesResult.data || [];
      const hallOfFame = hallOfFameResult.data || [];
      const jobs = jobsResult.data || [];
      const forum = forumResult.data || [];

      // Calculate basic stats
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.status === 'active').length;
      const pendingMembers = members.filter(m => m.status === 'pending').length;

      // Members by stateship year
      const yearCounts = members.reduce((acc, member) => {
        const year = member.stateship_year || 'Unknown';
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const membersByYear = Object.entries(yearCounts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year.localeCompare(b.year));

      // Members by status
      const statusCounts = members.reduce((acc, member) => {
        acc[member.status] = (acc[member.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const membersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        color: status === 'active' ? '#22c55e' : status === 'pending' ? '#f59e0b' : '#ef4444'
      }));

      // Badge distribution
      const badgeCounts = badges.reduce((acc, badge) => {
        acc[badge.badge_name] = (acc[badge.badge_name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const badgeDistribution = Object.entries(badgeCounts)
        .map(([badge, count]) => ({ badge, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Monthly growth (last 12 months)
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM format
      }).reverse();

      const monthlyGrowth = last12Months.map(month => {
        const membersInMonth = members.filter(m => 
          m.created_at && m.created_at.startsWith(month)
        ).length;
        const badgesInMonth = badges.filter(b => 
          b.awarded_at && b.awarded_at.startsWith(month)
        ).length;
        
        return {
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          members: membersInMonth,
          badges: badgesInMonth
        };
      });

      // Top contributors (members with most badges)
      const contributorCounts = badges.reduce((acc, badge) => {
        acc[badge.member_id] = (acc[badge.member_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topContributorIds = Object.entries(contributorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([memberId]) => memberId);

      const topContributorsData = await Promise.all(
        topContributorIds.map(async (memberId) => {
          const { data: member } = await supabase
            .from('members')
            .select('full_name')
            .eq('id', memberId)
            .single();
          
          return {
            name: member?.full_name || 'Unknown',
            contributions: contributorCounts[memberId],
            type: 'badges'
          };
        })
      );

      setAnalytics({
        totalMembers,
        activeMembers,
        pendingMembers,
        totalBadges: badges.length,
        hallOfFameEntries: hallOfFame.length,
        jobPosts: jobs.length,
        forumThreads: forum.length,
        membersByYear,
        membersByStatus,
        badgeDistribution,
        monthlyGrowth,
        topContributors: topContributorsData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analytics) return;
    
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      reportType,
      summary: {
        totalMembers: analytics.totalMembers,
        activeMembers: analytics.activeMembers,
        pendingMembers: analytics.pendingMembers,
        totalBadges: analytics.totalBadges,
        hallOfFameEntries: analytics.hallOfFameEntries
      },
      details: analytics
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smmowcub-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Analytics report exported successfully",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E10600]"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Failed to load analytics data</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Analytics & Reports</h3>
          <p className="text-sm text-muted-foreground">Insights and trends for SMMOWCUB membership</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-xl font-bold">{analytics.totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-xl font-bold">{analytics.activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-600" />
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-xl font-bold">{analytics.pendingMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
            <div className="text-xl font-bold">{analytics.totalBadges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-600" />
              <div className="text-xs text-muted-foreground">Hall of Fame</div>
            </div>
            <div className="text-xl font-bold">{analytics.hallOfFameEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <div className="text-xs text-muted-foreground">Jobs</div>
            </div>
            <div className="text-xl font-bold">{analytics.jobPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              <div className="text-xs text-muted-foreground">Discussions</div>
            </div>
            <div className="text-xl font-bold">{analytics.forumThreads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.membersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {analytics.membersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="members" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="badges" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Members by Stateship Year */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Members by Stateship Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.membersByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Badge Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Badges Awarded</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.badgeDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="badge" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Badge Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E10600] text-white flex items-center justify-center text-sm font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{contributor.name}</div>
                    <div className="text-sm text-muted-foreground">{contributor.contributions} badges</div>
                  </div>
                </div>
                <Award className="w-5 h-5 text-[#E10600]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryAnalytics;