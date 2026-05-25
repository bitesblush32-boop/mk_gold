import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
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

  const { rate_24k, rate_22k } = body as Record<string, unknown>;

  if (!rate_24k || !rate_22k) {
    return NextResponse.json(
      { error: 'rate_24k, rate_22k are required' },
      { status: 400 },
    );
  }

  try {
    const row = await setGoldRateOverride({
      rate_24k: String(rate_24k),
      rate_22k: String(rate_22k),
    });
    revalidateTag('gold-rate', { expire: 0 });        // invalidates unstable_cache instantly
    revalidatePath('/gold-rate-today');
    revalidatePath('/');
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
    revalidateTag('gold-rate', { expire: 0 });
    revalidatePath('/gold-rate-today');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/gold-rate] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
