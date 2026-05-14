import { db, heroBanners } from '@/db';
import { eq, asc } from 'drizzle-orm';

export type { HeroBanner } from '@/db/schema';

/* ─── Read ───────────────────────────────────────────────────────── */

export async function getActiveBanners() {
  return db
    .select()
    .from(heroBanners)
    .where(eq(heroBanners.is_active, true))
    .orderBy(asc(heroBanners.order));
}

export async function getAllBanners() {
  return db.select().from(heroBanners).orderBy(asc(heroBanners.order));
}

/* ─── Create ─────────────────────────────────────────────────────── */

export async function createBanner(data: { src: string; alt: string; order?: number }) {
  const [row] = await db
    .insert(heroBanners)
    .values({ src: data.src, alt: data.alt, order: data.order ?? 99, is_active: true })
    .returning();
  return row;
}

/* ─── Update ─────────────────────────────────────────────────────── */

export async function updateBannerOrder(id: number, order: number) {
  await db.update(heroBanners).set({ order }).where(eq(heroBanners.id, id));
}

export async function toggleBanner(id: number, isActive: boolean) {
  await db.update(heroBanners).set({ is_active: isActive }).where(eq(heroBanners.id, id));
}

/* ─── Delete ─────────────────────────────────────────────────────── */

export async function deleteBanner(id: number) {
  await db.delete(heroBanners).where(eq(heroBanners.id, id));
}
