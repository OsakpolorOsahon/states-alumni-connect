import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Allow the app to work without a database in development
let db: any;
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  // Log that we're using in-memory storage instead
  console.log("⚠️  DATABASE_URL not found - using in-memory storage for development");
  db = null; // Will be handled by MemoryStorage in storage.ts
}

export { pool, db };
