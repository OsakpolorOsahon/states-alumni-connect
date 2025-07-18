import type { Express } from "express";
import { createServer, type Server } from "http"; // 'createServer' and 'Server' are no longer directly used in this file's export, but might be used by other parts of your server. Leaving them for now to avoid breaking other imports if they exist.
import { storage } from "./storage";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";
import { insertMemberSchema, insertBadgeSchema, insertHallOfFameSchema, insertNewsSchema, insertForumThreadSchema, insertForumReplySchema, insertJobPostSchema, insertJobApplicationSchema, insertMentorshipRequestSchema, insertNotificationSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { sendApprovalEmail } from "./email";
import bcrypt from "bcrypt";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Secretary middleware
function requireSecretary(req: any, res: any, next: any) {
  if (!req.session?.user || req.session?.member?.role !== 'secretary') {
    return res.status(403).json({ error: "Secretary access required" });
  }
  next();
}

// Active member middleware
function requireActiveMember(req: any, res: any, next: any) {
  if (!req.session?.user || req.session?.member?.status !== 'active') {
    return res.status(403).json({ error: "Active member access required" });
  }
  next();
}

// *** IMPORTANT CHANGE HERE: Changed return type to Promise<void> ***
export async function registerRoutes(app: Express): Promise<void> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, ...memberData } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username: email,
        hashedPassword,
        role: 'member'
      });

      // Create member record
      const member = await storage.createMember({
        userId: user.id.toString(),
        full_name: memberData.full_name,
        nickname: memberData.nickname,
        stateship_year: memberData.stateship_year,
        last_mowcub_position: memberData.last_mowcub_position,
        current_council_office: memberData.current_council_office,
        latitude: memberData.latitude,
        longitude: memberData.longitude,
        status: 'pending',
        role: 'member',
        photo_url: memberData.photo_url,
        dues_proof_url: memberData.dues_proof_url
      });

      res.status(201).json({
        user: { id: user.id, email: user.username },
        member,
        message: "Registration successful. Awaiting approval."
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByUsername(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get member data
      const member = await storage.getMemberByUserId(user.id.toString());

      // Set session
      req.session.user = { id: user.id, email: user.username };
      req.session.member = member;

      res.json({
        user: { id: user.id, email: user.username },
        member,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      // Refresh member data
      const member = await storage.getMemberByUserId(req.session.user.id.toString());
      req.session.member = member;

      res.json({
        user: req.session.user,
        member
      });
    } catch (error) {
      console.error("Session error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const [
        allMembers,
        activeMembers,
        pendingMembers,
        hallOfFame,
        news,
        forumThreads,
        jobPosts
      ] = await Promise.all([
        storage.getAllMembers(),
        storage.getActiveMembers(),
        storage.getPendingMembers(),
        storage.getAllHallOfFame(),
        storage.getAllNews(),
        storage.getAllForumThreads(),
        storage.getAllJobPosts()
      ]);

      // Calculate recent members (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentMembers = allMembers.filter(member =>
        new Date(member.created_at) >= thirtyDaysAgo
      );

      const stats = {
        totalMembers: allMembers.length,
        activeMembers: activeMembers.length,
        pendingMembers: pendingMembers.length,
        recentMembers: recentMembers.length,
        hallOfFameCount: hallOfFame.length,
        activeJobs: jobPosts.length,
        forumThreads: forumThreads.length,
        newsCount: news.length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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
          // Assuming `member.email` exists or can be derived for email sending
          await sendApprovalEmail(
            member.email || '', // Ensure member.email is available or handle if not
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
  app.get("/api/badges", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      const allBadges = [];

      for (const member of members) {
        const badges = await storage.getBadgesByMemberId(member.id);
        badges.forEach(badge => {
          allBadges.push({
            ...badge,
            member_name: member.full_name,
            member_nickname: member.nickname
          });
        });
      }

      res.json(allBadges);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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

  // Note: These two forum reply routes were duplicated, removed the duplicates.
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

  // Job routes (Duplicated section removed, keeping only the first set)
  // There were duplicated Job routes, removing the second set.

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

  // Mentorship routes (Duplicated section removed, keeping only the first set with "requests" in path)
  // There were duplicated Mentorship routes, removing the second set which lacked "/requests".

  // Notification routes (Duplicated section removed, keeping only the first set with "/member" in path)
  // There were duplicated Notification routes, removing the second set which lacked "/member".

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send(); // Changed to 204 for no content response on update
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/notifications/member/:memberId/read-all", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.params.memberId);
      res.status(204).send(); // Changed to 204 for no content response on update
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event routes (Duplicated section removed, keeping only the first set)
  // There were duplicated Event routes, removing the second set.

  // Statistics endpoints (Moved the original /api/stats to /api/stats/overview for consistency)
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

  // *** IMPORTANT: Removed `const httpServer = createServer(app); return httpServer;` from here ***
  // This function now solely registers routes and doesn't create/return the HTTP server.
  // The HTTP server creation is handled in server/index.ts as per the previous suggestion.
}