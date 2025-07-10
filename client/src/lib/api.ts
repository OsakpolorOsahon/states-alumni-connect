// API client for Firebase backend
import { firebaseApi } from './firebaseApi';

class ApiClient {
  // Fallback to Firebase API for all requests
  private async fallbackToFirebase(endpoint: string, options: RequestInit = {}): Promise<any> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : null;
    
    try {
      // Route to appropriate Firebase method based on endpoint
      if (endpoint === '/members') {
        return method === 'GET' ? await firebaseApi.getAllMembers() : await firebaseApi.createMember(body);
      }
      if (endpoint === '/members/active') {
        return await firebaseApi.getActiveMembers();
      }
      if (endpoint === '/members/pending') {
        return await firebaseApi.getPendingMembers();
      }
      if (endpoint.startsWith('/members/') && method === 'GET') {
        const id = endpoint.split('/')[2];
        return await firebaseApi.getMember(id);
      }
      if (endpoint === '/news') {
        return method === 'GET' ? await firebaseApi.getAllNews() : await firebaseApi.createNews(body);
      }
      if (endpoint === '/news/published') {
        return await firebaseApi.getPublishedNews();
      }
      if (endpoint === '/forum/threads') {
        return method === 'GET' ? await firebaseApi.getAllForumThreads() : await firebaseApi.createForumThread(body);
      }
      if (endpoint === '/jobs') {
        return method === 'GET' ? await firebaseApi.getAllJobs() : await firebaseApi.createJob(body);
      }
      if (endpoint === '/jobs/active') {
        return await firebaseApi.getActiveJobs();
      }
      if (endpoint === '/hall-of-fame') {
        return method === 'GET' ? await firebaseApi.getAllHallOfFame() : await firebaseApi.createHallOfFameEntry(body);
      }
      if (endpoint.startsWith('/badges/member/')) {
        const memberId = endpoint.split('/')[3];
        return await firebaseApi.getBadgesByMember(memberId);
      }
      if (endpoint === '/badges') {
        return await firebaseApi.createBadge(body);
      }
      if (endpoint.startsWith('/notifications/member/')) {
        const memberId = endpoint.split('/')[3];
        return await firebaseApi.getNotificationsByMember(memberId);
      }
      if (endpoint === '/notifications') {
        return await firebaseApi.createNotification(body);
      }
      if (endpoint === '/events') {
        return method === 'GET' ? await firebaseApi.getAllEvents() : await firebaseApi.createEvent(body);
      }
      if (endpoint === '/events/upcoming') {
        return await firebaseApi.getUpcomingEvents();
      }
      
      // Default empty response for unmatched endpoints
      return [];
    } catch (error) {
      console.error('Firebase API error:', error);
      return [];
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use Firebase API directly
    return this.fallbackToFirebase(endpoint, options);
  }

  // Member API
  async getMembers() {
    return this.request('/members');
  }

  async getActiveMembers() {
    return this.request('/members/active');
  }

  async getPendingMembers() {
    return this.request('/members/pending');
  }

  async getMember(id: string) {
    return this.request(`/members/${id}`);
  }

  async createMember(data: any) {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMember(id: string, data: any) {
    return this.request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string) {
    return this.request(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  // Badge API
  async getBadgesByMember(memberId: string) {
    return this.request(`/badges/member/${memberId}`);
  }

  async createBadge(data: any) {
    return this.request('/badges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteBadge(id: string) {
    return this.request(`/badges/${id}`, {
      method: 'DELETE',
    });
  }

  // Hall of Fame API
  async getHallOfFame() {
    return this.request('/hall-of-fame');
  }

  async createHallOfFameEntry(data: any) {
    return this.request('/hall-of-fame', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteHallOfFameEntry(id: string) {
    return this.request(`/hall-of-fame/${id}`, {
      method: 'DELETE',
    });
  }

  // News API
  async getAllNews() {
    return this.request('/news');
  }

  async getPublishedNews() {
    return this.request('/news/published');
  }

  async getNewsById(id: string) {
    return this.request(`/news/${id}`);
  }

  async createNews(data: any) {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNews(id: string, data: any) {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNews(id: string) {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }

  // Forum API
  async getAllForumThreads() {
    return this.request('/forum/threads');
  }

  async getForumThread(id: string) {
    return this.request(`/forum/threads/${id}`);
  }

  async createForumThread(data: any) {
    return this.request('/forum/threads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateForumThread(id: string, data: any) {
    return this.request(`/forum/threads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteForumThread(id: string) {
    return this.request(`/forum/threads/${id}`, {
      method: 'DELETE',
    });
  }

  async getForumReplies(threadId: string) {
    return this.request(`/forum/threads/${threadId}/replies`);
  }

  async createForumReply(data: any) {
    return this.request('/forum/replies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteForumReply(id: string) {
    return this.request(`/forum/replies/${id}`, {
      method: 'DELETE',
    });
  }

  // Job API
  async getAllJobPosts() {
    return this.request('/jobs');
  }

  async getActiveJobPosts() {
    return this.request('/jobs/active');
  }

  async getJobPost(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJobPost(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobPost(id: string, data: any) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobPost(id: string) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getJobApplications(jobId: string) {
    return this.request(`/jobs/${jobId}/applications`);
  }

  async createJobApplication(data: any) {
    return this.request('/job-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobApplication(id: string, data: any) {
    return this.request(`/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Mentorship API
  async getMentorshipRequests() {
    return this.request('/mentorship/requests');
  }

  async getMentorshipRequestsByMentee(menteeId: string) {
    return this.request(`/mentorship/requests/mentee/${menteeId}`);
  }

  async getMentorshipRequestsByMentor(mentorId: string) {
    return this.request(`/mentorship/requests/mentor/${mentorId}`);
  }

  async createMentorshipRequest(data: any) {
    return this.request('/mentorship/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMentorshipRequest(id: string, data: any) {
    return this.request(`/mentorship/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMentorshipRequest(id: string) {
    return this.request(`/mentorship/requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Notification API
  async getNotifications(memberId: string) {
    return this.request(`/notifications/member/${memberId}`);
  }

  async getUnreadNotifications(memberId: string) {
    return this.request(`/notifications/member/${memberId}/unread`);
  }

  async createNotification(data: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead(memberId: string) {
    return this.request(`/notifications/member/${memberId}/read-all`, {
      method: 'POST',
    });
  }

  // Events API
  async getAllEvents() {
    return this.request('/events');
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming');
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(data: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Helper methods for compatibility
  async getAllMembers() {
    return this.getMembers();
  }

  async getAllHallOfFame() {
    return this.getHallOfFame();
  }
}

export const api = new ApiClient();