import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';
import {
  getAllFaqsByPageAdmin,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from '@/lib/db/faqs';

const PAGE_PATHS: Record<string, string[]> = {
  general:       ['/', '/sell-gold'],
  'sell-gold':   ['/sell-gold'],
  'pledged-gold': ['/release-pledged-gold'],
  'gold-rate':   ['/gold-rate-today'],
};

function bust(page: string) {
  const paths = PAGE_PATHS[page] ?? [];
  paths.forEach(p => revalidatePath(p));
}

/* ─── GET /api/admin/faqs?page= ──────────────────────────────────── */

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const page = new URL(req.url).searchParams.get('page') ?? 'general';
  try {
    const rows = await getAllFaqsByPageAdmin(page);
    return NextResponse.json({ faqs: rows });
  } catch (err) {
    console.error('[api/admin/faqs] GET error:', err);
    return NextResponse.json({ faqs: [] });
  }
}

/* ─── POST /api/admin/faqs ───────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { page, question, answer, order } = await req.json() as {
    page: string; question: string; answer: string; order?: number;
  };

  if (!page || !question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: 'page, question, and answer are required' }, { status: 400 });
  }

  try {
    const row = await createFaq({ page, question: question.trim(), answer: answer.trim(), order });
    bust(page);
    return NextResponse.json({ faq: row }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/faqs] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── PATCH /api/admin/faqs ──────────────────────────────────────── */

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const body = await req.json() as {
    id?: number;
    orderedIds?: number[];
    page?: string;
    question?: string;
    answer?: string;
    is_active?: boolean;
    order?: number;
  };

  try {
    // Bulk reorder
    if (body.orderedIds) {
      await reorderFaqs(body.orderedIds);
      if (body.page) bust(body.page);
      return NextResponse.json({ ok: true });
    }

    // Single update
    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const { id, page, ...data } = body;
    await updateFaq(id, data);
    if (page) bust(page);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/admin/faqs] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── DELETE /api/admin/faqs?id= ─────────────────────────────────── */

export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id') ?? '', 10);
  const page = searchParams.get('page') ?? '';

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  try {
    await deleteFaq(id);
    if (page) bust(page);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/admin/faqs] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
