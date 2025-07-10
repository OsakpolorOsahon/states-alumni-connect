// Real-time subscription utilities for Firebase/Firestore
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    });

    return { unsubscribe };
  } catch (error) {
    console.error('Failed to create realtime subscription:', error);
    return null;
  }
}