import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/db';
import { leads, appointments, goldRateOverride } from '@/db/schema';
import { eq, gte, desc, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const todayStr = new Date().toISOString().slice(0, 10);

  try {
    const [leadsResult] = await db.select({ count: count() }).from(leads);
    const totalLeads = Number(leadsResult?.count ?? 0);

    const todayAppts = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.slot_date, todayStr));
    const appointmentsToday = Number(todayAppts[0]?.count ?? 0);

    const [override] = await db
      .select()
      .from(goldRateOverride)
      .orderBy(desc(goldRateOverride.updated_at))
      .limit(1);

    const now = new Date();
    const isManual =
      override?.is_manual &&
      (!override.override_until || new Date(override.override_until) > now);

    return NextResponse.json({
      totalLeads,
      appointmentsToday,
      goldRate: isManual
        ? {
            status:   'manual',
            rate24k:  override.rate_24k,
            expiresAt: override.override_until,
            updatedAt: override.updated_at,
          }
        : { status: 'live', updatedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error('[api/admin/stats] error:', err);
    return NextResponse.json({
      totalLeads:        0,
      appointmentsToday: 0,
      goldRate:          { status: 'live', updatedAt: new Date().toISOString() },
    });
  }
}
