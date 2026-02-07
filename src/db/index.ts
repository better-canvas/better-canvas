import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables (for scripts like seed.ts)
// Next.js API routes load .env.local automatically, but scripts don't
if (typeof window === 'undefined' && !process.env.VERCEL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

// Disable prefetch for serverless
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Please check your .env.local file.'
  );
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
