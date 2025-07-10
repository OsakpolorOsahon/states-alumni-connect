import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";
import { insertMemberSchema, insertBadgeSchema, insertHallOfFameSchema, insertNewsSchema, insertForumThreadSchema, insertForumReplySchema, insertJobPostSchema, insertJobApplicationSchema, insertMentorshipRequestSchema, insertNotificationSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { sendApprovalEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Member routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/members/active", async (req, res) => {
    try {
      const members = await storage.getActiveMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/members/pending", async (req, res) => {
    try {
      const members = await storage.getPendingMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.partial().parse(req.body);
      const originalMember = await storage.getMember(req.params.id);
      const member = await storage.updateMember(req.params.id, validatedData);
      
      // Send email notification if status changed to approved or rejected
      if (originalMember && originalMember.status !== member.status && 
          (member.status === 'active' || member.status === 'inactive')) {
        const approved = member.status === 'active';
        try {
          await sendApprovalEmail(
            member.email || '', 
            member.full_name, 
            approved
          );
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
          // Don't fail the request if email fails
        }
      }
      
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Badge routes
  app.get("/api/badges/member/:memberId", async (req, res) => {
    try {
      const badges = await storage.getBadgesByMemberId(req.params.memberId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/badges", async (req, res) => {
    try {
      const validatedData = insertBadgeSchema.parse(req.body);
      const badge = await storage.createBadge(validatedData);
      res.status(201).json(badge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/badges/:id", async (req, res) => {
    try {
      await storage.deleteBadge(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hall of Fame routes
  app.get("/api/hall-of-fame", async (req, res) => {
    try {
      const entries = await storage.getAllHallOfFame();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hall-of-fame", async (req, res) => {
    try {
      const { memberId, achievementTitle, achievementDescription, achievementDate } = req.body;
      
      if (!memberId || !achievementTitle) {
        return res.status(400).json({ error: 'Member ID and achievement title are required' });
      }

      const entry = await storage.createHallOfFameEntry({
        memberId,
        achievementTitle,
        achievementDescription,
        achievementDate
      });

      // Get member info for notification
      const member = await storage.getMember(memberId);
      
      // Create notification
      if (member) {
        await storage.createNotification({
          memberId: memberId,
          title: 'Hall of Fame Recognition!',
          message: `Congratulations! You've been inducted into the Hall of Fame for "${achievementTitle}".`,
          type: 'hall_of_fame'
        });
      }

      res.status(201).json({ 
        success: true, 
        message: 'Hall of Fame entry added successfully',
        entry
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/hall-of-fame/:id", async (req, res) => {
    try {
      await storage.deleteHallOfFameEntry(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news/published", async (req, res) => {
    try {
      const news = await storage.getPublishedNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ error: "News item not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/news/:id", async (req, res) => {
    try {
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(req.params.id, validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Forum routes
  app.get("/api/forum/threads", async (req, res) => {
    try {
      const threads = await storage.getAllForumThreads();
      res.json(threads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/forum/threads/:id", async (req, res) => {
    try {
      const thread = await storage.getForumThreadById(req.params.id);
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forum/threads", async (req, res) => {
    try {
      const validatedData = insertForumThreadSchema.parse(req.body);
      const thread = await storage.createForumThread(validatedData);
      res.status(201).json(thread);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/forum/threads/:id", async (req, res) => {
    try {
      const validatedData = insertForumThreadSchema.partial().parse(req.body);
      const thread = await storage.updateForumThread(req.params.id, validatedData);
      res.json(thread);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/forum/threads/:id", async (req, res) => {
    try {
      await storage.deleteForumThread(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/forum/threads/:threadId/replies", async (req, res) => {
    try {
      const replies = await storage.getForumRepliesByThreadId(req.params.threadId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forum/replies", async (req, res) => {
    try {
      const validatedData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/forum/replies/:id", async (req, res) => {
    try {
      await storage.deleteForumReply(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobPosts();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jobs/active", async (req, res) => {
    try {
      const jobs = await storage.getActiveJobPosts();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobPostById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobPostSchema.parse(req.body);
      const job = await storage.createJobPost(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const validatedData = insertJobPostSchema.partial().parse(req.body);
      const job = await storage.updateJobPost(req.params.id, validatedData);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      await storage.deleteJobPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jobs/:jobId/applications", async (req, res) => {
    try {
      const applications = await storage.getJobApplicationsByJobId(req.params.jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/job-applications", async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/job-applications/:id", async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.partial().parse(req.body);
      const application = await storage.updateJobApplication(req.params.id, validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Mentorship routes
  app.get("/api/mentorship/requests", async (req, res) => {
    try {
      const requests = await storage.getAllMentorshipRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mentorship/requests/mentee/:menteeId", async (req, res) => {
    try {
      const requests = await storage.getMentorshipRequestsByMenteeId(req.params.menteeId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mentorship/requests/mentor/:mentorId", async (req, res) => {
    try {
      const requests = await storage.getMentorshipRequestsByMentorId(req.params.mentorId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mentorship/requests", async (req, res) => {
    try {
      const validatedData = insertMentorshipRequestSchema.parse(req.body);
      const request = await storage.createMentorshipRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/mentorship/requests/:id", async (req, res) => {
    try {
      const validatedData = insertMentorshipRequestSchema.partial().parse(req.body);
      const request = await storage.updateMentorshipRequest(req.params.id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/mentorship/requests/:id", async (req, res) => {
    try {
      await storage.deleteMentorshipRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications/member/:memberId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByMemberId(req.params.memberId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/notifications/member/:memberId/unread", async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotificationsByMemberId(req.params.memberId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/member/:memberId/read-all", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.params.memberId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/forum/replies", async (req, res) => {
    try {
      const validatedData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(validatedData);
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/forum/replies/:id", async (req, res) => {
    try {
      await storage.deleteForumReply(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobPosts();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jobs/active", async (req, res) => {
    try {
      const jobs = await storage.getActiveJobPosts();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobPostById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobPostSchema.parse(req.body);
      const job = await storage.createJobPost(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const validatedData = insertJobPostSchema.partial().parse(req.body);
      const job = await storage.updateJobPost(req.params.id, validatedData);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      await storage.deleteJobPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Job application routes
  app.get("/api/job-applications/job/:jobId", async (req, res) => {
    try {
      const applications = await storage.getJobApplicationsByJobId(req.params.jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/job-applications/applicant/:applicantId", async (req, res) => {
    try {
      const applications = await storage.getJobApplicationsByApplicantId(req.params.applicantId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/job-applications", async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/job-applications/:id", async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.partial().parse(req.body);
      const application = await storage.updateJobApplication(req.params.id, validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Mentorship routes
  app.get("/api/mentorship", async (req, res) => {
    try {
      const requests = await storage.getAllMentorshipRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mentorship/mentee/:menteeId", async (req, res) => {
    try {
      const requests = await storage.getMentorshipRequestsByMenteeId(req.params.menteeId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mentorship/mentor/:mentorId", async (req, res) => {
    try {
      const requests = await storage.getMentorshipRequestsByMentorId(req.params.mentorId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mentorship", async (req, res) => {
    try {
      const validatedData = insertMentorshipRequestSchema.parse(req.body);
      const request = await storage.createMentorshipRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/mentorship/:id", async (req, res) => {
    try {
      const validatedData = insertMentorshipRequestSchema.partial().parse(req.body);
      const request = await storage.updateMentorshipRequest(req.params.id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/mentorship/:id", async (req, res) => {
    try {
      await storage.deleteMentorshipRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications/:memberId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByMemberId(req.params.memberId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/notifications/:memberId/unread", async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotificationsByMemberId(req.params.memberId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/notifications/:memberId/read-all", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.params.memberId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validatedData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Statistics endpoints
  app.get("/api/stats/overview", async (req, res) => {
    try {
      const [
        totalMembers,
        activeMembers,
        pendingMembers,
        hallOfFameEntries,
        newsArticles,
        forumThreads,
        jobPosts,
        events
      ] = await Promise.all([
        storage.getAllMembers(),
        storage.getActiveMembers(),
        storage.getPendingMembers(),
        storage.getAllHallOfFame(),
        storage.getAllNews(),
        storage.getAllForumThreads(),
        storage.getAllJobPosts(),
        storage.getAllEvents()
      ]);

      const stats = {
        totalMembers: totalMembers.length,
        activeMembers: activeMembers.length,
        pendingMembers: pendingMembers.length,
        hallOfFameCount: hallOfFameEntries.length,
        newsCount: newsArticles.length,
        forumThreadsCount: forumThreads.length,
        jobPostsCount: jobPosts.length,
        eventsCount: events.length,
        recentMembers: activeMembers.filter(m => {
          const joinDate = new Date(m.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return joinDate > thirtyDaysAgo;
        }).length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // UploadThing routes
  const uploadthingHandler = createRouteHandler({
    router: uploadRouter,
  });
  
  app.all("/api/uploadthing", uploadthingHandler);

  const httpServer = createServer(app);

  return httpServer;
}
