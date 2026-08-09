import { NextResponse } from "next/server";
import { getActiveBanners } from "@/lib/db/banners";

export const revalidate = 300;

// No stale-while-revalidate: a stale response here would override fresh SSR data
// and cause newly-uploaded banners to disappear on the client.
const CACHE = {
  headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=0" },
};

export async function GET() {
  try {
    const banners = await getActiveBanners();
    return NextResponse.json({ banners }, CACHE);
  } catch {
    return NextResponse.json({ banners: [] }, CACHE);
  }
}
