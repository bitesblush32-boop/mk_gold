import { db, appointments } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
import type { NewAppointment } from '@/db/schema';

export type { Appointment } from '@/db/schema';

/* ─── Create ─────────────────────────────────────────────────────── */

export async function createAppointment(data: NewAppointment) {
  const [row] = await db.insert(appointments).values(data).returning();
  return row;
}

/* ─── Read ───────────────────────────────────────────────────────── */

export async function getSlotBookings(branchSlug: string, slotDate: string) {
  return db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.branch_slug, branchSlug),
        eq(appointments.slot_date, slotDate),
      ),
    );
}

export async function getAllAppointments() {
  return db.select().from(appointments).orderBy(desc(appointments.created_at));
}

export async function getAppointmentByCode(confirmationCode: string) {
  const [row] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.confirmation_code, confirmationCode))
    .limit(1);
  return row ?? null;
}

/* ─── Update ─────────────────────────────────────────────────────── */

export async function updateAppointmentStatus(
  id: number,
  status: 'pending' | 'confirmed' | 'visited' | 'no_show' | 'cancelled',
) {
  const [row] = await db
    .update(appointments)
    .set({ status, updated_at: new Date() })
    .where(eq(appointments.id, id))
    .returning();
  return row;
}
