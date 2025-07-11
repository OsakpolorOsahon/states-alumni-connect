// Real-time subscription utilities for Firebase/Firestore
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface RealtimeSubscriptionOptions {
  table: string;
  filter?: {
    field: string;
    operator: any;
    value: any;
  };
  callback: (payload: any) => void;
}

export function createRealtimeSubscription({
  table,
  filter,
  callback
}: RealtimeSubscriptionOptions) {
  // Only enable realtime subscriptions if user is authenticated
  if (!auth.currentUser) {
    console.warn('Realtime subscriptions disabled - user not authenticated');
    return null;
  }

  try {
    let firestoreQuery = collection(db, table);
    
    if (filter) {
      firestoreQuery = query(
        collection(db, table),
        where(filter.field, filter.operator, filter.value)
      );
    }

    const unsubscribe = onSnapshot(firestoreQuery, (snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach((change) => {
        callback({
          type: change.type,
          data: { id: change.doc.id, ...change.doc.data() },
          old: change.type === 'modified' ? change.doc.data() : null
        });
      });
    }, (error) => {
      console.error('Realtime subscription error:', error);
      // Don't spam console with permission errors
      if (error.code !== 'permission-denied') {
        console.error('Realtime subscription error:', error);
      }
    });

    return { unsubscribe };
  } catch (error) {
    console.error('Failed to create realtime subscription:', error);
    return null;
  }
}