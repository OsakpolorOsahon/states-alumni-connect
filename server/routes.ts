import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase, supabaseAdmin } from "./db";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";
import { insertMemberSchema, insertBadgeSchema, insertHallOfFameSchema, insertNewsSchema, insertForumThreadSchema, insertForumReplySchema, insertJobPostSchema, insertJobApplicationSchema, insertMentorshipRequestSchema, insertNotificationSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { sendApprovalEmail } from "./email";

// Authentication middleware using Supabase
async function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Get member data
  const member = await storage.getMemberByUserId(user.id);
  req.user = user;
  req.member = member;
  next();
}

// Secretary middleware
async function requireSecretary(req: any, res: any, next: any) {
  await requireAuth(req, res, () => {
    if (!req.member || req.member.role !== 'secretary') {
      return res.status(403).json({ error: "Secretary access required" });
    }
    next();
  });
}

// Active member middleware
async function requireActiveMember(req: any, res: any, next: any) {
  await requireAuth(req, res, () => {
    if (!req.member || req.member.status !== 'active') {
      return res.status(403).json({ error: "Active member access required" });
    }
    next();
  });
}

// *** IMPORTANT CHANGE HERE: Changed return type to Promise<void> ***
export async function registerRoutes(app: Express): Promise<void> {
  // Authentication routes using Supabase Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, ...memberData } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });

      if (authError) {
        console.error("Supabase auth error:", authError);
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        return res.status(400).json({ error: "Failed to create user" });
      }

      // Create member record
      const member = await storage.createMember({
        userId: authData.user.id,
        fullName: memberData.fullName,
        nickname: memberData.nickname,
        stateshipYear: memberData.stateshipYear,
        lastMowcubPosition: memberData.lastMowcubPosition,
        currentCouncilOffice: memberData.currentCouncilOffice,
        latitude: memberData.latitude,
        longitude: memberData.longitude,
        status: 'pending',
        role: 'member',
        photoUrl: memberData.photoUrl,
        duesProofUrl: memberData.duesProofUrl
      });

      res.status(201).json({
        user: { id: authData.user.id, email: authData.user.email },
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

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError || !authData.user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get member data
      const member = await storage.getMemberByUserId(authData.user.id);

      res.json({
        user: { id: authData.user.id, email: authData.user.email },
        session: authData.session,
        member,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        await supabaseAdmin.auth.admin.signOut(token);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      // Refresh member data
      const member = await storage.getMemberByUserId(req.user.id);

      res.json({
        user: req.user,
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
        new Date(member.createdAt || 0) >= thirtyDaysAgo
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