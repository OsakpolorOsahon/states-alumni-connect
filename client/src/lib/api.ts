// API client for Express backend
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, memberData: any) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, ...memberData }),
    });
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async () => {
    return apiRequest('/api/auth/me');
  },
};

// Members API
export const membersAPI = {
  getAll: () => apiRequest('/api/members'),
  getActive: () => apiRequest('/api/members/active'),
  getPending: () => apiRequest('/api/members/pending'),
  approve: (id: string) => apiRequest(`/api/members/${id}/approve`, { method: 'PATCH' }),
};

// News API
export const newsAPI = {
  getAll: () => apiRequest('/api/news'),
  create: (data: any) => apiRequest('/api/news', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Forum API
export const forumAPI = {
  getThreads: () => apiRequest('/api/forum/threads'),
  createThread: (data: any) => apiRequest('/api/forum/threads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getReplies: (threadId: string) => apiRequest(`/api/forum/threads/${threadId}/replies`),
  createReply: (threadId: string, data: any) => apiRequest(`/api/forum/threads/${threadId}/replies`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Jobs API
export const jobsAPI = {
  getAll: () => apiRequest('/api/jobs'),
  create: (data: any) => apiRequest('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Mentorship API
export const mentorshipAPI = {
  getAll: () => apiRequest('/api/mentorship'),
  create: (data: any) => apiRequest('/api/mentorship', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Stats API
export const statsAPI = {
  get: () => apiRequest('/api/stats'),
};