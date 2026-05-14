import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getAllPostsAdmin,
  getPostByIdAdmin,
  createPost,
  updatePost,
  publishPost,
  deletePost,
  getPostBySlug,
} from '@/lib/db/blog';

const VALID_CATEGORIES = [
  'Gold Rate',
  'Sell Gold',
  'Pledged Gold',
  'Market Insights',
  'News',
] as const;

function isValidCategory(v: unknown): v is (typeof VALID_CATEGORIES)[number] {
  return VALID_CATEGORIES.includes(v as (typeof VALID_CATEGORIES)[number]);
}

/* ─── GET — all posts or single post by ?id= ─────────────────────── */

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');

  try {
    if (idParam) {
      const post = await getPostByIdAdmin(parseInt(idParam, 10));
      if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ post });
    }
    const posts = await getAllPostsAdmin();
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[api/admin/blog] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── POST — create post ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, slug, excerpt, body_json, category, cover_image_url, published } = body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'slug is required and must contain only lowercase letters, numbers, and hyphens' },
      { status: 400 },
    );
  }
  if (!excerpt || typeof excerpt !== 'string') {
    return NextResponse.json({ error: 'excerpt is required' }, { status: 400 });
  }
  if (!body_json || typeof body_json !== 'string') {
    return NextResponse.json({ error: 'body_json is required' }, { status: 400 });
  }
  if (!isValidCategory(category)) {
    return NextResponse.json(
      { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 },
    );
  }

  // Check slug uniqueness
  try {
    const existing = await getPostBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
  } catch {
    // DB may not be connected — proceed
  }

  const isPublished = Boolean(published);

  try {
    const post = await createPost({
      title:           title.trim(),
      slug,
      excerpt:         String(excerpt).trim(),
      body_json:       String(body_json),
      category,
      cover_image_url: cover_image_url ? String(cover_image_url) : undefined,
      published:       isPublished,
      published_at:    isPublished ? new Date() : undefined,
    });
    return NextResponse.json({ success: true, id: post.id }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/blog] POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── PATCH — update post ────────────────────────────────────────── */

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { id, published, ...fields } = body;

  if (!id || typeof id !== 'number') {
    return NextResponse.json({ error: 'id (number) is required' }, { status: 400 });
  }

  if (fields.category !== undefined && !isValidCategory(fields.category)) {
    return NextResponse.json(
      { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    // If published is changing to true, use publishPost for correct published_at timestamp
    if (published === true) {
      await publishPost(id);
    } else if (published === false) {
      await updatePost(id, { published: false, ...sanitiseFields(fields) });
    } else {
      await updatePost(id, sanitiseFields(fields));
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/blog] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── DELETE — delete post ───────────────────────────────────────── */

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
    await deletePost(body.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/blog] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── Helpers ────────────────────────────────────────────────────── */

function sanitiseFields(fields: Record<string, unknown>) {
  const allowed = ['title', 'slug', 'excerpt', 'body_json', 'category', 'cover_image_url'];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in fields) out[key] = fields[key];
  }
  return out;
}
