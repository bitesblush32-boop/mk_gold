import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getAllBanners,
  createBanner,
  updateBannerOrder,
  updateBannerAlt,
  toggleBanner,
  deleteBanner,
  deleteAllBanners,
  seedDefaultBanners,
} from '@/lib/db/banners';

/* ─── GET — list all banners (admin view) ────────────────────────── */

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  try {
    let banners = await getAllBanners();
    // First-time setup: seed the existing public banner files into DB
    if (banners.length === 0) {
      await seedDefaultBanners();
      banners = await getAllBanners();
    }
    return NextResponse.json({ banners, blob_configured: !!process.env.BLOB_READ_WRITE_TOKEN });
  } catch (err) {
    console.error('[api/admin/banners] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── POST — save banner record ──────────────────────────────────── */
// Warn loudly at startup if the Blob token is missing — uploads will 403 on Vercel.
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    '[api/admin/banners] BLOB_READ_WRITE_TOKEN is not set. ' +
    'Vercel Blob uploads will fail with 403. ' +
    'Fix: Vercel Dashboard → Storage → [Blob store] → Access tokens → add token to env vars → redeploy.',
  );
}
/*
 * Accepts two shapes:
 *   A) JSON  { src: string, alt: string }   — after a client-side Vercel Blob upload
 *   B) FormData { file: File, alt: string } — localhost fallback (no BLOB_READ_WRITE_TOKEN)
 *
 * Shape A is used in production to bypass Vercel's 4.5 MB API-route body limit.
 * The file never passes through this route; only the CDN URL does.
 */
export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const contentType = req.headers.get('content-type') ?? '';

  /* ── Shape A: JSON { src, alt } ── */
  if (contentType.includes('application/json')) {
    let body: { src?: string; alt?: string; src_mobile?: string | null };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { src, alt, src_mobile } = body;
    if (!alt) {
      return NextResponse.json({ error: 'alt is required' }, { status: 400 });
    }
    // src and src_mobile: at least one must be non-empty
    if (!src && !src_mobile) {
      return NextResponse.json({ error: 'At least one of src or src_mobile is required' }, { status: 400 });
    }
    try {
      const banner = await createBanner({ src, alt, src_mobile: src_mobile || null, order: 99 });
      revalidatePath('/');
      revalidatePath('/api/banners');
      return NextResponse.json({ success: true, banner }, { status: 201 });
    } catch (err) {
      console.error('[api/admin/banners] POST (json) error:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  /* ── Shape B: FormData { file, alt } — localhost only ── */
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data or application/json' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const alt  = formData.get('alt') as string | null;

  if (!file || !alt) {
    return NextResponse.json({ error: 'file and alt are required' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size exceeds 5 MB limit' }, { status: 400 });
  }

  try {
    let src: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const filename = `banners/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const blob = await put(filename, file, { access: 'public' });
      src = blob.url;
    } else {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const dir      = join(process.cwd(), 'public', 'banners');
      await mkdir(dir, { recursive: true });
      const buffer   = Buffer.from(await file.arrayBuffer());
      await writeFile(join(dir, filename), buffer);
      src = `/banners/${filename}`;
    }

    const banner = await createBanner({ src, alt, order: 99 });
    revalidatePath('/');
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/banners] POST (formdata) error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── PATCH — update order or active state ───────────────────────── */

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: { id?: number; sort_order?: number; is_active?: boolean; alt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, sort_order, is_active, alt } = body;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    if (sort_order !== undefined) await updateBannerOrder(id, sort_order);
    if (is_active  !== undefined) await toggleBanner(id, is_active);
    if (alt        !== undefined) await updateBannerAlt(id, alt);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/banners] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── DELETE — remove banner ─────────────────────────────────────── */

export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: { id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    await deleteBanner(body.id);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/banners] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── PUT — reset all banners to defaults ────────────────────────── */

export async function PUT(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  try {
    await deleteAllBanners();
    await seedDefaultBanners();
    const banners = await getAllBanners();
    revalidatePath('/');
    return NextResponse.json({ success: true, banners });
  } catch (err) {
    console.error('[api/admin/banners] PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
