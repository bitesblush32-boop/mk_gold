import { db, leads } from '@/db';
import { eq, desc } from 'drizzle-orm';
import type { NewLead } from '@/db/schema';

export type { Lead } from '@/db/schema';

/* ─── Create ─────────────────────────────────────────────────────── */

export async function createLead(data: NewLead) {
  const [row] = await db.insert(leads).values(data).returning();
  return row;
}

/* ─── Read ───────────────────────────────────────────────────────── */

export async function getLeadsByBranch(branchSlug: string) {
  return db
    .select()
    .from(leads)
    .where(eq(leads.branch_slug, branchSlug))
    .orderBy(desc(leads.created_at));
}

export async function getAllLeads() {
  return db.select().from(leads).orderBy(desc(leads.created_at));
}

export async function getLeadById(id: number) {
  const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return row ?? null;
}

/* ─── Update ─────────────────────────────────────────────────────── */

export async function updateLeadStatus(
  id: number,
  status: 'new' | 'contacted' | 'visited' | 'converted' | 'lost',
  notes?: string,
) {
  const [row] = await db
    .update(leads)
    .set({ status, ...(notes !== undefined ? { notes } : {}), updated_at: new Date() })
    .where(eq(leads.id, id))
    .returning();
  return row;
}

export async function updateLeadRemarks(id: number, notes: string) {
  const [row] = await db
    .update(leads)
    .set({ notes, updated_at: new Date() })
    .where(eq(leads.id, id))
    .returning();
  return row;
}

/* ─── Delete ─────────────────────────────────────────────────────── */

export async function deleteLead(id: number) {
  await db.delete(leads).where(eq(leads.id, id));
}
