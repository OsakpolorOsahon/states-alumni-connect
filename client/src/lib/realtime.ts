
// Mock realtime service for the migrated application
export interface RealtimeSubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: (payload: any) => void;
}

export const createRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  const { table, event = '*', filter, callback } = config;
  
  // For now, return a mock subscription that doesn't do anything
  console.log(`Mock realtime subscription created for table: ${table}, event: ${event}, filter: ${filter}`);
  
  return {
    unsubscribe: () => {
      console.log(`Mock subscription unsubscribed for table: ${table}`);
    }
  };
};

export const subscribeToMembers = (callback: (payload: any) => void) => {
  return createRealtimeSubscription({
    table: 'members',
    callback
  });
};

export const subscribeToBadges = (callback: (payload: any) => void) => {
  return createRealtimeSubscription({
    table: 'badges',
    callback
  });
};

export const subscribeToHallOfFame = (callback: (payload: any) => void) => {
  return createRealtimeSubscription({
    table: 'hall_of_fame',
    callback
  });
};

export const subscribeToNotifications = (memberId: string, callback: (payload: any) => void) => {
  return createRealtimeSubscription({
    table: 'notifications',
    filter: `member_id=eq.${memberId}`,
    callback
  });
};

// Utility to clean up subscriptions
export const cleanupSubscriptions = (channels: any[]) => {
  channels.forEach(channel => {
    if (channel && typeof channel.unsubscribe === 'function') {
      channel.unsubscribe();
    }
  });
};
