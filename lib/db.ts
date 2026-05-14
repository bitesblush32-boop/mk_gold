/**
 * Backward-compatibility shim.
 * Legacy code that imports { sql } from '@/lib/db' keeps working.
 * New code should import from '@/db' (Drizzle) or '@/lib/db/*' (domain helpers).
 */
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/mkgold_dev';

// Raw SQL client — used by API routes that predate Drizzle migration
export const sql = postgres(connectionString, { prepare: false });

// Re-export Drizzle db instance for convenience
export { db } from '@/db';

// ─── Legacy type exports (keep API routes compiling without changes) ──

export interface Lead {
  id?: number;
  name: string;
  phone: string;
  area?: string;
  branch_slug?: string;
  gold_type?: string;
  weight_grams?: number;
  purity_karat?: number;
  estimated_value?: number;
  source: 'website' | 'whatsapp' | 'call' | 'walkin';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  created_at?: string;
}

export interface Appointment {
  id?: number;
  lead_id?: number;
  name: string;
  phone: string;
  branch_slug: string;
  slot_date: string;
  slot_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
}
