import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { insertMemberSchema, insertBadgeSchema, insertHallOfFameSchema, insertNewsSchema, insertForumThreadSchema, insertForumReplySchema, insertJobPostSchema, insertJobApplicationSchema, insertMentorshipRequestSchema, insertNotificationSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreConstructor = MemoryStore(session);

// Session configuration
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    memberData?: any;
  }
}

// Authentication middleware
async function requireAuth(req: Request, res: Response, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Get member data
  const member = await storage.getMemberByUserId(req.session.userId.toString());
  (req as any).member = member;
  (req as any).userId = req.session.userId;
  next();
}

// Secretary middleware
async function requireSecretary(req: Request, res: Response, next: any) {
  await requireAuth(req, res, () => {
    const member = (req as any).member;
    if (!member || member.role !== 'secretary') {
      return res.status(403).json({ error: "Secretary access required" });
    }
    next();
  });
}

// Active member middleware
async function requireActiveMember(req: Request, res: Response, next: any) {
  await requireAuth(req, res, () => {
    const member = (req as any).member;
    if (!member || member.status !== 'active') {
      return res.status(403).json({ error: "Active member access required" });
    }
    next();
  });
}

export function registerRoutes(app: Express): void {
  // Session middleware
  app.use(session({
    store: new MemoryStoreConstructor({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'smmowcub-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, ...memberData } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      if (!memberData.fullName) {
        return res.status(400).json({ error: "Full name is required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username: email,
        email: email,
        password: hashedPassword
      });

      // Create member record
      const member = await storage.createMember({
        userId: user.id.toString(),
        fullName: memberData.fullName,
        nickname: memberData.nickname || null,
        stateshipYear: memberData.stateshipYear || '2024',
        lastMowcubPosition: memberData.lastMowcubPosition || 'None',
        currentCouncilOffice: memberData.currentCouncilOffice || null,
        latitude: memberData.latitude || null,
        longitude: memberData.longitude || null,
        status: 'pending',
        role: 'member',
        photoUrl: memberData.photoUrl || null,
        duesProofUrl: memberData.duesProofUrl || null,
        paidThrough: null,
        approvedAt: null
      });

      res.status(201).json({
        user: { id: user.id, email: user.email },
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

      // Validate user
      const user = await storage.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get member data
      const member = await storage.getMemberByUserId(user.id.toString());

      // Set session
      req.session.userId = user.id;
      req.session.memberData = member;

      res.json({
        user: { id: user.id, email: user.email },
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
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const member = (req as any).member;
    const userId = (req as any).userId;
    
    res.json({
      user: { id: userId },
      member
    });
  });

  // Member routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      console.error("Get members error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/active", async (req, res) => {
    try {
      const members = await storage.getActiveMembers();
      res.json(members);
    } catch (error) {
      console.error("Get active members error:", error);
      res.status(500).json({ error: "Failed to fetch active members" });
    }
  });

  app.get("/api/members/pending", requireSecretary, async (req, res) => {
    try {
      const members = await storage.getPendingMembers();
      res.json(members);
    } catch (error) {
      console.error("Get pending members error:", error);
      res.status(500).json({ error: "Failed to fetch pending members" });
    }
  });

  app.patch("/api/members/:id/approve", requireSecretary, async (req, res) => {
    try {
      const { id } = req.params;
      const member = await storage.updateMember(id, {
        status: 'active',
        approvedAt: new Date()
      });

      res.json({ member, message: "Member approved" });
    } catch (error) {
      console.error("Approve member error:", error);
      res.status(500).json({ error: "Failed to approve member" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getPublishedNews();
      res.json(news);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news", requireSecretary, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse({
        ...req.body,
        authorId: (req as any).member.id
      });

      const news = await storage.createNews(newsData);
      res.status(201).json(news);
    } catch (error) {
      console.error("Create news error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create news" });
    }
  });

  // Forum routes
  app.get("/api/forum/threads", requireActiveMember, async (req, res) => {
    try {
      const threads = await storage.getAllForumThreads();
      res.json(threads);
    } catch (error) {
      console.error("Get forum threads error:", error);
      res.status(500).json({ error: "Failed to fetch forum threads" });
    }
  });

  app.post("/api/forum/threads", requireActiveMember, async (req, res) => {
    try {
      const threadData = insertForumThreadSchema.parse({
        ...req.body,
        authorId: (req as any).member.id
      });

      const thread = await storage.createForumThread(threadData);
      res.status(201).json(thread);
    } catch (error) {
      console.error("Create forum thread error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid thread data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create thread" });
    }
  });

  app.get("/api/forum/threads/:id/replies", requireActiveMember, async (req, res) => {
    try {
      const { id } = req.params;
      const replies = await storage.getForumRepliesByThreadId(id);
      res.json(replies);
    } catch (error) {
      console.error("Get forum replies error:", error);
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  app.post("/api/forum/threads/:id/replies", requireActiveMember, async (req, res) => {
    try {
      const { id } = req.params;
      const replyData = insertForumReplySchema.parse({
        ...req.body,
        threadId: id,
        authorId: (req as any).member.id
      });

      const reply = await storage.createForumReply(replyData);
      res.status(201).json(reply);
    } catch (error) {
      console.error("Create forum reply error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid reply data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reply" });
    }
  });

  // Job routes
  app.get("/api/jobs", requireActiveMember, async (req, res) => {
    try {
      const jobs = await storage.getActiveJobPosts();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs", requireActiveMember, async (req, res) => {
    try {
      const jobData = insertJobPostSchema.parse({
        ...req.body,
        postedBy: (req as any).member.id
      });

      const job = await storage.createJobPost(jobData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Create job error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid job data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // Mentorship routes
  app.get("/api/mentorship", requireActiveMember, async (req, res) => {
    try {
      const requests = await storage.getAllMentorshipRequests();
      res.json(requests);
    } catch (error) {
      console.error("Get mentorship requests error:", error);
      res.status(500).json({ error: "Failed to fetch mentorship requests" });
    }
  });

  app.post("/api/mentorship", requireActiveMember, async (req, res) => {
    try {
      const requestData = insertMentorshipRequestSchema.parse({
        ...req.body,
        menteeId: (req as any).member.id
      });

      const request = await storage.createMentorshipRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Create mentorship request error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create mentorship request" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const [totalMembers, activeMembers, pendingMembers, totalNews] = await Promise.all([
        storage.getAllMembers(),
        storage.getActiveMembers(),
        storage.getPendingMembers(),
        storage.getAllNews()
      ]);

      res.json({
        totalMembers: totalMembers.length,
        activeMembers: activeMembers.length,
        pendingMembers: pendingMembers.length,
        totalNews: totalNews.length
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });
}