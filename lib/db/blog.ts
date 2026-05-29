import { db, blogPosts } from '@/db';
import { eq, and, ne, desc } from 'drizzle-orm';
import type { NewBlogPost } from '@/db/schema';

/* ─── Public BlogPost type (used in page components) ─────────────── */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body_json: string; // HTML string (from rich-text editor) or plain text for legacy data
  category: 'Gold Rate' | 'Sell Gold' | 'Pledged Gold' | 'Market Insights' | 'News';
  cover_image_url?: string;
  is_featured: boolean;
  published: boolean;
  published_at: string; // ISO date string
  updated_at: string;   // ISO date string — used for SEO dateModified
}

/* ─── Row normaliser ─────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(row: any): BlogPost {
  return {
    id:              Number(row.id),
    title:           String(row.title),
    slug:            String(row.slug),
    excerpt:         String(row.excerpt),
    body_json:       String(row.body_json),
    category:        row.category as BlogPost['category'],
    cover_image_url: row.cover_image_url ? String(row.cover_image_url) : undefined,
    is_featured:     Boolean(row.is_featured),
    published:       Boolean(row.published),
    published_at:    row.published_at instanceof Date
      ? row.published_at.toISOString()
      : String(row.published_at),
    updated_at:      row.updated_at instanceof Date
      ? row.updated_at.toISOString()
      : String(row.updated_at ?? row.published_at),
  };
}

/* ─── Public read helpers ────────────────────────────────────────── */

export async function getPublishedPosts(category?: string): Promise<BlogPost[]> {
  try {
    const rows = category && category !== 'All'
      ? await db
          .select()
          .from(blogPosts)
          .where(and(eq(blogPosts.published, true), eq(blogPosts.category, category)))
          .orderBy(desc(blogPosts.published_at))
      : await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.published, true))
          .orderBy(desc(blogPosts.published_at));
    return rows.map(toPost);
  } catch {
    return [];
  }
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  try {
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.published, true), eq(blogPosts.is_featured, true)))
      .orderBy(desc(blogPosts.published_at))
      .limit(1);
    return row ? toPost(row) : null;
  } catch {
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
      .limit(1);
    return row ? toPost(row) : null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(category: string, excludeSlug: string): Promise<BlogPost[]> {
  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.category, category),
          ne(blogPosts.slug, excludeSlug),
        ),
      )
      .orderBy(desc(blogPosts.published_at))
      .limit(3);
    return rows.map(toPost);
  } catch {
    return [];
  }
}

/* ─── Admin CRUD helpers ─────────────────────────────────────────── */

export async function getAllPostsAdmin() {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.created_at));
  return rows.map(toPost);
}

export async function getPostByIdAdmin(id: number): Promise<BlogPost | null> {
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return row ? toPost(row) : null;
}

export async function createPost(data: Omit<NewBlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const [row] = await db.insert(blogPosts).values(data).returning();
  return toPost(row);
}

export async function updatePost(id: number, data: Partial<Omit<NewBlogPost, 'id' | 'created_at'>>) {
  const [row] = await db
    .update(blogPosts)
    .set({ ...data, updated_at: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return row ? toPost(row) : null;
}

export async function deletePost(id: number) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function publishPost(id: number) {
  const [row] = await db
    .update(blogPosts)
    .set({ published: true, published_at: new Date(), updated_at: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return row ? toPost(row) : null;
}

export async function unpublishPost(id: number) {
  const [row] = await db
    .update(blogPosts)
    .set({ published: false, updated_at: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return row ? toPost(row) : null;
}
