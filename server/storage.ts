import { db, supabaseAdmin } from "./db";
import { users, members, badges, hallOfFame, news, forumThreads, forumReplies, jobPosts, jobApplications, mentorshipRequests, notifications, events } from "@shared/schema";
import { User, InsertUser, Member, InsertMember, Badge, InsertBadge, HallOfFame, InsertHallOfFame, News, InsertNews, ForumThread, InsertForumThread, ForumReply, InsertForumReply, JobPost, InsertJobPost, JobApplication, InsertJobApplication, MentorshipRequest, InsertMentorshipRequest, Notification, InsertNotification, Event, InsertEvent } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
    return result[0];
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    const result = await db.select().from(members).where(eq(members.userId, userId)).limit(1);
    return result[0];
  }

  async getAllMembers(): Promise<Member[]> {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  }

  async getActiveMembers(): Promise<Member[]> {
    return await db.select().from(members).where(eq(members.status, 'active')).orderBy(desc(members.createdAt));
  }

  async getPendingMembers(): Promise<Member[]> {
    return await db.select().from(members).where(eq(members.status, 'pending')).orderBy(desc(members.createdAt));
  }

  async createMember(member: InsertMember): Promise<Member> {
    // Use Supabase admin client for member creation to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('members')
      .insert(member)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create member: ${error.message}`);
    }
    
    return data;
  }

  async updateMember(id: string, updates: Partial<InsertMember>): Promise<Member> {
    const result = await db.update(members).set(updates).where(eq(members.id, id)).returning();
    return result[0];
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  // Badge operations
  async getBadgesByMemberId(memberId: string): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.memberId, memberId)).orderBy(desc(badges.awardedAt));
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const result = await db.insert(badges).values(badge).returning();
    return result[0];
  }

  async deleteBadge(id: string): Promise<void> {
    await db.delete(badges).where(eq(badges.id, id));
  }

  // Hall of Fame operations
  async getAllHallOfFame(): Promise<HallOfFame[]> {
    return await db.select().from(hallOfFame).orderBy(desc(hallOfFame.createdAt));
  }

  async createHallOfFameEntry(entry: InsertHallOfFame): Promise<HallOfFame> {
    const result = await db.insert(hallOfFame).values(entry).returning();
    return result[0];
  }

  async deleteHallOfFameEntry(id: string): Promise<void> {
    await db.delete(hallOfFame).where(eq(hallOfFame.id, id));
  }

  // News operations
  async getAllNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.updatedAt));
  }

  async getPublishedNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.isPublished, true)).orderBy(desc(news.publishedAt));
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
    return result[0];
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const result = await db.insert(news).values(newsItem).returning();
    return result[0];
  }

  async updateNews(id: string, updates: Partial<InsertNews>): Promise<News> {
    const result = await db.update(news).set(updates).where(eq(news.id, id)).returning();
    return result[0];
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Forum operations
  async getAllForumThreads(): Promise<ForumThread[]> {
    return await db.select().from(forumThreads).orderBy(desc(forumThreads.isPinned), desc(forumThreads.updatedAt));
  }

  async getForumThreadById(id: string): Promise<ForumThread | undefined> {
    const result = await db.select().from(forumThreads).where(eq(forumThreads.id, id)).limit(1);
    return result[0];
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    const result = await db.insert(forumThreads).values(thread).returning();
    return result[0];
  }

  async updateForumThread(id: string, updates: Partial<InsertForumThread>): Promise<ForumThread> {
    const result = await db.update(forumThreads).set(updates).where(eq(forumThreads.id, id)).returning();
    return result[0];
  }

  async deleteForumThread(id: string): Promise<void> {
    await db.delete(forumThreads).where(eq(forumThreads.id, id));
  }

  async getForumRepliesByThreadId(threadId: string): Promise<ForumReply[]> {
    return await db.select().from(forumReplies).where(eq(forumReplies.threadId, threadId)).orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const result = await db.insert(forumReplies).values(reply).returning();
    return result[0];
  }

  async deleteForumReply(id: string): Promise<void> {
    await db.delete(forumReplies).where(eq(forumReplies.id, id));
  }

  // Job operations
  async getAllJobPosts(): Promise<JobPost[]> {
    return await db.select().from(jobPosts).orderBy(desc(jobPosts.createdAt));
  }

  async getActiveJobPosts(): Promise<JobPost[]> {
    return await db.select().from(jobPosts).where(eq(jobPosts.isActive, true)).orderBy(desc(jobPosts.createdAt));
  }

  async getJobPostById(id: string): Promise<JobPost | undefined> {
    const result = await db.select().from(jobPosts).where(eq(jobPosts.id, id)).limit(1);
    return result[0];
  }

  async createJobPost(jobPost: InsertJobPost): Promise<JobPost> {
    const result = await db.insert(jobPosts).values(jobPost).returning();
    return result[0];
  }

  async updateJobPost(id: string, updates: Partial<InsertJobPost>): Promise<JobPost> {
    const result = await db.update(jobPosts).set(updates).where(eq(jobPosts.id, id)).returning();
    return result[0];
  }

  async deleteJobPost(id: string): Promise<void> {
    await db.delete(jobPosts).where(eq(jobPosts.id, id));
  }

  async getJobApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt));
  }

  async getJobApplicationsByApplicantId(applicantId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.applicantId, applicantId)).orderBy(desc(jobApplications.createdAt));
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const result = await db.insert(jobApplications).values(application).returning();
    return result[0];
  }

  async updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication> {
    const result = await db.update(jobApplications).set(updates).where(eq(jobApplications.id, id)).returning();
    return result[0];
  }

  // Mentorship operations
  async getAllMentorshipRequests(): Promise<MentorshipRequest[]> {
    return await db.select().from(mentorshipRequests).orderBy(desc(mentorshipRequests.createdAt));
  }

  async getMentorshipRequestsByMenteeId(menteeId: string): Promise<MentorshipRequest[]> {
    return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.menteeId, menteeId)).orderBy(desc(mentorshipRequests.createdAt));
  }

  async getMentorshipRequestsByMentorId(mentorId: string): Promise<MentorshipRequest[]> {
    return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.mentorId, mentorId)).orderBy(desc(mentorshipRequests.createdAt));
  }

  async createMentorshipRequest(request: InsertMentorshipRequest): Promise<MentorshipRequest> {
    const result = await db.insert(mentorshipRequests).values(request).returning();
    return result[0];
  }

  async updateMentorshipRequest(id: string, updates: Partial<InsertMentorshipRequest>): Promise<MentorshipRequest> {
    const result = await db.update(mentorshipRequests).set(updates).where(eq(mentorshipRequests.id, id)).returning();
    return result[0];
  }

  async deleteMentorshipRequest(id: string): Promise<void> {
    await db.delete(mentorshipRequests).where(eq(mentorshipRequests.id, id));
  }

  // Notification operations
  async getNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.memberId, memberId)).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(and(eq(notifications.memberId, memberId), eq(notifications.isRead, false))).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(memberId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.memberId, memberId));
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.eventDate));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return await db.select().from(events).where(sql`event_date > NOW()`).orderBy(events.eventDate);
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event> {
    const result = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }
}

// In-memory storage implementation for development
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private members: Member[] = [];
  private badges: Badge[] = [];
  private hallOfFame: HallOfFame[] = [];
  private news: News[] = [];
  private forumThreads: ForumThread[] = [];
  private forumReplies: ForumReply[] = [];
  private jobPosts: JobPost[] = [];
  private jobApplications: JobApplication[] = [];
  private mentorshipRequests: MentorshipRequest[] = [];
  private notifications: Notification[] = [];
  private events: Event[] = [];
  
  private nextUserId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    return this.members.find(m => m.id === id);
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    return this.members.find(m => m.userId === userId);
  }

  async getAllMembers(): Promise<Member[]> {
    return [...this.members].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getActiveMembers(): Promise<Member[]> {
    return this.members
      .filter(m => m.status === 'active')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getPendingMembers(): Promise<Member[]> {
    return this.members
      .filter(m => m.status === 'pending')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createMember(member: InsertMember): Promise<Member> {
    const newMember: Member = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...member
    };
    this.members.push(newMember);
    return newMember;
  }

  async updateMember(id: string, updates: Partial<InsertMember>): Promise<Member> {
    const index = this.members.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Member not found");
    
    this.members[index] = {
      ...this.members[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.members[index];
  }

  async deleteMember(id: string): Promise<void> {
    const index = this.members.findIndex(m => m.id === id);
    if (index !== -1) {
      this.members.splice(index, 1);
    }
  }

  // Badge operations
  async getBadgesByMemberId(memberId: string): Promise<Badge[]> {
    return this.badges
      .filter(b => b.memberId === memberId)
      .sort((a, b) => new Date(b.awardedAt || 0).getTime() - new Date(a.awardedAt || 0).getTime());
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const newBadge: Badge = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...badge
    };
    this.badges.push(newBadge);
    return newBadge;
  }

  async deleteBadge(id: string): Promise<void> {
    const index = this.badges.findIndex(b => b.id === id);
    if (index !== -1) {
      this.badges.splice(index, 1);
    }
  }

  // Hall of Fame operations
  async getAllHallOfFame(): Promise<HallOfFame[]> {
    return [...this.hallOfFame].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createHallOfFameEntry(entry: InsertHallOfFame): Promise<HallOfFame> {
    const newEntry: HallOfFame = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...entry
    };
    this.hallOfFame.push(newEntry);
    return newEntry;
  }

  async deleteHallOfFameEntry(id: string): Promise<void> {
    const index = this.hallOfFame.findIndex(h => h.id === id);
    if (index !== -1) {
      this.hallOfFame.splice(index, 1);
    }
  }

  // News operations
  async getAllNews(): Promise<News[]> {
    return [...this.news].sort((a, b) => 
      new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  }

  async getPublishedNews(): Promise<News[]> {
    return this.news
      .filter(n => n.isPublished)
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  }

  async getNewsById(id: string): Promise<News | undefined> {
    return this.news.find(n => n.id === id);
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const newNews: News = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newsItem
    };
    this.news.push(newNews);
    return newNews;
  }

  async updateNews(id: string, updates: Partial<InsertNews>): Promise<News> {
    const index = this.news.findIndex(n => n.id === id);
    if (index === -1) throw new Error("News not found");
    
    this.news[index] = {
      ...this.news[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.news[index];
  }

  async deleteNews(id: string): Promise<void> {
    const index = this.news.findIndex(n => n.id === id);
    if (index !== -1) {
      this.news.splice(index, 1);
    }
  }

  // Forum operations
  async getAllForumThreads(): Promise<ForumThread[]> {
    return [...this.forumThreads].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
  }

  async getForumThreadById(id: string): Promise<ForumThread | undefined> {
    return this.forumThreads.find(t => t.id === id);
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    const newThread: ForumThread = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...thread
    };
    this.forumThreads.push(newThread);
    return newThread;
  }

  async updateForumThread(id: string, updates: Partial<InsertForumThread>): Promise<ForumThread> {
    const index = this.forumThreads.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Thread not found");
    
    this.forumThreads[index] = {
      ...this.forumThreads[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.forumThreads[index];
  }

  async deleteForumThread(id: string): Promise<void> {
    const index = this.forumThreads.findIndex(t => t.id === id);
    if (index !== -1) {
      this.forumThreads.splice(index, 1);
    }
  }

  async getForumRepliesByThreadId(threadId: string): Promise<ForumReply[]> {
    return this.forumReplies
      .filter(r => r.threadId === threadId)
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const newReply: ForumReply = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...reply
    };
    this.forumReplies.push(newReply);
    return newReply;
  }

  async deleteForumReply(id: string): Promise<void> {
    const index = this.forumReplies.findIndex(r => r.id === id);
    if (index !== -1) {
      this.forumReplies.splice(index, 1);
    }
  }

  // Job operations
  async getAllJobPosts(): Promise<JobPost[]> {
    return [...this.jobPosts].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getActiveJobPosts(): Promise<JobPost[]> {
    return this.jobPosts
      .filter(j => j.isActive)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getJobPostById(id: string): Promise<JobPost | undefined> {
    return this.jobPosts.find(j => j.id === id);
  }

  async createJobPost(jobPost: InsertJobPost): Promise<JobPost> {
    const newJobPost: JobPost = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...jobPost
    };
    this.jobPosts.push(newJobPost);
    return newJobPost;
  }

  async updateJobPost(id: string, updates: Partial<InsertJobPost>): Promise<JobPost> {
    const index = this.jobPosts.findIndex(j => j.id === id);
    if (index === -1) throw new Error("Job post not found");
    
    this.jobPosts[index] = {
      ...this.jobPosts[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.jobPosts[index];
  }

  async deleteJobPost(id: string): Promise<void> {
    const index = this.jobPosts.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobPosts.splice(index, 1);
    }
  }

  async getJobApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    return this.jobApplications
      .filter(a => a.jobId === jobId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getJobApplicationsByApplicantId(applicantId: string): Promise<JobApplication[]> {
    return this.jobApplications
      .filter(a => a.applicantId === applicantId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const newApplication: JobApplication = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...application
    };
    this.jobApplications.push(newApplication);
    return newApplication;
  }

  async updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication> {
    const index = this.jobApplications.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Application not found");
    
    this.jobApplications[index] = {
      ...this.jobApplications[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.jobApplications[index];
  }

  // Mentorship operations
  async getAllMentorshipRequests(): Promise<MentorshipRequest[]> {
    return [...this.mentorshipRequests].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getMentorshipRequestsByMenteeId(menteeId: string): Promise<MentorshipRequest[]> {
    return this.mentorshipRequests
      .filter(r => r.menteeId === menteeId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getMentorshipRequestsByMentorId(mentorId: string): Promise<MentorshipRequest[]> {
    return this.mentorshipRequests
      .filter(r => r.mentorId === mentorId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createMentorshipRequest(request: InsertMentorshipRequest): Promise<MentorshipRequest> {
    const newRequest: MentorshipRequest = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...request
    };
    this.mentorshipRequests.push(newRequest);
    return newRequest;
  }

  async updateMentorshipRequest(id: string, updates: Partial<InsertMentorshipRequest>): Promise<MentorshipRequest> {
    const index = this.mentorshipRequests.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Request not found");
    
    this.mentorshipRequests[index] = {
      ...this.mentorshipRequests[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.mentorshipRequests[index];
  }

  async deleteMentorshipRequest(id: string): Promise<void> {
    const index = this.mentorshipRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.mentorshipRequests.splice(index, 1);
    }
  }

  // Notification operations
  async getNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return this.notifications
      .filter(n => n.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getUnreadNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    return this.notifications
      .filter(n => n.memberId === memberId && !n.isRead)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const newNotification: Notification = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...notification
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].isRead = true;
    }
  }

  async markAllNotificationsAsRead(memberId: string): Promise<void> {
    this.notifications
      .filter(n => n.memberId === memberId)
      .forEach(n => n.isRead = true);
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return [...this.events].sort((a, b) => 
      new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime()
    );
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return this.events
      .filter(e => new Date(e.eventDate || 0) > now)
      .sort((a, b) => new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime());
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return this.events.find(e => e.id === id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...event
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Event not found");
    
    this.events[index] = {
      ...this.events[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.events[index];
  }

  async deleteEvent(id: string): Promise<void> {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
}

// Supabase storage implementation
export class SupabaseStorage implements IStorage {
  // User operations - using Supabase Auth
  async getUser(id: number): Promise<User | undefined> {
    if (db) {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (db) {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    if (db) {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  // Member operations
  async getMember(id: string): Promise<Member | undefined> {
    if (db) {
      const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async getMemberByUserId(userId: string): Promise<Member | undefined> {
    if (db) {
      const result = await db.select().from(members).where(eq(members.userId, userId)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async getAllMembers(): Promise<Member[]> {
    if (db) {
      return await db.select().from(members).orderBy(desc(members.createdAt));
    }
    return [];
  }

  async getActiveMembers(): Promise<Member[]> {
    if (db) {
      return await db.select().from(members).where(eq(members.status, 'active')).orderBy(desc(members.createdAt));
    }
    return [];
  }

  async getPendingMembers(): Promise<Member[]> {
    if (db) {
      return await db.select().from(members).where(eq(members.status, 'pending')).orderBy(desc(members.createdAt));
    }
    return [];
  }

  async createMember(member: InsertMember): Promise<Member> {
    if (db) {
      const result = await db.insert(members).values(member).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateMember(id: string, updates: Partial<InsertMember>): Promise<Member> {
    if (db) {
      const result = await db.update(members).set(updates).where(eq(members.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteMember(id: string): Promise<void> {
    if (db) {
      await db.delete(members).where(eq(members.id, id));
    }
  }

  // Badge operations
  async getBadgesByMemberId(memberId: string): Promise<Badge[]> {
    if (db) {
      return await db.select().from(badges).where(eq(badges.memberId, memberId)).orderBy(desc(badges.awardedAt));
    }
    return [];
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    if (db) {
      const result = await db.insert(badges).values(badge).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteBadge(id: string): Promise<void> {
    if (db) {
      await db.delete(badges).where(eq(badges.id, id));
    }
  }

  // Hall of Fame operations
  async getAllHallOfFame(): Promise<HallOfFame[]> {
    if (db) {
      return await db.select().from(hallOfFame).orderBy(desc(hallOfFame.createdAt));
    }
    return [];
  }

  async createHallOfFameEntry(entry: InsertHallOfFame): Promise<HallOfFame> {
    if (db) {
      const result = await db.insert(hallOfFame).values(entry).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteHallOfFameEntry(id: string): Promise<void> {
    if (db) {
      await db.delete(hallOfFame).where(eq(hallOfFame.id, id));
    }
  }

  // News operations
  async getAllNews(): Promise<News[]> {
    if (db) {
      return await db.select().from(news).orderBy(desc(news.updatedAt));
    }
    return [];
  }

  async getPublishedNews(): Promise<News[]> {
    if (db) {
      return await db.select().from(news).where(eq(news.isPublished, true)).orderBy(desc(news.publishedAt));
    }
    return [];
  }

  async getNewsById(id: string): Promise<News | undefined> {
    if (db) {
      const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    if (db) {
      const result = await db.insert(news).values(newsItem).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateNews(id: string, updates: Partial<InsertNews>): Promise<News> {
    if (db) {
      const result = await db.update(news).set(updates).where(eq(news.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteNews(id: string): Promise<void> {
    if (db) {
      await db.delete(news).where(eq(news.id, id));
    }
  }

  // Forum operations
  async getAllForumThreads(): Promise<ForumThread[]> {
    if (db) {
      return await db.select().from(forumThreads).orderBy(desc(forumThreads.isPinned), desc(forumThreads.updatedAt));
    }
    return [];
  }

  async getForumThreadById(id: string): Promise<ForumThread | undefined> {
    if (db) {
      const result = await db.select().from(forumThreads).where(eq(forumThreads.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    if (db) {
      const result = await db.insert(forumThreads).values(thread).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateForumThread(id: string, updates: Partial<InsertForumThread>): Promise<ForumThread> {
    if (db) {
      const result = await db.update(forumThreads).set(updates).where(eq(forumThreads.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteForumThread(id: string): Promise<void> {
    if (db) {
      await db.delete(forumThreads).where(eq(forumThreads.id, id));
    }
  }

  async getForumRepliesByThreadId(threadId: string): Promise<ForumReply[]> {
    if (db) {
      return await db.select().from(forumReplies).where(eq(forumReplies.threadId, threadId)).orderBy(forumReplies.createdAt);
    }
    return [];
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    if (db) {
      const result = await db.insert(forumReplies).values(reply).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteForumReply(id: string): Promise<void> {
    if (db) {
      await db.delete(forumReplies).where(eq(forumReplies.id, id));
    }
  }

  // Job operations
  async getAllJobPosts(): Promise<JobPost[]> {
    if (db) {
      return await db.select().from(jobPosts).orderBy(desc(jobPosts.createdAt));
    }
    return [];
  }

  async getActiveJobPosts(): Promise<JobPost[]> {
    if (db) {
      return await db.select().from(jobPosts).where(eq(jobPosts.isActive, true)).orderBy(desc(jobPosts.createdAt));
    }
    return [];
  }

  async getJobPostById(id: string): Promise<JobPost | undefined> {
    if (db) {
      const result = await db.select().from(jobPosts).where(eq(jobPosts.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async createJobPost(jobPost: InsertJobPost): Promise<JobPost> {
    if (db) {
      const result = await db.insert(jobPosts).values(jobPost).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateJobPost(id: string, updates: Partial<InsertJobPost>): Promise<JobPost> {
    if (db) {
      const result = await db.update(jobPosts).set(updates).where(eq(jobPosts.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteJobPost(id: string): Promise<void> {
    if (db) {
      await db.delete(jobPosts).where(eq(jobPosts.id, id));
    }
  }

  async getJobApplicationsByJobId(jobId: string): Promise<JobApplication[]> {
    if (db) {
      return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt));
    }
    return [];
  }

  async getJobApplicationsByApplicantId(applicantId: string): Promise<JobApplication[]> {
    if (db) {
      return await db.select().from(jobApplications).where(eq(jobApplications.applicantId, applicantId)).orderBy(desc(jobApplications.createdAt));
    }
    return [];
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    if (db) {
      const result = await db.insert(jobApplications).values(application).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication> {
    if (db) {
      const result = await db.update(jobApplications).set(updates).where(eq(jobApplications.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  // Mentorship operations
  async getAllMentorshipRequests(): Promise<MentorshipRequest[]> {
    if (db) {
      return await db.select().from(mentorshipRequests).orderBy(desc(mentorshipRequests.createdAt));
    }
    return [];
  }

  async getMentorshipRequestsByMenteeId(menteeId: string): Promise<MentorshipRequest[]> {
    if (db) {
      return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.menteeId, menteeId)).orderBy(desc(mentorshipRequests.createdAt));
    }
    return [];
  }

  async getMentorshipRequestsByMentorId(mentorId: string): Promise<MentorshipRequest[]> {
    if (db) {
      return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.mentorId, mentorId)).orderBy(desc(mentorshipRequests.createdAt));
    }
    return [];
  }

  async createMentorshipRequest(request: InsertMentorshipRequest): Promise<MentorshipRequest> {
    if (db) {
      const result = await db.insert(mentorshipRequests).values(request).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateMentorshipRequest(id: string, updates: Partial<InsertMentorshipRequest>): Promise<MentorshipRequest> {
    if (db) {
      const result = await db.update(mentorshipRequests).set(updates).where(eq(mentorshipRequests.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteMentorshipRequest(id: string): Promise<void> {
    if (db) {
      await db.delete(mentorshipRequests).where(eq(mentorshipRequests.id, id));
    }
  }

  // Notification operations
  async getNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    if (db) {
      return await db.select().from(notifications).where(eq(notifications.memberId, memberId)).orderBy(desc(notifications.createdAt));
    }
    return [];
  }

  async getUnreadNotificationsByMemberId(memberId: string): Promise<Notification[]> {
    if (db) {
      return await db.select().from(notifications).where(and(eq(notifications.memberId, memberId), eq(notifications.isRead, false))).orderBy(desc(notifications.createdAt));
    }
    return [];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    if (db) {
      const result = await db.insert(notifications).values(notification).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async markNotificationAsRead(id: string): Promise<void> {
    if (db) {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    }
  }

  async markAllNotificationsAsRead(memberId: string): Promise<void> {
    if (db) {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.memberId, memberId));
    }
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    if (db) {
      return await db.select().from(events).orderBy(desc(events.eventDate));
    }
    return [];
  }

  async getUpcomingEvents(): Promise<Event[]> {
    if (db) {
      return await db.select().from(events).where(sql`event_date > NOW()`).orderBy(events.eventDate);
    }
    return [];
  }

  async getEventById(id: string): Promise<Event | undefined> {
    if (db) {
      const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
      return result[0];
    }
    return undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    if (db) {
      const result = await db.insert(events).values(event).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event> {
    if (db) {
      const result = await db.update(events).set(updates).where(eq(events.id, id)).returning();
      return result[0];
    }
    throw new Error("Database not available");
  }

  async deleteEvent(id: string): Promise<void> {
    if (db) {
      await db.delete(events).where(eq(events.id, id));
    }
  }
}

// Use Supabase storage if database available, otherwise use memory storage
export const storage = db ? new SupabaseStorage() : new MemoryStorage();
