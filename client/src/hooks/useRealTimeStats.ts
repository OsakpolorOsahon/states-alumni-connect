import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createRealtimeSubscription } from '@/lib/realtime';

interface Stats {
  totalMembers: number;
  activeMembers: number;  
  pendingMembers: number;
  hallOfFameCount: number;
  recentMembers: number;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    hallOfFameCount: 0,
    recentMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_member_stats');
      if (error) throw error;
      
      if (data && data.length > 0) {
        const statsData = data[0];
        setStats({
          totalMembers: statsData.total_members || 0,
          activeMembers: statsData.active_members || 0,
          pendingMembers: statsData.pending_members || 0,
          hallOfFameCount: statsData.hall_of_fame_count || 0,
          recentMembers: statsData.recent_members || 0
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions for all relevant tables
    const membersChannel = createRealtimeSubscription({
      table: 'members',
      callback: () => fetchStats()
    });

    const hallOfFameChannel = createRealtimeSubscription({
      table: 'hall_of_fame', 
      callback: () => fetchStats()
    });

    return () => {
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(hallOfFameChannel);
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};