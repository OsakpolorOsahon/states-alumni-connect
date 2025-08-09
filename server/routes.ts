import type { Express, Request, Response } from "express";

// Note: Authentication is handled by Supabase on the frontend
// This Express server only serves static files and Vite dev server

export function registerRoutes(app: Express): void {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Configuration endpoint for client to get environment variables
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    });
  });
  
  // Note: All other API routes are handled by Supabase
  // Member authentication, data management, and real-time features
  // are managed through the Supabase client on the frontend
}