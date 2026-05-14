import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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
    return NextResponse.json({ banners });
  } catch (err) {
    console.error('[api/admin/banners] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── POST — upload banner image ─────────────────────────────────── */

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const alt  = formData.get('alt') as string | null;

  if (!file || !alt) {
    return NextResponse.json({ error: 'file and alt are required' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }

  try {
    let src: string;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      // Vercel Blob REST API
      const filename = `banners/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const blobRes  = await fetch(`https://blob.vercel-storage.com/${filename}`, {
        method:  'PUT',
        headers: {
          Authorization:  `Bearer ${blobToken}`,
          'Content-Type': file.type,
        },
        body: file.stream(),
      });
      if (!blobRes.ok) throw new Error(`Blob upload failed: ${blobRes.status}`);
      const blobData = await blobRes.json() as { url: string };
      src = blobData.url;
    } else {
      // Local dev — save to public/banners/
      const filename  = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const dir       = join(process.cwd(), 'public', 'banners');
      await mkdir(dir, { recursive: true });
      const buffer    = Buffer.from(await file.arrayBuffer());
      await writeFile(join(dir, filename), buffer);
      src = `/banners/${filename}`;
    }

    const banner = await createBanner({ src, alt, order: 99 });
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/banners] POST error:', err);
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
    return NextResponse.json({ success: true, banners });
  } catch (err) {
    console.error('[api/admin/banners] PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
