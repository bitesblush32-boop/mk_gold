import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/mkgold_dev';

// Disable prefetch for transactions (required for Vercel serverless)
// SSL required when connecting to Railway from external hosts (Vercel, local non-Railway)
const client = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes('railway') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(client, { schema });

export * from './schema';
