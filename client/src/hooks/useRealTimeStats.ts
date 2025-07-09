import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
      // For now, use mock data - can be implemented later
      setStats({
        totalMembers: 150,
        activeMembers: 120,
        pendingMembers: 5,
        hallOfFameCount: 25,
        recentMembers: 8
      });
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
      if (membersChannel && typeof membersChannel.unsubscribe === 'function') {
        membersChannel.unsubscribe();
      }
      if (hallOfFameChannel && typeof hallOfFameChannel.unsubscribe === 'function') {
        hallOfFameChannel.unsubscribe();
      }
    };
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};