import { db, blogPosts } from '@/db';
import { eq, and, ne, desc } from 'drizzle-orm';
import type { NewBlogPost } from '@/db/schema';

/* ─── Public BlogPost type (used in page components) ─────────────── */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body_json: string; // Portable Text JSON string, or plain text for seed data
  category: 'Gold Rate' | 'Sell Gold' | 'Pledged Gold' | 'Market Insights' | 'News';
  cover_image_url?: string;
  published: boolean;
  published_at: string; // ISO date string
}

/* ─── Seed data (fallback when DB is not connected) ─────────────── */

const SEED_POSTS: BlogPost[] = [
  {
    id: 1,
    title: '22K Gold Rate Today in Karnataka — May 2026',
    slug: '22k-gold-rate-today-karnataka-may-2026',
    excerpt:
      'Live 22K gold rate in Karnataka updated from MCX. Find today\'s buying rate per gram and per 10 grams, with the MK Gold margin calculator.',
    body_json: [
      'Gold rates in Karnataka move in line with the MCX (Multi Commodity Exchange) benchmark, which updates continuously during market hours from 9:00 AM to 11:30 PM on trading days.',
      'For 22K gold, the rate is calculated by applying the purity factor of 91.67% to the 24K base rate. At MK Gold, we pay 97.5% of the live MCX rate — our margin is shown openly beside the MCX price on our rate widget.',
      'Current 22K gold rate in Karnataka (per 10 grams): MK Gold updates this figure every 5 minutes from the MCX feed. The rate you see on our website is within 5 minutes of the live market price.',
      'Understanding the 22K premium: 22K jewellery often carries making charges when bought from a jeweller. When selling, only the gold content matters — not the design. MK Gold pays on the exact purity confirmed by XRF spectrometry.',
      'Factors that move the gold price in Karnataka:\n— International gold prices (USD/troy oz) converted to INR at the current USD/INR exchange rate form the base.\n— Local supply, import duty, and GST on gold transactions all affect the final rate.\n— MCX gold futures reflect all these factors in one benchmark.',
      'If you are planning to sell your gold jewellery, you can use our calculator on the gold rate today page to estimate your payout based on the live rate.',
    ].join('\n\n'),
    category: 'Gold Rate',
    published: true,
    published_at: '2026-05-01T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'What Documents Do You Need to Sell Gold in Bangalore?',
    slug: 'documents-needed-sell-gold-bangalore',
    excerpt:
      'You only need one government ID to sell gold at MK Gold. Here is the complete document checklist and why MK Gold requires minimal paperwork.',
    body_json: [
      'Selling gold at MK Gold requires only one document: any valid government-issued photo ID. That is all.',
      'Accepted identity documents:\n— Aadhaar Card (most common — scan or original)\n— PAN Card\n— Passport\n— Voter ID Card\n— Driving Licence',
      'You do NOT need to bring the original purchase receipt, invoice, or hallmark certificate. MK Gold performs its own independent XRF purity test and pays based on the actual gold content — not what is printed on a certificate.',
      'Why do we need an ID at all?\n\nRBI regulations require gold buyers to record the identity of sellers for transactions above a certain threshold. This is a standard banking compliance requirement, not a barrier to selling. Your information is kept strictly confidential.',
      'For pledged gold release: If you are releasing gold pledged at a bank or NBFC, you will need to bring your original loan agreement or pledge card, along with your ID. The bank will need to be present or reachable to accept payment directly.',
      'Walk in with one ID and your gold. That is genuinely all you need at any of our 16 branches across Karnataka.',
    ].join('\n\n'),
    category: 'Sell Gold',
    published: true,
    published_at: '2026-04-22T09:00:00.000Z',
  },
  {
    id: 3,
    title: 'How to Release Pledged Gold from Muthoot Finance',
    slug: 'release-pledged-gold-muthoot-finance',
    excerpt:
      'If your gold is pledged at Muthoot Finance and you cannot repay the loan, MK Gold can help. Here is how the process works, step by step.',
    body_json: [
      'If your gold is pledged at Muthoot Finance and you are finding it difficult to repay the loan, MK Gold can help you release it — confidentially and without stress.',
      'How the process works:\n\nStep 1: Contact us with your pledge card or loan account details. You do not need to repay Muthoot Finance first.\n\nStep 2: Our team calculates the outstanding loan amount, any accrued interest, and the current market value of your gold.\n\nStep 3: If the gold value exceeds the outstanding amount, MK Gold pays Muthoot Finance directly — in front of you.\n\nStep 4: You receive the difference — gold value minus outstanding loan, minus our standard 2.5% margin.',
      'Example: If your gold is worth \u20b91,20,000 today and your outstanding Muthoot loan is \u20b970,000, MK Gold pays Muthoot \u20b970,000 and hands you \u20b944,100 (after our 2.5% margin on the gold value).',
      'Which lenders does MK Gold work with?\n\nWe currently work with Muthoot Finance, Manappuram Finance, IIFL Gold Loan, SBI Gold Loan, and all major nationalised banks and cooperative banks that offer gold loan products in Karnataka.',
      'This is a confidential service. Our staff will never discuss your situation outside the branch. You are not the first person to be in this situation — and you will not be judged.',
    ].join('\n\n'),
    category: 'Pledged Gold',
    published: true,
    published_at: '2026-04-10T09:00:00.000Z',
  },
];

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
    published:       Boolean(row.published),
    published_at:    row.published_at instanceof Date
      ? row.published_at.toISOString()
      : String(row.published_at),
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
    const all = SEED_POSTS.filter(p => p.published);
    return category && category !== 'All' ? all.filter(p => p.category === category) : all;
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
    return SEED_POSTS.find(p => p.slug === slug && p.published) ?? null;
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
    return SEED_POSTS
      .filter(p => p.published && p.category === category && p.slug !== excludeSlug)
      .slice(0, 3);
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
