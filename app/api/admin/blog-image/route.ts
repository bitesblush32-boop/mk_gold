import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/admin-auth';

/* ─── POST — upload blog cover image ────────────────────────────── */

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

  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 });
  }

  try {
    let src: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Vercel Blob SDK — uploads to CDN and returns public URL
      const filename = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const blob = await put(filename, file, { access: 'public' });
      src = blob.url;
    } else {
      // Local dev — save to public/blog/
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const dir = join(process.cwd(), 'public', 'blog');
      await mkdir(dir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(dir, filename), buffer);
      src = `/blog/${filename}`;
    }

    return NextResponse.json({ success: true, url: src }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/blog-image] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
