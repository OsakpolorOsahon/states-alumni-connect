import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  DocumentData
} from 'firebase/firestore';

export class FirebaseApi {
  // Members API
  async getAllMembers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }

  async getActiveMembers() {
    try {
      const q = query(collection(db, 'members'), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching active members:', error);
      return [];
    }
  }

  async getPendingMembers() {
    try {
      const q = query(collection(db, 'members'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching pending members:', error);
      return [];
    }
  }

  async getMember(id: string) {
    try {
      const docRef = doc(db, 'members', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching member:', error);
      return null;
    }
  }

  async createMember(memberData: any) {
    try {
      const docRef = await addDoc(collection(db, 'members'), {
        ...memberData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...memberData };
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  }

  async updateMember(id: string, updates: any) {
    try {
      const docRef = doc(db, 'members', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  }

  async deleteMember(id: string) {
    try {
      await deleteDoc(doc(db, 'members', id));
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }

  // News API
  async getAllNews() {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getPublishedNews() {
    try {
      const q = query(
        collection(db, 'news'), 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching published news:', error);
      return [];
    }
  }

  async createNews(newsData: any) {
    try {
      const docRef = await addDoc(collection(db, 'news'), {
        ...newsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...newsData };
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  // Forum API
  async getAllForumThreads() {
    try {
      const q = query(collection(db, 'forum_threads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching forum threads:', error);
      return [];
    }
  }

  async createForumThread(threadData: any) {
    try {
      const docRef = await addDoc(collection(db, 'forum_threads'), {
        ...threadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...threadData };
    } catch (error) {
      console.error('Error creating forum thread:', error);
      throw error;
    }
  }

  // Jobs API
  async getAllJobs() {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  async getActiveJobs() {
    try {
      const q = query(
        collection(db, 'jobs'), 
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching active jobs:', error);
      return [];
    }
  }

  async createJob(jobData: any) {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...jobData };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Hall of Fame API
  async getAllHallOfFame() {
    try {
      const q = query(collection(db, 'hall_of_fame'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching hall of fame:', error);
      return [];
    }
  }

  async createHallOfFameEntry(entryData: any) {
    try {
      const docRef = await addDoc(collection(db, 'hall_of_fame'), {
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating hall of fame entry:', error);
      throw error;
    }
  }

  // Badges API
  async getBadgesByMember(memberId: string) {
    try {
      const q = query(collection(db, 'badges'), where('memberId', '==', memberId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  }

  async createBadge(badgeData: any) {
    try {
      const docRef = await addDoc(collection(db, 'badges'), {
        ...badgeData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...badgeData };
    } catch (error) {
      console.error('Error creating badge:', error);
      throw error;
    }
  }

  // Notifications API
  async getNotificationsByMember(memberId: string) {
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('memberId', '==', memberId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async createNotification(notificationData: any) {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: new Date().toISOString(),
        isRead: false
      });
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Events API
  async getAllEvents() {
    try {
      const q = query(collection(db, 'events'), orderBy('eventDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getUpcomingEvents() {
    try {
      const now = new Date().toISOString();
      const q = query(
        collection(db, 'events'),
        where('eventDate', '>', now),
        orderBy('eventDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  async createEvent(eventData: any) {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Create initial test data
  async createInitialData() {
    try {
      const batch = writeBatch(db);
      
      // Test members
      const testMembers = [
        {
          id: 'member-1',
          userId: 'user-1',
          fullName: 'John Doe',
          nickname: 'Johnny',
          stateshipYear: '2020',
          lastMowcubPosition: 'Captain',
          currentCouncilOffice: 'Member',
          role: 'member',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'secretary-1',
          userId: 'user-2',
          fullName: 'Jane Smith',
          nickname: 'Secretary Jane',
          stateshipYear: '2015',
          lastMowcubPosition: 'Major',
          currentCouncilOffice: 'Secretary General',
          role: 'secretary',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      testMembers.forEach(member => {
        const docRef = doc(db, 'members', member.id);
        batch.set(docRef, member);
      });

      await batch.commit();
      console.log('Initial data created successfully');
    } catch (error) {
      console.error('Error creating initial data:', error);
      throw error;
    }
  }
}

export const firebaseApi = new FirebaseApi();