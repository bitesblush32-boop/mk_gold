import { NextRequest, NextResponse } from 'next/server';
import { createAppointment, getSlotBookings } from '@/lib/db/appointments';
import { getBranchBySlug } from '@/lib/branch-router';
import { sendWhatsApp } from '@/lib/whatsapp';

/* ─── Config ─────────────────────────────────────────────────────── */

const MAX_PER_SLOT = 4;

const ALL_SLOTS = [
  '9:30 AM',  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM',  '1:30 PM',  '2:00 PM',
  '2:30 PM',  '3:00 PM',  '3:30 PM',  '4:00 PM',  '4:30 PM',
  '5:00 PM',  '5:30 PM',  '6:00 PM',  '6:30 PM',
];

function makeCode(): string {
  return `MK${Math.floor(100000 + Math.random() * 900000)}`;
}

/* ─── POST /api/appointments ─────────────────────────────────────── */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, phone, branch_slug, slot_date, slot_time, gold_type, weight_estimate, notes } =
    body as Record<string, string | undefined>;

  if (!name || !phone || !branch_slug || !slot_date || !slot_time) {
    return NextResponse.json(
      { error: 'name, phone, branch_slug, slot_date, slot_time are required' },
      { status: 400 },
    );
  }

  if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    return NextResponse.json(
      { error: 'Enter a valid 10-digit Indian mobile number' },
      { status: 400 },
    );
  }

  // Validate date not in the past
  const today = new Date().toISOString().slice(0, 10);
  if (slot_date < today) {
    return NextResponse.json({ error: 'slot_date cannot be in the past' }, { status: 400 });
  }

  try {
    // Check slot availability
    const existing = await getSlotBookings(branch_slug, slot_date);
    const slotCount = existing.filter(
      a => a.slot_time === slot_time && a.status !== 'cancelled',
    ).length;

    if (slotCount >= MAX_PER_SLOT) {
      // Build suggestion list: slots with < MAX_PER_SLOT bookings
      const bookedMap: Record<string, number> = {};
      for (const appt of existing) {
        if (appt.status !== 'cancelled') {
          bookedMap[appt.slot_time] = (bookedMap[appt.slot_time] ?? 0) + 1;
        }
      }
      const suggestNext = ALL_SLOTS.filter(s => (bookedMap[s] ?? 0) < MAX_PER_SLOT).slice(0, 5);

      return NextResponse.json(
        { error: 'Slot full. Please choose another time.', suggestNext },
        { status: 409 },
      );
    }

    const confirmationCode = makeCode();
    const appt = await createAppointment({
      name,
      phone:           phone.replace(/\s/g, ''),
      branch_slug,
      slot_date,
      slot_time,
      gold_type:       gold_type ?? undefined,
      weight_estimate: weight_estimate ?? undefined,
      notes:           notes ?? undefined,
      status:          'pending',
      confirmation_code: confirmationCode,
    });

    // Notify customer and branch (non-blocking)
    const branch = getBranchBySlug(branch_slug);
    const customerMsg = `MK Gold appointment confirmed!\nDate: ${slot_date} at ${slot_time}\nBranch: ${branch?.name ?? branch_slug}\nAddress: ${branch?.address ?? ''}\nRef: ${confirmationCode}`;
    const branchMsg   = `New appointment:\nName: ${name} | Phone: ${phone}\nDate: ${slot_date} at ${slot_time}${gold_type ? `\nGold: ${gold_type}` : ''}\nRef: ${confirmationCode}`;

    sendWhatsApp(phone, customerMsg).catch(() => {});
    if (branch) sendWhatsApp(branch.whatsapp, branchMsg).catch(() => {});

    return NextResponse.json(
      { success: true, id: appt.id, confirmationCode },
      { status: 201 },
    );
  } catch (err) {
    console.error('[api/appointments] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── GET /api/appointments?branch=X&date=Y ──────────────────────── */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get('branch');
  const date   = searchParams.get('date');

  if (!branch || !date) {
    return NextResponse.json(
      { error: 'branch and date query params are required' },
      { status: 400 },
    );
  }

  try {
    const existing = await getSlotBookings(branch, date);

    // Count bookings per slot (excluding cancelled)
    const bookedMap: Record<string, number> = {};
    for (const appt of existing) {
      if (appt.status !== 'cancelled') {
        bookedMap[appt.slot_time] = (bookedMap[appt.slot_time] ?? 0) + 1;
      }
    }

    const slots = ALL_SLOTS.map(time => ({
      time,
      booked:    bookedMap[time] ?? 0,
      available: (bookedMap[time] ?? 0) < MAX_PER_SLOT,
    }));

    return NextResponse.json({ slots });
  } catch (err) {
    console.error('[api/appointments] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
