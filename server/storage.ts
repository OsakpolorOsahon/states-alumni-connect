import { User, InsertUser, Member, InsertMember, Badge, InsertBadge, HallOfFame, InsertHallOfFame, News, InsertNews, ForumThread, InsertForumThread, ForumReply, InsertForumReply, JobPost, InsertJobPost, JobApplication, InsertJobApplication, MentorshipRequest, InsertMentorshipRequest, Notification, InsertNotification, Event, InsertEvent } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Member operations
  getMember(id: string): Promise<Member | undefined>;
  getMemberByUserId(userId: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  getActiveMembers(): Promise<Member[]>;
  getPendingMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, updates: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  
  // Badge operations
  getBadgesByMemberId(memberId: string): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  deleteBadge(id: string): Promise<void>;
  
  // Hall of Fame operations
  getAllHallOfFame(): Promise<HallOfFame[]>;
  createHallOfFameEntry(entry: InsertHallOfFame): Promise<HallOfFame>;
  deleteHallOfFameEntry(id: string): Promise<void>;
  
  // News operations
  getAllNews(): Promise<News[]>;
  getPublishedNews(): Promise<News[]>;
  getNewsById(id: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, updates: Partial<InsertNews>): Promise<News>;
  deleteNews(id: string): Promise<void>;
  
  // Forum operations
  getAllForumThreads(): Promise<ForumThread[]>;
  getForumThreadById(id: string): Promise<ForumThread | undefined>;
  createForumThread(thread: InsertForumThread): Promise<ForumThread>;
  updateForumThread(id: string, updates: Partial<InsertForumThread>): Promise<ForumThread>;
  deleteForumThread(id: string): Promise<void>;
  
  getForumRepliesByThreadId(threadId: string): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  deleteForumReply(id: string): Promise<void>;
  
  // Job operations
  getAllJobPosts(): Promise<JobPost[]>;
  getActiveJobPosts(): Promise<JobPost[]>;
  getJobPostById(id: string): Promise<JobPost | undefined>;
  createJobPost(jobPost: InsertJobPost): Promise<JobPost>;
  updateJobPost(id: string, updates: Partial<InsertJobPost>): Promise<JobPost>;
  deleteJobPost(id: string): Promise<void>;
  
  getJobApplicationsByJobId(jobId: string): Promise<JobApplication[]>;
  getJobApplicationsByApplicantId(applicantId: string): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication>;
  
  // Mentorship operations
  getAllMentorshipRequests(): Promise<MentorshipRequest[]>;
  getMentorshipRequestsByMenteeId(menteeId: string): Promise<MentorshipRequest[]>;
  getMentorshipRequestsByMentorId(mentorId: string): Promise<MentorshipRequest[]>;
  createMentorshipRequest(request: InsertMentorshipRequest): Promise<MentorshipRequest>;
  updateMentorshipRequest(id: string, updates: Partial<InsertMentorshipRequest>): Promise<MentorshipRequest>;
  deleteMentorshipRequest(id: string): Promise<void>;
  
  // Notification operations
  getNotificationsByMemberId(memberId: string): Promise<Notification[]>;
  getUnreadNotificationsByMemberId(memberId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(memberId: string): Promise<void>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private members: Map<string, Member> = new Map();
  private badges: Map<string, Badge> = new Map();
  private hallOfFameEntries: Map<string, HallOfFame> = new Map();
  private newsItems: Map<string, News> = new Map();
  private forumThreadsData: Map<string, ForumThread> = new Map();
  private forumRepliesData: Map<string, ForumReply> = new Map();
  private jobPostsData: Map<string, JobPost> = new Map();
  private jobApplicationsData: Map<string, JobApplication> = new Map();
  private mentorshipRequestsData: Map<string, MentorshipRequest> = new Map();
  private notificationsData: Map<string, Notification> = new Map();
  private eventsData: Map<string, Event> = new Map();
  
  private userIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create a secretary user and member for testing
    const secretaryId = randomUUID();
    const secretaryUser: User = {
      id: this.userIdCounter++,
      username: "secretary@smmowcub.org",
      password: bcrypt.hashSync("secretary123", 10),
      email: "secretary@smmowcub.org"
    };
    this.users.set(secretaryUser.email, secretaryUser);

    const secretaryMember: Member = {
      id: secretaryId,
      userId: secretaryUser.id.toString(),
      fullName: "Secretary Admin",
      nickname: "Admin",
      stateshipYear: "2020",
      lastMowcubPosition: "CGS",
      currentCouncilOffice: "Secretary General",
      photoUrl: null,
      duesProofUrl: null,
      latitude: null,
      longitude: null,
      paidThrough: null,
      role: "secretary",
      status: "active",
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.members.set(secretaryId, secretaryMember);

    // Add sample news
    const newsId = randomUUID();
    const sampleNews: News = {
      id: newsId,
      authorId: secretaryId,
      title: "Welcome to SMMOWCUB Portal",
      content: "Welcome to the Senior Members Man O' War Club University of Benin portal. This platform serves as your gateway to connect with fellow alumni.",
      isPublished: true,
      publishedAt: new Date(),
      updatedAt: new Date()
    };
    this.newsItems.set(newsId, sampleNews);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.id === id) return user;
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.get(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      username: userData.username,
      password: userData.password,
      email: userData.email || userData.username
    };
    this.users.set(user.email, user);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.get(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    for (const member of Array.from(this.members.values())) {
      if (member.userId === userId) return member;
    }
    return undefined;
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getActiveMembers(): Promise<Member[]> {
    return Array.from(this.members.values())
      .filter(member => member.status === "active")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPendingMembers(): Promise<Member[]> {
    return Array.from(this.members.values())
      .filter(member => member.status === "pending")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMember(memberData: InsertMember): Promise<Member> {
    const member: Member = {
      id: randomUUID(),
      ...memberData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.members.set(member.id, member);
    return member;
  }

  async updateMember(id: string, updates: Partial<InsertMember>): Promise<Member> {
    const member = this.members.get(id);
    if (!member) throw new Error("Member not found");
    
    const updatedMember = {
      ...member,
      ...updates,
      updatedAt: new Date()
    };
    this.members.set(id, updatedMember);
    return updatedMember;
  }

  async deleteMember(id: string): Promise<void> {
    this.members.delete(id);
  }

  // Badge operations
  async getBadgesByMemberId(memberId: string): Promise<Badge[]> {
    return Array.from(this.badges.values())
      .filter(badge => badge.memberId === memberId);
  }

  async createBadge(badgeData: InsertBadge): Promise<Badge> {
    const badge: Badge = {
      id: randomUUID(),
      ...badgeData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.badges.set(badge.id, badge);
    return badge;
  }

  async deleteBadge(id: string): Promise<void> {
    this.badges.delete(id);
  }

  // Hall of Fame operations
  async getAllHallOfFame(): Promise<HallOfFame[]> {
    return Array.from(this.hallOfFameEntries.values());
  }

  async createHallOfFameEntry(entryData: InsertHallOfFame): Promise<HallOfFame> {
    const entry: HallOfFame = {
      id: randomUUID(),
      ...entryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.hallOfFameEntries.set(entry.id, entry);
    return entry;
  }

  async deleteHallOfFameEntry(id: string): Promise<void> {
    this.hallOfFameEntries.delete(id);
  }

  // News operations
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getPublishedNews(): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .filter(news => news.isPublished)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getNewsById(id: string): Promise<News | undefined> {
    return this.newsItems.get(id);
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const news: News = {
      id: randomUUID(),
      ...newsData,
      updatedAt: new Date()
    };
    this.newsItems.set(news.id, news);
    return news;
  }

  async updateNews(id: string, updates: Partial<InsertNews>): Promise<News> {
    const news = this.newsItems.get(id);
    if (!news) throw new Error("News not found");
    
    const updatedNews = {
      ...news,
      ...updates,
      updatedAt: new Date()
    };
    this.newsItems.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<void> {
    this.newsItems.delete(id);
  }

  // Forum operations
  async getAllForumThreads(): Promise<ForumThread[]> {
    return Array.from(this.forumThreadsData.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getForumThreadById(id: string): Promise<ForumThread | undefined> {
    return this.forumThreadsData.get(id);
  }

  async createForumThread(threadData: InsertForumThread): Promise<ForumThread> {
    const thread: ForumThread = {
      id: randomUUID(),
      ...threadData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.forumThreadsData.set(thread.id, thread);
    return thread;
  }

  async updateForumThread(id: string, updates: Partial<InsertForumThread>): Promise<ForumThread> {
    const thread = this.forumThreadsData.get(id);
    if (!thread) throw new Error("Thread not found");
    
    const updatedThread = {
      ...thread,
      ...updates,
      updatedAt: new Date()
    };
    this.forumThreadsData.set(id, updatedThread);
    return updatedThread;
  }

  async deleteForumThread(id: string): Promise<void> {
    this.forumThreadsData.delete(id);
  }

  async getForumRepliesByThreadId(threadId: string): Promise<ForumReply[]> {
    return Array.from(this.forumRepliesData.values())
      .filter(reply => reply.threadId === threadId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createForumReply(replyData: InsertForumReply): Promise<ForumReply> {
    const reply: ForumReply = {
      id: randomUUID(),
      ...replyData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.forumRepliesData.set(reply.id, reply);
    return reply;
  }

  async deleteForumReply(id: string): Promise<void> {
    this.forumRepliesData.delete(id);
  }

  // Job operations
  async getAllJobPosts(): Promise<JobPost[]> {
    return Array.from(this.jobPostsData.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveJobPosts(): Promise<JobPost[]> {
    return Array.from(this.jobPostsData.values())
      .filter(job => job.isActive && (!job.expiresAt || new Date(job.expiresAt) > new Date()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getJobPostById(id: string): Promise<JobPost | undefined> {
    return this.jobPostsData.get(id);
  }

  async createJobPost(jobData: InsertJobPost): Promise<JobPost> {
    const job: JobPost = {
      id: randomUUID(),
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobPostsData.set(job.id, job);
    return job;
  }

  async updateJobPost(id: string, updates: Partial<InsertJobPost>): Promise<JobPost> {
    const job = this.jobPostsData.get(id);
    if (!job) throw new Error("Job post not found");
    
    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date()
    };
    this.jobPostsData.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJobPost(id: string): Promise<void> {
    this.jobPostsData.delete(id);
  }

  async getJobApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsData.values())
      .filter(app => app.jobId === jobId);
  }

  async getJobApplicationsByApplicantId(applicantId: string): Promise<JobApplication[]> {
    return Array.from(this.jobApplicationsData.values())
      .filter(app => app.applicantId === applicantId);
  }

  async createJobApplication(applicationData: InsertJobApplication): Promise<JobApplication> {
    const application: JobApplication = {
      id: randomUUID(),
      ...applicationData,
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobApplicationsData.set(application.id, application);
    return application;
  }

  async updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication> {
    const application = this.jobApplicationsData.get(id);
    if (!application) throw new Error("Application not found");
    
    const updatedApplication = {
      ...application,
      ...updates,
      updatedAt: new Date()
    };
    this.jobApplicationsData.set(id, updatedApplication);
    return updatedApplication;
  }

  // Mentorship operations
  async getAllMentorshipRequests(): Promise<MentorshipRequest[]> {
    return Array.from(this.mentorshipRequestsData.values());
  }

  async getMentorshipRequestsByMenteeId(menteeId: string): Promise<MentorshipRequest[]> {
    return Array.from(this.mentorshipRequestsData.values())
      .filter(req => req.menteeId === menteeId);
  }

  async getMentorshipRequestsByMentorId(mentorId: string): Promise<MentorshipRequest[]> {
    return Array.from(this.mentorshipRequestsData.values())
      .filter(req => req.mentorId === mentorId);
  }

  async createMentorshipRequest(requestData: InsertMentorshipRequest): Promise<MentorshipRequest> {
    const request: MentorshipRequest = {
      id: randomUUID(),
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mentorshipRequestsData.set(request.id, request);
    return request;
  }

  async updateMentorshipRequest(id: string, updates: Partial<InsertMentorshipRequest>): Promise<MentorshipRequest> {
    const request = this.mentorshipRequestsData.get(id);
    if (!request) throw new Error("Mentorship request not found");
    
    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: new Date()
    };
    this.mentorshipRequestsData.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteMentorshipRequest(id: string): Promise<void> {
    this.mentorshipRequestsData.delete(id);
  }

  // Notification operations
  async getNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return Array.from(this.notificationsData.values())
      .filter(notif => notif.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return Array.from(this.notificationsData.values())
      .filter(notif => notif.memberId === memberId && !notif.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      id: randomUUID(),
      ...notificationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notificationsData.set(notification.id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notificationsData.get(id);
    if (notification) {
      notification.isRead = true;
      notification.updatedAt = new Date();
    }
  }

  async markAllNotificationsAsRead(memberId: string): Promise<void> {
    for (const notification of Array.from(this.notificationsData.values())) {
      if (notification.memberId === memberId) {
        notification.isRead = true;
        notification.updatedAt = new Date();
      }
    }
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.eventsData.values())
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.eventsData.values())
      .filter(event => new Date(event.eventDate) > now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return this.eventsData.get(id);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const event: Event = {
      id: randomUUID(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.eventsData.set(event.id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event> {
    const event = this.eventsData.get(id);
    if (!event) throw new Error("Event not found");
    
    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date()
    };
    this.eventsData.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    this.eventsData.delete(id);
  }
}

export const storage = new MemoryStorage();