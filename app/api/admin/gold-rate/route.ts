import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getGoldRateOverride,
  setGoldRateOverride,
  clearGoldRateOverride,
} from '@/lib/db/rates';

/* ─── GET — current override ─────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  try {
    const override = await getGoldRateOverride();
    return NextResponse.json({ override: override ?? null });
  } catch (err) {
    console.error('[api/admin/gold-rate] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── POST — set override ────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { rate_24k, rate_22k, rate_20k, rate_18k, hours = 24 } = body as Record<string, unknown>;

  if (!rate_24k || !rate_22k || !rate_20k || !rate_18k) {
    return NextResponse.json(
      { error: 'rate_24k, rate_22k, rate_20k, rate_18k are required' },
      { status: 400 },
    );
  }

  const overrideUntil = new Date(Date.now() + Number(hours) * 3_600_000);

  try {
    const row = await setGoldRateOverride({
      rate_24k:       String(rate_24k),
      rate_22k:       String(rate_22k),
      rate_20k:       String(rate_20k),
      rate_18k:       String(rate_18k),
      override_until: overrideUntil,
    });
    return NextResponse.json({ success: true, override: row });
  } catch (err) {
    console.error('[api/admin/gold-rate] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── DELETE — clear override ────────────────────────────────────── */

export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  try {
    await clearGoldRateOverride();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/gold-rate] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
