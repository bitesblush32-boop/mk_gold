import { db, heroBanners } from '@/db';
import { eq, asc } from 'drizzle-orm';

export type { HeroBanner } from '@/db/schema';

/* ─── Default banners (Vercel Blob CDN) ─────────────────────────── */

const DEFAULT_BANNERS = [
  { src: 'https://pmcape3baplvglbo.public.blob.vercel-storage.com/banners/1778828487004-banner1.jpeg', alt: 'Turn your gold into instant cash - MK Gold Karnataka',    order: 0 },
  { src: 'https://pmcape3baplvglbo.public.blob.vercel-storage.com/banners/1778828526733-banner.jpeg',  alt: 'We buy your gold at the right value - MK Gold',            order: 1 },
  { src: 'https://pmcape3baplvglbo.public.blob.vercel-storage.com/banners/1778828536536-banner3.jpeg', alt: 'MK Gold - Instant Cash for Gold in Karnataka',              order: 2 },
  { src: 'https://pmcape3baplvglbo.public.blob.vercel-storage.com/banners/1778828917372-banner2.jpeg', alt: 'MK Gold branch - trusted gold buyers since 2014',           order: 3 },
];

export async function seedDefaultBanners() {
  for (const b of DEFAULT_BANNERS) {
    await db.insert(heroBanners).values({ ...b, is_active: true });
  }
}

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

export async function updateBannerAlt(id: number, alt: string) {
  await db.update(heroBanners).set({ alt }).where(eq(heroBanners.id, id));
}

export async function toggleBanner(id: number, isActive: boolean) {
  await db.update(heroBanners).set({ is_active: isActive }).where(eq(heroBanners.id, id));
}

/* ─── Delete ─────────────────────────────────────────────────────── */

export async function deleteBanner(id: number) {
  await db.delete(heroBanners).where(eq(heroBanners.id, id));
}

export async function deleteAllBanners() {
  await db.delete(heroBanners);
}
