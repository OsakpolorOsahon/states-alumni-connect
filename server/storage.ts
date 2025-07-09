import { db } from "./db";
import { users, members, badges, hallOfFame, news, forumThreads, forumReplies, jobPosts, jobApplications, mentorshipRequests, notifications, events } from "@shared/schema";
import { User, InsertUser, Member, InsertMember, Badge, InsertBadge, HallOfFame, InsertHallOfFame, News, InsertNews, ForumThread, InsertForumThread, ForumReply, InsertForumReply, JobPost, InsertJobPost, JobApplication, InsertJobApplication, MentorshipRequest, InsertMentorshipRequest, Notification, InsertNotification, Event, InsertEvent } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

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
    const result = await db.insert(members).values(member).returning();
    return result[0];
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

export const storage = new DatabaseStorage();
