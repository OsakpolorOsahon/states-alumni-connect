import { z } from "zod";

// Simple schema for in-memory storage without database dependencies
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface Member {
  id: string;
  userId: string;
  fullName: string;
  nickname?: string | null;
  stateshipYear: string;
  lastMowcubPosition: string;
  currentCouncilOffice?: string | null;
  photoUrl?: string | null;
  duesProofUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  paidThrough?: string | null;
  role: "member" | "secretary";
  status: "pending" | "active" | "inactive";
  approvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  memberId: string;
  badgeName: string;
  badgeCode: string;
  description?: string | null;
  awardedBy?: string | null;
  awardedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HallOfFame {
  id: string;
  memberId: string;
  achievementTitle: string;
  achievementDescription?: string | null;
  achievementDate?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  updatedAt: Date;
}

export interface ForumThread {
  id: string;
  authorId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobPost {
  id: string;
  postedBy: string;
  title: string;
  description: string;
  company: string;
  location?: string | null;
  salaryRange?: string | null;
  isActive: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  status: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId?: string | null;
  requestMessage: string;
  status: "pending" | "active" | "completed";
  matchedAt?: Date | null;
  completedAt?: Date | null;
  respondedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  memberId: string;
  title: string;
  message: string;
  type: "general" | "approval" | "badge" | "hall_of_fame" | "job" | "mentorship";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description?: string | null;
  eventDate: Date;
  location?: string | null;
  maxAttendees?: number | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Insert types
export type InsertUser = Omit<User, "id">;
export type InsertMember = Omit<Member, "id" | "createdAt" | "updatedAt">;
export type InsertBadge = Omit<Badge, "id" | "createdAt" | "updatedAt">;
export type InsertHallOfFame = Omit<HallOfFame, "id" | "createdAt" | "updatedAt">;
export type InsertNews = Omit<News, "id" | "updatedAt">;
export type InsertForumThread = Omit<ForumThread, "id" | "createdAt" | "updatedAt">;
export type InsertForumReply = Omit<ForumReply, "id" | "createdAt" | "updatedAt">;
export type InsertJobPost = Omit<JobPost, "id" | "createdAt" | "updatedAt">;
export type InsertJobApplication = Omit<JobApplication, "id" | "createdAt" | "updatedAt" | "appliedAt">;
export type InsertMentorshipRequest = Omit<MentorshipRequest, "id" | "createdAt" | "updatedAt">;
export type InsertNotification = Omit<Notification, "id" | "createdAt" | "updatedAt">;
export type InsertEvent = Omit<Event, "id" | "createdAt" | "updatedAt">;

// Validation schemas
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email().optional()
});

export const insertMemberSchema = z.object({
  userId: z.string(),
  fullName: z.string().min(1),
  nickname: z.string().optional(),
  stateshipYear: z.string(),
  lastMowcubPosition: z.string(),
  currentCouncilOffice: z.string().optional(),
  photoUrl: z.string().optional(),
  duesProofUrl: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  paidThrough: z.string().optional(),
  role: z.enum(["member", "secretary"]).default("member"),
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
  approvedAt: z.date().optional()
});

export const insertBadgeSchema = z.object({
  memberId: z.string(),
  badgeName: z.string(),
  badgeCode: z.string(),
  description: z.string().optional(),
  awardedBy: z.string().optional(),
  awardedAt: z.date().optional()
});

export const insertHallOfFameSchema = z.object({
  memberId: z.string(),
  achievementTitle: z.string(),
  achievementDescription: z.string().optional(),
  achievementDate: z.string().optional()
});

export const insertNewsSchema = z.object({
  authorId: z.string(),
  title: z.string(),
  content: z.string(),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional()
});

export const insertForumThreadSchema = z.object({
  authorId: z.string(),
  title: z.string(),
  content: z.string(),
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false)
});

export const insertForumReplySchema = z.object({
  threadId: z.string(),
  authorId: z.string(),
  content: z.string()
});

export const insertJobPostSchema = z.object({
  postedBy: z.string(),
  title: z.string(),
  description: z.string(),
  company: z.string(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().optional()
});

export const insertJobApplicationSchema = z.object({
  jobId: z.string(),
  applicantId: z.string(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
  status: z.string().default("pending")
});

export const insertMentorshipRequestSchema = z.object({
  menteeId: z.string(),
  mentorId: z.string().optional(),
  requestMessage: z.string(),
  status: z.enum(["pending", "active", "completed"]).default("pending"),
  matchedAt: z.date().optional(),
  completedAt: z.date().optional(),
  respondedAt: z.date().optional()
});

export const insertNotificationSchema = z.object({
  memberId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(["general", "approval", "badge", "hall_of_fame", "job", "mentorship"]).default("general"),
  isRead: z.boolean().default(false)
});

export const insertEventSchema = z.object({
  organizerId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  eventDate: z.date(),
  location: z.string().optional(),
  maxAttendees: z.number().optional(),
  isPublic: z.boolean().default(true)
});