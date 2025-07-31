import type { Express, Request, Response } from "express";

// Note: Authentication is handled by Supabase on the frontend
// This Express server only serves static files and Vite dev server

export function registerRoutes(app: Express): void {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // Note: All other API routes are handled by Supabase
  // Member authentication, data management, and real-time features
  // are managed through the Supabase client on the frontend
}