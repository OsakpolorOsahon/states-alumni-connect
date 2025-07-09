
import { supabase } from "@/integrations/supabase/client";

export interface RealtimeSubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: (payload: any) => void;
}

export const createRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  const { table, event = '*', filter, callback } = config;
  
  const channelConfig: any = {
    event,
    schema: 'public',
    table
  };

  if (filter) {
    channelConfig.filter = filter;
  }

  const channel = supabase
    .channel(`${table}-changes`)
    .on('postgres_changes', channelConfig, callback)
    .subscribe();

  return channel;
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
    supabase.removeChannel(channel);
  });
};
