import { Member } from '@/types/member';

const API_BASE = '/api';

// Generic API call function
async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Member operations
  getAllMembers: () => apiCall('/members'),
  getActiveMembers: () => apiCall('/members?status=active'),
  getPendingMembers: () => apiCall('/members?status=pending'),
  getMember: (id: string) => apiCall(`/members/${id}`),
  createMember: (data: any) => apiCall('/members', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMember: (id: string, data: any) => apiCall(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMember: (id: string) => apiCall(`/members/${id}`, {
    method: 'DELETE',
  }),

  // Badge operations
  getBadgesByMemberId: (memberId: string) => apiCall(`/badges?memberId=${memberId}`),
  createBadge: (data: any) => apiCall('/badges', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteBadge: (id: string) => apiCall(`/badges/${id}`, {
    method: 'DELETE',
  }),

  // Hall of Fame operations
  getAllHallOfFame: () => apiCall('/hall-of-fame'),
  createHallOfFameEntry: (data: any) => apiCall('/hall-of-fame', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteHallOfFameEntry: (id: string) => apiCall(`/hall-of-fame/${id}`, {
    method: 'DELETE',
  }),

  // News operations
  getAllNews: () => apiCall('/news'),
  getPublishedNews: () => apiCall('/news?published=true'),
  getNewsById: (id: string) => apiCall(`/news/${id}`),
  createNews: (data: any) => apiCall('/news', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateNews: (id: string, data: any) => apiCall(`/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteNews: (id: string) => apiCall(`/news/${id}`, {
    method: 'DELETE',
  }),

  // Job operations
  getAllJobPosts: () => apiCall('/jobs'),
  getActiveJobPosts: () => apiCall('/jobs?active=true'),
  getJobPostById: (id: string) => apiCall(`/jobs/${id}`),
  createJobPost: (data: any) => apiCall('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateJobPost: (id: string, data: any) => apiCall(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteJobPost: (id: string) => apiCall(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  // Forum operations
  getAllForumThreads: () => apiCall('/forum/threads'),
  getForumThreadById: (id: string) => apiCall(`/forum/threads/${id}`),
  createForumThread: (data: any) => apiCall('/forum/threads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getForumReplies: (threadId: string) => apiCall(`/forum/threads/${threadId}/replies`),
  createForumReply: (data: any) => apiCall('/forum/replies', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Event operations
  getAllEvents: () => apiCall('/events'),
  getUpcomingEvents: () => apiCall('/events?upcoming=true'),
  createEvent: (data: any) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Mentorship operations
  getAllMentorshipRequests: () => apiCall('/mentorship'),
  createMentorshipRequest: (data: any) => apiCall('/mentorship', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Notification operations
  getNotifications: (memberId: string) => apiCall(`/notifications?memberId=${memberId}`),
  markNotificationAsRead: (id: string) => apiCall(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
};