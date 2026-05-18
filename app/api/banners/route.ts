import { NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners';

export const revalidate = 300;

const CACHE = { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } };

export async function GET() {
  try {
    const banners = await getActiveBanners();
    return NextResponse.json({ banners }, CACHE);
  } catch {
    return NextResponse.json({ banners: [] }, CACHE);
  }
}
