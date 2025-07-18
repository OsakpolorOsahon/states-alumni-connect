import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("⚠️  Supabase configuration not found - using in-memory storage for development");
}

// Create Supabase client for authentication and real-time features
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Create admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

// Database connection for Drizzle ORM
let db: any;
let pool: any = null;

if (process.env.DATABASE_URL) {
  pool = postgres(process.env.DATABASE_URL);
  db = drizzle(pool, { schema });
} else {
  console.log("⚠️  DATABASE_URL not found - using in-memory storage for development");
  db = null; // Will be handled by MemoryStorage in storage.ts
}

export { pool, db };
