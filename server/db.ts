import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("⚠️  Supabase configuration not found - please set up environment variables");
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

// Create Drizzle database connection using Supabase PostgreSQL connection
const connectionString = supabaseUrl?.replace('https://', 'postgres://postgres:')
  .replace('.supabase.co', '.supabase.co:5432/postgres') + `?sslmode=require`;

let db: ReturnType<typeof drizzle> | null = null;

try {
  if (supabaseUrl && supabaseServiceKey) {
    // Use the service key as password for direct postgres connection
    const client = postgres(connectionString.replace('postgres:', supabaseServiceKey + '@'), {
      ssl: { rejectUnauthorized: false }
    });
    db = drizzle(client);
  }
} catch (error) {
  console.log("⚠️  Drizzle database connection failed, using Supabase client instead");
}

export { db };