import { NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners';

export const revalidate = 300;

export async function GET() {
  try {
    const banners = await getActiveBanners();
    return NextResponse.json({ banners });
  } catch {
    return NextResponse.json({ banners: [] });
  }
}
