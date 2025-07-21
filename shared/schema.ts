import { pgTable, text, serial, integer, boolean, timestamp, uuid, pgEnum, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["member", "secretary"]);
export const memberStatusEnum = pgEnum("member_status", ["pending", "active", "inactive"]);
export const mentorshipStatusEnum = pgEnum("mentorship_status", ["pending", "active", "completed"]);
export const notificationTypeEnum = pgEnum("notification_type", ["general", "approval", "badge", "hall_of_fame", "job", "mentorship"]);
export const stateshipYearEnum = pgEnum("stateship_year_enum", [
  "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985",
  "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995",
  "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005",
  "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015",
  "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"
]);
export const lastPositionEnum = pgEnum("last_position_enum", [
  "CINC", "CGS", "AG", "GOC", "PM", "EC", "QMG", "DSD", "STO", "BM", "DO", "FCRO",
  "DOP", "CSO", "DOH", "CDI", "CMO", "HOV", "DAG", "DPM", "DQMG", "DDSD", "DBM", 
  "DDO", "DFCRO", "DDOP", "DDOH", "PC", "ADC", "DI", "None"
]);
export const councilOfficeEnum = pgEnum("council_office_enum", [
  "President", "Vice President", "Secretary General", "Assistant Secretary General",
  "Treasurer", "Financial Secretary", "Public Relations Officer", "Welfare Officer",
  "Provost Marshal", "Organizing Secretary", "Member"
]);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  fullName: text("full_name").notNull(),
  nickname: text("nickname"),
  stateshipYear: stateshipYearEnum("stateship_year").notNull(),
  lastMowcubPosition: lastPositionEnum("last_mowcub_position").notNull(),
  currentCouncilOffice: councilOfficeEnum("current_council_office"),
  photoUrl: text("photo_url"),
  duesProofUrl: text("dues_proof_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  paidThrough: text("paid_through"),
  role: userRoleEnum("role").default("member"),
  status: memberStatusEnum("status").default("pending"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").references(() => members.id),
  badgeName: text("badge_name").notNull(),
  badgeCode: text("badge_code").notNull(),
  description: text("description"),
  awardedBy: uuid("awarded_by").references(() => members.id),
  awardedAt: timestamp("awarded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hallOfFame = pgTable("hall_of_fame", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").references(() => members.id),
  achievementTitle: text("achievement_title").notNull(),
  achievementDescription: text("achievement_description"),
  achievementDate: text("achievement_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const news = pgTable("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => members.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumThreads = pgTable("forum_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").references(() => members.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id").references(() => forumThreads.id),
  authorId: uuid("author_id").references(() => members.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobPosts = pgTable("job_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  postedBy: uuid("posted_by").references(() => members.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  salaryRange: text("salary_range"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobPosts.id),
  applicantId: uuid("applicant_id").references(() => members.id),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"),
  appliedAt: timestamp("applied_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id").references(() => members.id),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: text("location"),
  maxAttendees: integer("max_attendees"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id),
  memberId: uuid("member_id").references(() => members.id),
  rsvpStatus: text("rsvp_status").default("pending"),
  registeredAt: timestamp("registered_at").defaultNow(),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mentorshipRequests = pgTable("mentorship_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  menteeId: uuid("mentee_id").references(() => members.id),
  mentorId: uuid("mentor_id").references(() => members.id),
  requestMessage: text("request_message").notNull(),
  status: mentorshipStatusEnum("status").default("pending"),
  matchedAt: timestamp("matched_at"),
  completedAt: timestamp("completed_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").references(() => members.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("general"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHallOfFameSchema = createInsertSchema(hallOfFame).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  updatedAt: true,
});

export const insertForumThreadSchema = createInsertSchema(forumThreads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobPostSchema = createInsertSchema(jobPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMentorshipRequestSchema = createInsertSchema(mentorshipRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertHallOfFame = z.infer<typeof insertHallOfFameSchema>;
export type HallOfFame = typeof hallOfFame.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreads.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

export type InsertJobPost = z.infer<typeof insertJobPostSchema>;
export type JobPost = typeof jobPosts.$inferSelect;

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

export type InsertMentorshipRequest = z.infer<typeof insertMentorshipRequestSchema>;
export type MentorshipRequest = typeof mentorshipRequests.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
